import React from "react";
import styles from "./Home.module.scss";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import { useClickButton } from "../../hooks/useClick";
import { CountdownTimer } from "../../Components/HomeComponents/CountdownTimer/CountdownTimer";
import { HoloButton } from "../../Components/HomeComponents/HoloButton/HoloButton";
import { HoloRoundButton } from "../../Components/HomeComponents/HoloRoundButton/HoloRoundButton";
import { StarButton } from "../../Components/HomeComponents/TelegramStar/TelegramStar";

interface HomeProps {
  userObj: LaunchParams;
}

export const Home: React.FC<HomeProps> = ({ userObj }) => {
  const withDonateAnimation = true;
  const { mutate } = useClickButton();

  const handleClick = () => {
    const telegramId = userObj.tgWebAppData?.user?.id;
    if (telegramId === undefined) return;
    mutate({ telegramId });
  };

  return (
    <div className={styles.mainPanel}>
      {/* таймер */}
      <div className='timer-wrapper'>
        <CountdownTimer initialTime='05:30' />
      </div>

      {/* кнопка */}
      <HoloButton
        text='Жмакай'
        withDonateAnimation={withDonateAnimation}
        onClick={handleClick}
      />
      {/* кнопка доната */}
      <HoloRoundButton icon={<StarButton />} />
    </div>
  );
};
