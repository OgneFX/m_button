import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.scss";
// import RedCartoonButton from "../../Components/Buttons/RedCartoonButton/RedCartoonButton";
import { BigButton } from "../../Components/Buttons/RebButton/BigButton";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import { useClickButton } from "../../hooks/useClick";

interface HomeProps {
  userObj: LaunchParams;
}

export const Home: React.FC<HomeProps> = ({ userObj }) => {
  const navigate = useNavigate();

  const { mutate } = useClickButton();

  const handleClick = () => {
    const telegramId = userObj.tgWebAppData?.user?.id;
    if (telegramId === undefined) return;
    mutate({ telegramId });
  };

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
      <div onClick={handleClick}>
        <BigButton />
      </div>
      <button className={styles.button} onClick={handleGoToQuestions}>
        Перейти к вопросам
      </button>
    </div>
  );
};
