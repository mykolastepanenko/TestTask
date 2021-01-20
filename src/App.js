import React, { useState } from "react";
import { Observable } from "rxjs";
import "./App.css";

let seconds = 0;
let hours = 0;
let minutes = 0;
let mytimer;

let stream$ = new Observable((observable) => {
  mytimer = setInterval(() => {
    seconds++;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes == 60) {
      minutes = 0;
      hours++;
    }
    observable.next(seconds);
  }, 1000);
});

function App() {
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hour, setHour] = useState(0);
  const [allowStart, setStart] = useState(true);
  const [allowWait, setWait] = useState(false);
  const [allowReset, setReset] = useState(false);
  let clickTimer = 0;

  function startSubscription() {
    stream$.subscribe((val) => {
      setSec(seconds);
      setMin(minutes);
      setHour(hours);
      setWait(true);
      setReset(true);
    });
  }

  function startStop() {
    setStart(!allowStart);
    if (allowStart == true) {
      startSubscription();
    } else {
      zeroing();
      setWait(false);
      setReset(false);
    }
  }

  function wait() {
    let time = new Date().getTime();
    if (time - clickTimer < 300 && allowWait == true) {
      clearInterval(mytimer);
      setStart(!allowStart);
      setReset(true);
    }
    clickTimer = time;
  }

  function reset() {
    if (allowStart == false || allowReset == true) {
      setStart(false);
      zeroing();
      startSubscription();
    }
  }

  function zeroing() {
    hours = 0;
    minutes = 0;
    seconds = 0;
    setHour(0);
    setMin(0);
    setSec(0);
    clearInterval(mytimer);
  }

  return (
    <div className="App">
      <h1>Тестовое задание Николая Степаненка</h1>
      <h2>Секундомер</h2>
      <div className="timer">
        <div className="result">
          <span>{(hour < 10 && "0" + hour.toString()) || hour}</span>
          <span>:</span>
          <span>{(min < 10 && "0" + min.toString()) || min}</span>
          <span>:</span>
          <span>{(sec < 10 && "0" + sec.toString()) || sec}</span>
        </div>
        <div className="btn-container">
          <button className="btn" onClick={startStop}>
            Start / Stop
          </button>
          <button className="btn" onClick={wait}>
            Wait
          </button>
          <button className="btn" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
