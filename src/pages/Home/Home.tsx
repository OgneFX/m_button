import React, { useState } from "react";
import styles from "./Home.module.scss";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import { useClickButton } from "../../hooks/useClick";
import { CountdownTimer } from "../../Components/HomeComponents/CountdownTimer/CountdownTimer";
import { HoloButton } from "../../Components/HomeComponents/HoloButton/HoloButton";
import { HoloRoundButton } from "../../Components/HomeComponents/HoloRoundButton/HoloRoundButton";
import { StarButton } from "../../Components/HomeComponents/TelegramStar/TelegramStar";

interface HomeProps {
  userObj: LaunchParams;
  userData?: {
    streakDays: number;
    regionId: number;
  };
  hasClickedToday?: boolean;
  timer?: {
    serverTime: string;
    nextClickAvailableAt: string;
  };
}

export const Home: React.FC<HomeProps> = ({
  userObj,
  hasClickedToday = false,
  timer,
}) => {
  console.log("Мы в Home", timer);
  const withDonateAnimation = true;
  const { mutate } = useClickButton();

  const [hasClicked, setHasClicked] = useState(hasClickedToday);
  const handleClick = () => {
    const telegramId = userObj.tgWebAppData?.user?.id;
    if (telegramId === undefined) return;
    mutate(
      { telegramId },
      {
        onSuccess: () => {
          setHasClicked(true);
        },
      },
    );
  };

  return (
    <div className={styles.mainPanel}>
      {/* таймер */}
      <div className='timer-wrapper'>
        {timer && (
          <CountdownTimer
            serverNow={timer.serverTime}
            endsAt={timer.nextClickAvailableAt}
            isReady={hasClicked}
          />
        )}
      </div>

      {/* кнопка */}
      <HoloButton
        text='Жмакай'
        withDonateAnimation={withDonateAnimation}
        onClick={handleClick}
        isReady={hasClicked}
      />
      {/* кнопка доната */}
      <HoloRoundButton icon={<StarButton />} />
    </div>
  );
};
