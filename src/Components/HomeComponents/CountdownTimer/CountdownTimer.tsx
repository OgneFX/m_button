import React, { useEffect, useMemo, useState } from "react";
import styles from "./CountdownTimer.module.scss";

interface CountdownTimerProps {
  serverNow: string;
  endsAt: string;
  isReady?: boolean;
  className?: string;
  timeZoneLabel?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  serverNow,
  endsAt,
  isReady = false,
  className = "",
  timeZoneLabel = "UNK",
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // 1️⃣ смещение серверного времени
  const serverOffset = useMemo(() => {
    return new Date(serverNow).getTime() - Date.now();
  }, [serverNow]);

  // 2️⃣ дата (берём из serverNow)
  const currentDate = useMemo(() => {
    const date = new Date(serverNow);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [serverNow]);

  // 3️⃣ таймер
  useEffect(() => {
    const update = () => {
      const now = Date.now() + serverOffset;
      const diff = new Date(endsAt).getTime() - now;

      setTimeLeft(Math.max(diff, 0));
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [endsAt, serverOffset]);

  // 4️⃣ форматирование
  const { formattedTime, isLastHour } = useMemo(() => {
    const totalSeconds = Math.floor(timeLeft / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours === 0) {
      return {
        formattedTime: `${String(minutes).padStart(2, "0")}:${String(
          seconds,
        ).padStart(2, "0")}`,
        isLastHour: true,
      };
    }

    return {
      formattedTime: `${String(hours).padStart(2, "0")}:${String(
        minutes,
      ).padStart(2, "0")}`,
      isLastHour: false,
    };
  }, [timeLeft]);

  // 5️⃣ классы (ВОТ ТУТ БЫЛА ОШИБКА)
  const timerClasses = `${styles.countdownTimer} ${className} ${
    isLastHour ? styles.lastHour : ""
  }`;

  return (
    <div className={timerClasses}>
      <div className={styles.timerWrapper}>
        <div className={styles.timerDigits}>
          {formattedTime.split("").map((char, index) => (
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

      <div
        className={`${styles.dateDisplay} ${
          isReady ? styles.donated : styles.notDonated
        }`}
      >
        <span className={styles.dateText}>{currentDate}</span>
        <span className={styles.timeZone}>{timeZoneLabel}</span>
      </div>
    </div>
  );
};
