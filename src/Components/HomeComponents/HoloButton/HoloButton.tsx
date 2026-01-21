import React, { useState } from "react";
import styles from "./HoloButton.module.scss";

interface HoloButtonProps {
  text: string;
  onClick?: () => void;
  withDonateAnimation?: boolean;
}

export const HoloButton: React.FC<HoloButtonProps> = ({
  text,
  onClick,
  withDonateAnimation = false,
}) => {
  const [active, setActive] = useState(false);

  const handlePress = () => {
    setActive(true);
    onClick?.();
    setTimeout(() => setActive(false), withDonateAnimation ? 1200 : 300);
  };

  return (
    <button
      className={`${styles.holoButton} ${active ? styles.active : ""} ${
        withDonateAnimation ? styles.donate : ""
      }`}
      onMouseDown={handlePress}
      onTouchStart={handlePress}
    >
      <span className={styles.text}>{text}</span>
      <span className={styles.glow}></span>
    </button>
  );
};
