import { useState , useEffect } from "react";

export default function ProgressBar({timer}){
    const [remainingTime, setRemainingTime] = useState(timer);

    
  useEffect(() => {
    //this function setInterval is kind of related to set time out
    //but it define a function that will be excuted every couble of millisecound that i give
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };  
  }, []);

  return (      
  <progress value={remainingTime} max={timer} /> 
  )
}