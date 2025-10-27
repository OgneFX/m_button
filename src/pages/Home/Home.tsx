import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";
import RedCartoonButton from "../../Components/RedCartoonButton/RedCartoonButton";

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
      <RedCartoonButton
        size={260}
        label='Щёлк!'
        onClick={() => console.log("Clicked!")}
      />
      <button className={styles.button} onClick={handleGoToQuestions}>
        Перейти к вопросам
      </button>
    </div>
  );
};
