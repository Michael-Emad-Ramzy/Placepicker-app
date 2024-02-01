import { useEffect, useRef, useState, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// this code is for when reload the page the places saved in the (places to save) not gone
//insted of this it remain in the same place.
const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIDs.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalISOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  //this useEffect hook is to excute this first arggument AFTER this app
  //components excutes so React will excute this side effect we path to this
  // useEffect AFTER the component function excuteion is done.
  //in specific react this function(side effect) wraped in useEffect
  //whenever the dependinces changes (in this case we have non so it excutes After app comp.)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.latitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []); //useEffect is a hook in React that enables performing side effects in functional
  //components. Side effects can include data fetching, subscriptions, manually changing
  //the DOM, or any operation that involves interactions with the outside world.

  function handleStartRemovePlace(id) {
    setModalISOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalISOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIDs.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIDs])
      );
    }
  }


  //this Callback Hook is used to avoid re-excute the function whenever it triggerd again,
  //only excute it when the component function re-excute.
  //useCallback returns that function that you wrapped.
  // so it mostly used when passing a function as dependencies to useEffect.
  const handleRemovePlace =useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalISOpen(false)

    const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIDs.filter((id) => id !== selectedPlace.current))
    );
  } , []);//this dependencies is used as the dependncies in the useEffect
  //you should add any props or state values that used in inside this wrapped funtion 

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="sorting places by distance... "
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
