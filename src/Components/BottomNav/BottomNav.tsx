import React from "react";
import styles from "./BottomNav.module.scss";

type BottomNavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
};

interface BottomNavProps {
  items: BottomNavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  return (
    <nav className={styles.bottomNav}>
      {items.map((item) => {
        const buttonClass =
          styles.navButton + " " + (item.active ? styles.active : "");

        return (
          <button key={item.id} className={buttonClass} onClick={item.onClick}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>

            {/* glow слой как у holo-кнопок */}
            <span className={styles.glow} />
          </button>
        );
      })}
    </nav>
  );
};
