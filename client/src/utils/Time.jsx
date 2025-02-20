import { useState, useEffect } from 'react';
import '../utils/css/Time.css';

function Clock() {
  let AMPM = false;
  const [time, setTime] = useState(getTime());
  const [date, setDate] = useState(getDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTime());
      setDate(getDate());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  function getTime() {
    const now = new Date();
    if (AMPM) {
      return now.toLocaleTimeString();
    } else {
      return now.toTimeString().substr(0, 8);
    }
  }

  function getDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="Clock Box">
      <div className="time-container">
        <div>{date}</div>
        <div>{time}</div>
      </div>
    </div>
  );
}

export default Clock;