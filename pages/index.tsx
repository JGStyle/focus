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

  function switchTheme() {
    if (localStorage.theme === "light") {
      localStorage.theme = "dark";
    } else {
      localStorage.theme = "light";
    }
    adoptTheme();
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
        <div
          onClick={switchTheme}
          className="mt-2 mr-2 transform hover:scale-125 transition-all hover:cursor-pointer"
        >
          <svg
            id="icon"
            width="25pt"
            height="25pt"
            version="1.1"
            viewBox="0 0 700 700"
            fill="gray"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m350 420c-37.129 0-72.738-14.75-98.996-41.004-26.254-26.258-41.004-61.867-41.004-98.996s14.75-72.738 41.004-98.996c26.258-26.254 61.867-41.004 98.996-41.004s72.738 14.75 98.996 41.004c26.254 26.258 41.004 61.867 41.004 98.996s-14.75 72.738-41.004 98.996c-26.258 26.254-61.867 41.004-98.996 41.004zm0-233.33c-24.754 0-48.492 9.832-65.996 27.336s-27.336 41.242-27.336 65.996 9.832 48.492 27.336 65.996 41.242 27.336 65.996 27.336 48.492-9.832 65.996-27.336 27.336-41.242 27.336-65.996-9.832-48.492-27.336-65.996-41.242-27.336-65.996-27.336zm23.332 326.67v-23.336c0-8.3359-4.4453-16.039-11.664-20.207s-16.117-4.168-23.336 0-11.664 11.871-11.664 20.207v23.332c0 8.3359 4.4453 16.039 11.664 20.207 7.2188 4.168 16.117 4.168 23.336 0 7.2188-4.168 11.664-11.871 11.664-20.207zm0-443.34v-23.332c0-8.3359-4.4453-16.039-11.664-20.207-7.2188-4.168-16.117-4.168-23.336 0-7.2188 4.168-11.664 11.871-11.664 20.207v23.332c0 8.3359 4.4453 16.039 11.664 20.207s16.117 4.168 23.336 0 11.664-11.871 11.664-20.207zm-210 210c0-6.1875-2.457-12.125-6.832-16.5s-10.312-6.832-16.5-6.832h-23.332c-8.3359 0-16.039 4.4453-20.207 11.664-4.168 7.2188-4.168 16.117 0 23.336 4.168 7.2188 11.871 11.664 20.207 11.664h23.332c6.1875 0 12.125-2.457 16.5-6.832s6.832-10.312 6.832-16.5zm443.33 0h0.003907c0-6.1875-2.4609-12.125-6.8359-16.5s-10.309-6.832-16.5-6.832h-23.332c-8.3359 0-16.039 4.4453-20.207 11.664s-4.168 16.117 0 23.336 11.871 11.664 20.207 11.664h23.332c6.1914 0 12.125-2.457 16.5-6.832s6.8359-10.312 6.8359-16.5zm-405.06 181.54 16.332-16.566v-0.003906c5.1445-6.0039 6.8945-14.207 4.6523-21.793-2.2422-7.582-8.1758-13.516-15.758-15.758-7.5859-2.2422-15.789-0.49219-21.793 4.6523l-16.566 16.332h-0.003906c-4.4141 4.3828-6.8984 10.348-6.8984 16.566 0 6.2227 2.4844 12.188 6.8984 16.57 4.4062 4.3672 10.367 6.8008 16.57 6.7656 6.1992 0.035157 12.16-2.3984 16.566-6.7656zm313.36-313.6 16.566-16.332h0.003906c5.918-5.9219 8.2266-14.547 6.0625-22.633-2.168-8.0859-8.4805-14.398-16.566-16.566-8.0859-2.1641-16.711 0.14453-22.633 6.0625l-16.332 16.566v0.003906c-4.3438 4.3711-6.7852 10.285-6.7852 16.449s2.4414 12.078 6.7852 16.449c4.3711 4.3438 10.285 6.7852 16.449 6.7852s12.078-2.4414 16.449-6.7852zm-297.04 0h0.003906c4.3438-4.3711 6.7852-10.285 6.7852-16.449s-2.4414-12.078-6.7852-16.449l-16.332-16.566v-0.003906c-5.9219-5.918-14.547-8.2266-22.633-6.0625-8.0859 2.168-14.398 8.4805-16.566 16.566-2.1641 8.0859 0.14453 16.711 6.0625 22.633l16.566 16.332h0.003906c4.3711 4.3438 10.285 6.7852 16.449 6.7852s12.078-2.4414 16.449-6.7852zm313.61 313.6c4.4141-4.3828 6.8984-10.348 6.8984-16.57 0-6.2188-2.4844-12.184-6.8984-16.566l-16.566-16.332h-0.003906c-6.0039-5.1445-14.207-6.8945-21.793-4.6523-7.582 2.2422-13.516 8.1758-15.758 15.758-2.2422 7.5859-0.49219 15.789 4.6523 21.793l16.332 16.566v0.003906c4.4062 4.3672 10.367 6.8008 16.566 6.7656 6.2031 0.035157 12.164-2.3984 16.57-6.7656z" />
            <circle cx="350" cy="280" r="100" />
          </svg>
        </div>
      </header>
      {streak > 0 && (
        <h1 className="absolute top-0 right-1/2 md:top-1/2 md:right-0 transform translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 text-5xl font-bold bg-gray-200 dark:text-slate-300 dark:bg-gray-900 w-32 h-32 flex items-center justify-center rounded-b-full md:rounded-l-full md:rounded-br-none">
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
