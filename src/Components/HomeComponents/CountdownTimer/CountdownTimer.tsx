import React, { useState, useEffect, useCallback } from "react";
import styles from "./CountdownTimer.module.scss";

interface CountdownTimerProps {
  initialTime?: string;
  onTimeUpdate?: (time: string) => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime = "00:00",
  onTimeUpdate,
  className = "",
}) => {
  const [time, setTime] = useState(initialTime);
  const [isLowTime, setIsLowTime] = useState(false);

  const parseTime = useCallback((timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  }, []);

  const checkLowTime = useCallback((hours: number, minutes: number) => {
    return hours === 0 && minutes < 5;
  }, []);

  // Форматирование времени
  const formatTime = useCallback((hours: number, minutes: number) => {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const { hours, minutes } = parseTime(initialTime);
    setIsLowTime(checkLowTime(hours, minutes));
  }, [initialTime, parseTime, checkLowTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const { hours, minutes } = parseTime(prevTime);

        // Если время истекло
        if (hours === 0 && minutes === 0) {
          clearInterval(timer);
          return "00:00";
        }

        let newMinutes = minutes;
        let newHours = hours;

        // Уменьшаем время
        if (newMinutes === 0) {
          newMinutes = 59;
          newHours = Math.max(0, hours - 1);
        } else {
          newMinutes = minutes - 1;
        }

        const newTime = formatTime(newHours, newMinutes);

        // Проверяем, стало ли время низким
        setIsLowTime(checkLowTime(newHours, newMinutes));

        // Вызываем колбэк
        onTimeUpdate?.(newTime);

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUpdate, parseTime, formatTime, checkLowTime]);

  // Собираем CSS-классы
  const timerClasses = `${styles.countdownTimer} ${className} ${
    isLowTime ? styles.lowTime : ""
  }`;

  return (
    <div className={timerClasses}>
      <div className={styles.timerDigits}>
        {time.split("").map((char, index) => (
          <div
            key={index}
            className={`${styles.digit} ${
              char === ":" ? styles.colon : styles.number
            }`}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
};
