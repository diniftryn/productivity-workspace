import { useState, useEffect, useRef } from "react";
import "../css/PomodoroTimer.css";
import clickStart from "../assets/clickStart.mp3";
import click from "../assets/click.mp3";
import alarm from "../assets/alarm.mp3";

export default function PomodoroTimer() {
  const [sessionLength, setSessionLength] = useState(1500);
  const [breakLength, setBreakLength] = useState(300);

  const [timer, setTimer] = useState(1500);
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [isSession, setIsSession] = useState(false);
  const [sessionType, setSessionType] = useState("Session");

  const audioRef = useRef();
  let hasStarted = timerIntervalId !== null; // check timer state

  const audioRefClickStart = useRef(new Audio(clickStart));
  const audioRefClick = useRef(new Audio(click));
  // audioRefClick.current.volume = 0.4;
  const audioRefAlarm = useRef(new Audio(alarm));
  // audioRefAlarm.current.volume = 0.4;

  // // update timer display
  useEffect(() => {
    if (timer === 0) {
      audioRefAlarm.current.play();
      if (sessionType === "Session") {
        setSessionType("Break");
        setTimer(breakLength);
      } else {
        setSessionType("Session");
        setTimer(sessionLength);
      }
    }
  }, [timer, sessionType]);

  useEffect(() => {
    setTimer(sessionLength);
  }, [sessionLength]);

  useEffect(() => {
    let time = secondsToTime(timer);
    setTimerMinutes(time[0]);
    setTimerSeconds(time[1]);
  }, [timer]);

  function toggleCountDown() {
    if (hasStarted) {
      // started mode
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
      setTimerIntervalId(null);
    } else {
      // stopped mode
      // create accurate date timer with date
      const newIntervalId = setInterval(() => {
        setTimer(prevTime => {
          let newTime = prevTime - 1;
          let time = secondsToTime(newTime);
          setTimerMinutes(time[0]);
          setTimerSeconds(time[1]);
          return newTime;
        });
      }, 1000);
      setTimerIntervalId(newIntervalId);
    }
  }

  // return minutes and seconds of seconds
  function secondsToTime(seconds) {
    return [Math.floor(seconds / 60), seconds % 60];
  }

  // zero paddings if < 10
  function formatDisplayTime(time) {
    if (time < 10) {
      return `0${time}`;
    } else {
      return time;
    }
  }

  function handleBreakLengthChange(e) {
    if (hasStarted) return; // guard against change when running

    if (e.target.id === "break-decrement" && breakLength > 60) {
      setBreakLength(prevVal => prevVal - 60);
    } else if (e.target.id === "break-increment" && breakLength < 3600) {
      setBreakLength(prevVal => prevVal + 60);
    }
  }

  function handleSessionLengthChange(e) {
    if (hasStarted) return; // guard against change when running

    if (e.target.id === "session-decrement" && sessionLength > 60) {
      setSessionLength(prevVal => prevVal - 60);
    } else if (e.target.id === "session-increment" && sessionLength < 3600) {
      setSessionLength(prevVal => prevVal + 60);
    }
  }

  function handleResetTimer() {
    audioRef?.current?.load();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    setTimerIntervalId(null);
    setSessionLength(1500);
    setBreakLength(300);
    setSessionType("Session");
    setTimer(1500);
  }

  return (
    <div className="Pomodoro">
      <h2>Pomodoro Timer</h2>
      {/* Controls */}
      {/* <div className="length-controls">
            <div className="length-control">
              <p id="break-label">Break Length</p>
              <div className="length-control-btns">
                <button id="break-decrement" onClick={e => handleBreakLengthChange(e)}>
                  &lt;
                </button>
                <div id="break-length">{Math.floor(breakLength / 60)}</div>
                <button id="break-increment" onClick={e => handleBreakLengthChange(e)}>
                  &gt;
                </button>
              </div>
            </div>

            <div className="length-control">
              <p id="session-label">Session Length</p>
              <div className="length-control-btns">
                <button id="session-decrement" onClick={e => handleSessionLengthChange(e)}>
                  &lt;
                </button>
                <div id="session-length">{sessionLength / 60}</div>
                <button id="session-increment" onClick={e => handleSessionLengthChange(e)}>
                  &gt;
                </button>
              </div>
            </div>
          </div> */}

      {/* Timer */}
      <div className="timer">
        {/* <p id="timer-label">{sessionType}</p> */}
        <div id="time-left">
          {formatDisplayTime(timerMinutes)}:{formatDisplayTime(timerSeconds)}
        </div>
      </div>

      <div className="timer-control">
        <button
          id="start_stop"
          className="pomo-btn"
          onClick={e => {
            if (hasStarted) {
              audioRefClick.current.play();
            } else {
              audioRefClickStart.current.play();
            }
            toggleCountDown();
          }}
        >
          {hasStarted ? "Pause" : "Start"}
        </button>
        <button
          id="reset"
          className="pomo-btn"
          onClick={() => {
            audioRefClick.current.play();
            handleResetTimer();
          }}
        >
          Reset
        </button>
        {/* <audio id="click" preload="auto" ref={audioRefClick} src="https://www.myinstants.com/en/instant/button-click-93467/?utm_source=copy&utm_medium=share" /> */}
        {/* <audio id="beep" preload="auto" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" /> */}
      </div>
    </div>
  );
}
