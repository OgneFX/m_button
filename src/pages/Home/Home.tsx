import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";
import RedCartoonButton from "../../Components/Buttons/RedCartoonButton/RedCartoonButton";
import { BigButton } from "../../Components/Buttons/RebButton/BigButton";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToQuestions = () => {
    navigate("/questions");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0f0f10",
      }}
    >
      <BigButton />
      <button className={styles.button} onClick={handleGoToQuestions}>
        Перейти к вопросам
      </button>
    </div>
  );
};
