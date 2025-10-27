import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToQuestions = () => {
    navigate("/questions");
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileItem}>
          <span className={styles.label}>Ник:</span>
          <span className={styles.value}>username</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Отвечено:</span>
          <span className={styles.value}>0</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Подписчики:</span>
          <span className={styles.value}>0</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Подписки:</span>
          <span className={styles.value}>0</span>
        </div>
        <div className={styles.profileItem}>
          <span className={styles.label}>Публикации:</span>
          <span className={styles.value}>0</span>
        </div>

        <button className={styles.button} onClick={handleGoToQuestions}>
          Перейти к вопросам
        </button>
      </div>
    </div>
  );
};
