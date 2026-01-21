import React, { useState } from "react";
import styles from "./HoloButton.module.scss";

interface HoloButtonProps {
  text: string;
  onClick?: () => void;
  withDonateAnimation?: boolean;
  isReady?: boolean;
}

export const HoloButton: React.FC<HoloButtonProps> = ({
  text,
  onClick,
  withDonateAnimation = false,
  isReady = false,
}) => {
  const [active, setActive] = useState(false);

  const handlePress = () => {
    if (isReady) return;
    setActive(true);
    onClick?.();
    setTimeout(() => setActive(false), withDonateAnimation ? 1200 : 300);
  };

  return (
    <button
      className={`${styles.holoButton} ${active ? styles.active : ""} ${
        withDonateAnimation ? styles.donate : ""
      } ${isReady ? styles.alreadyClicked : ""}`} // добавляем класс если уже нажата
      onMouseDown={handlePress}
      onTouchStart={handlePress}
      disabled={isReady} // стандартный disabled атрибут
      aria-disabled={isReady}
    >
      <span className={styles.text}>{text}</span>
      <span className={styles.glow}></span>
    </button>
  );
};
