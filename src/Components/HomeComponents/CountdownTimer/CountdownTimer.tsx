import React, { useState, useEffect, useCallback } from "react";
import styles from "./CountdownTimer.module.scss";

interface CountdownTimerProps {
  initialTime?: string;
  className?: string;
  targetTime?: string; // Время сброса (по умолчанию 00:00 MSK)
  isReady?: boolean; // Флаг: выполнена ли задача сегодня
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  className = "",
  targetTime = "00:00",
  isReady = true,
}) => {
  const [time, setTime] = useState("00:00");
  const [isLastHour, setIsLastHour] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  // Получение текущей даты в формате DD.MM.YYYY по МСК
  const getCurrentDate = useCallback(() => {
    const now = new Date();
    const mskOffset = 3; // MSK = UTC+3
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const mskTime = new Date(utc + 3600000 * mskOffset);

    return mskTime.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // Получение текущего времени в МСК
  const getMoscowTime = useCallback(() => {
    const now = new Date();
    const mskOffset = 3;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const mskTime = new Date(utc + 3600000 * mskOffset);

    return {
      hours: mskTime.getHours(),
      minutes: mskTime.getMinutes(),
      seconds: mskTime.getSeconds(),
    };
  }, []);

  // Расчет времени до сброса (по умолчанию 00:00 MSK)
  const calculateTimeToReset = useCallback(() => {
    const now = getMoscowTime();
    const targetHours = parseInt(targetTime.split(":")[0]);
    const targetMinutes = parseInt(targetTime.split(":")[1]);

    let hoursLeft = targetHours - now.hours;
    let minutesLeft = targetMinutes - now.minutes;
    let secondsLeft = 60 - now.seconds;

    if (secondsLeft === 60) {
      secondsLeft = 0;
      minutesLeft += 1;
    }

    if (minutesLeft < 0) {
      minutesLeft += 60;
      hoursLeft -= 1;
    }

    if (hoursLeft < 0) {
      hoursLeft += 24;
    }

    return { hoursLeft, minutesLeft, secondsLeft };
  }, [targetTime, getMoscowTime]);

  // Проверка, остался ли последний час (менее 60 минут)
  const checkIsLastHour = useCallback((hours: number, minutes: number) => {
    return hours === 0 && minutes > 0;
  }, []);

  // Форматирование времени
  const formatTime = useCallback(
    (hours: number, minutes: number, seconds?: number) => {
      if (seconds !== undefined && hours === 0) {
        // Формат MM:SS для последнего часа
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    },
    [],
  );

  // Инициализация
  useEffect(() => {
    const date = getCurrentDate();
    setCurrentDate(date);

    const { hoursLeft, minutesLeft, secondsLeft } = calculateTimeToReset();
    const lastHour = checkIsLastHour(hoursLeft, minutesLeft);
    setIsLastHour(lastHour);

    const initialTimeStr = lastHour
      ? formatTime(0, minutesLeft, secondsLeft)
      : formatTime(hoursLeft, minutesLeft);

    setTime(initialTimeStr);
  }, [getCurrentDate, calculateTimeToReset, checkIsLastHour, formatTime]);

  // Таймер
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(() => {
        const { hoursLeft, minutesLeft, secondsLeft } = calculateTimeToReset();
        const lastHour = checkIsLastHour(hoursLeft, minutesLeft);
        setIsLastHour(lastHour);

        return lastHour
          ? formatTime(0, minutesLeft, secondsLeft)
          : formatTime(hoursLeft, minutesLeft);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeToReset, checkIsLastHour, formatTime]);

  // Собираем CSS-классы
  const timerClasses = `${styles.countdownTimer} ${className} ${
    isLastHour ? styles.lastHour : ""
  }`;

  const dateClasses = `${styles.dateDisplay} ${
    isReady ? styles.donated : styles.notDonated
  }`;

  return (
    <div className={timerClasses}>
      <div className={styles.timerWrapper}>
        <div className={styles.timerDigits}>
          {time.split("").map((char, index) => (
            <div
              key={index}
              className={`${styles.digit} ${
                char === ":" ? styles.colon : styles.number
              } ${isLastHour ? styles.lastHourDigit : ""}`}
            >
              {char}
            </div>
          ))}
        </div>
        <div className={styles.timeFormat}>
          {isLastHour ? "MM:SS" : "HH:MM"}
        </div>
      </div>

      <div className={dateClasses}>
        <span className={styles.dateText}>{currentDate}</span>
        <span className={styles.timeZone}>МСК</span>
      </div>
    </div>
  );
};
