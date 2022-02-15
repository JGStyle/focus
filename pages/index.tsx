import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";

const Home: NextPage = () => {
  const [worktime, setWorktime] = useState(25);
  const [pausetime, setPausetime] = useState(5);

  const [progress, setProgress] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [status, setStatus] = useState("focus.");
  const [flag, setFlag] = useState(true);
  const [streak, setStreak] = useState(0);

  function handleClick() {
    setTimerActive((prev) => !prev);
    requestNotificationPermission();
    if (flag) {
      setFlag(false);
    }
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
          const audio = new Audio("/notification.mp3");
          audio.play();
        }
      });
    }
  }

  function increaseStreak() {
    setStreak((prev) => prev + 1);
  }

  useEffect(() => {
    adoptTheme();
    const interval = setInterval(() => {
      if (timerActive) {
        if (seconds == 0) {
          if (minutes == 0) {
            if (status == "focus.") {
              setStatus("take a break.");
              if (Notification.permission === "granted") {
                notifyUser("take a break.");
              }
              increaseStreak();
              setMinutes(pausetime);
            } else {
              setStatus("focus.");
              if (Notification.permission === "granted") {
                notifyUser("time to learn!");
              }
              setMinutes(worktime);
            }
            setProgress(0);
            setSeconds(0);
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
      full = worktime * 60;
    } else {
      full = pausetime * 60;
    }
    let secs = minutes * 60 + seconds;
    let deg = (1 - secs / full) * 360;

    setProgress(deg);
  }

  function handleSelectTheme(selected: string) {
    switch (selected) {
      case "light":
        localStorage.theme = "light";
        break;
      case "dark":
        localStorage.theme = "dark";
        break;
      default:
        localStorage.removeItem("theme");
        break;
    }
    adoptTheme();
  }

  function adoptTheme() {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <div>
      <Head>
        <title>
          {minutes}:{seconds} - {status}
        </title>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="focus" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-title" content="focus" />
      </Head>
      <header className="flex flex-row-reverse dark:bg-black">
        <select
          name="theme"
          className="bg-white dark:bg-black text-gray-600 appearance-none"
          onChange={(e) => {
            handleSelectTheme(e.target.value);
          }}
        >
          <option value="system">theme</option>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </header>
      {streak > 0 && (
        <h1 className="absolute top-0 right-1/2 md:top-1/2 md:right-0 transform translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 text-5xl font-bold bg-gray-200 dark:text-white dark:bg-gray-900 w-32 h-32 flex items-center justify-center rounded-b-full md:rounded-l-full md:rounded-br-none">
          {streak}
        </h1>
      )}
      <div className="h-screen max-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
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
        <div className="mt-20"></div>

        <footer className="w-full dark:text-gray-500 absolute bottom-0 transform translate-y-14 hover:translate-y-0 transition-all">
          <div
            className="text-center h-40 text-2xl"
            style={{ lineHeight: "10rem" }}
          >
            ↑
          </div>
          <div className="flex justify-center h-12">
            <div className="mr-2">
              <input
                type="text"
                name="minutes"
                value={worktime}
                onChange={(e) => {
                  if (!isNaN(parseInt(e.target.value))) {
                    setWorktime(parseInt(e.target.value));
                  } else {
                    setWorktime(25);
                  }
                  if (flag) {
                    setMinutes(parseInt(e.target.value));
                  }
                }}
                onFocus={(e) => e.target.select()}
                className="w-6 bg-transparent text-center"
              />
              min ⇄
              <input
                type="text"
                name="minutes"
                value={pausetime}
                onChange={(e) => {
                  if (!isNaN(parseInt(e.target.value))) {
                    setPausetime(parseInt(e.target.value));
                  } else {
                    setPausetime(5);
                  }
                }}
                onFocus={(e) => e.target.select()}
                className="w-6 bg-transparent text-center"
              />
              min
            </div>
            •
            <a
              className="ml-2 hover:underline mr-2"
              href="https://github.com/JGStyle"
            >
              Made by JGS v1.6
            </a>
            •
            <button
              className="hover:underline ml-2 inline-flex"
              onClick={() =>
                alert(
                  "if you have problems with the notifications, make sure to enable autoplay and allow notifications. for other help, contact jgs+support@jws.de"
                )
              }
            >
              help
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
