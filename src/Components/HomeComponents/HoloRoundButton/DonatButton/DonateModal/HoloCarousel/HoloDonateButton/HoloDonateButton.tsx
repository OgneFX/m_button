import React from "react";
import styles from "./HoloDonateButton.module.scss";
import StarIcon from "../../../../../../../Assets/telegram-star.svg?react";

interface HoloDonateButtonProps {
  amount: number;
  onClick: (amount: number) => void;
}

export const HoloDonateButton: React.FC<HoloDonateButtonProps> = ({
  amount,
  onClick,
}) => {
  const handleClick = () => {
    onClick(amount);
    console.log(amount);
  };

  return (
    <button onClick={handleClick} className={styles.holoDonateButton}>
      <div className={styles.btnGroup}>
        {amount}
        <StarIcon className={styles.starIcon} />
      </div>
    </button>
  );
};
