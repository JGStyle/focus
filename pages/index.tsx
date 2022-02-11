import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";

const Home: NextPage = () => {
  const [progress, setProgress] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [status, setStatus] = useState("focus.");

  function handleClick() {
    setTimerActive((prev) => !prev);
    requestNotificationPermission();
  }

  function notifyUser(text: string) {
    const notification = new Notification("focus", {
      body: text,
    });
    const audio = new Audio("/notification.mp3");
    audio.play();
  }

  function requestNotificationPermission() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          notifyUser("You will be notified once the timer runs out.");
        }
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerActive) {
        if (seconds == 0) {
          if (minutes == 0) {
            if (status == "focus.") {
              setStatus("take a break.");
              if (Notification.permission === "granted") {
                notifyUser("take a break.");
              }
              setSeconds(0);
              setMinutes(5);
              setTimerActive(false);
            } else {
              setStatus("focus.");
              if (Notification.permission === "granted") {
                notifyUser("time to learn!");
              }
              setMinutes(25);
              setSeconds(0);
              setTimerActive(false);
            }
            setTimerActive(false);
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
            updateClock();
          }
        } else {
          setSeconds((prev) => prev - 1);
          updateClock();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  function updateClock() {
    let full = 0;
    if (status == "focus.") {
      full = 25 * 60;
    } else {
      full = 5 * 60;
    }
    let secs = minutes * 60 + seconds;
    let deg = (1 - secs / full) * 360;

    setProgress(deg);
  }

  return (
    <div>
      <Head>
        <meta name="apple-mobile-web-abb-capable" content="yes" />
        <meta name="mobile-web-abb-capable" content="yes" />
        <meta name="mobile-web-abb-title" content="focus" />
      </Head>
      <div className="h-screen flex flex-col items-center justify-center dark:bg-black">
        <h2 className="text-3xl font-black mb-3 dark:text-slate-300">
          {status}
        </h2>
        <div className="group w-56 h-56 rounded-full hover:rounded-8xl bg-black dark:bg-slate-300 hover:w-96 hover:h-80 flex flex-col items-center justify-center transition-all">
          <div
            className="h-56 group-hover:hidden transition-all"
            style={{ transform: "rotate(" + progress + "deg)" }}
          >
            <div className="w-3 h-14 mt-3 rounded-full bg-white dark:bg-slate-900 transform"></div>
          </div>
          <h2 className="absolute block group-hover:hidden text-white dark:text-slate-900 font-extrabold text-5xl">
            {minutes}
          </h2>
          <div className="flex flex-col items-center justify-center transform translate-y-16 group-hover:translate-y-0 transition-all">
            <h1 className="hidden group-hover:block text-white dark:text-black text-8xl font-black text-center transition-all">
              {minutes}:{seconds < 10 ? `0${seconds}` : `${seconds}`}
            </h1>
            <button
              onClick={handleClick}
              className="hidden group-hover:block bg-white dark:bg-black dark:text-white rounded-full px-6 py-2 transition-all transform hover:scale-105"
            >
              {timerActive ? "Pause" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
