import React, { useState } from "react";
import styles from "./Home.module.scss";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import { useClickButton } from "../../hooks/client-server/useClick";
import { CountdownTimer } from "../../Components/HomeComponents/CountdownTimer/CountdownTimer";
import { HoloButton } from "../../Components/HomeComponents/HoloButton/HoloButton";
import { HoloRoundButton } from "../../Components/HomeComponents/HoloRoundButton/HoloRoundButton";
import { StarButton } from "../../Components/HomeComponents/TelegramStar/TelegramStar";
import { useTimeZoneLabel } from "../../hooks/utils/useTimeZoneLable";

interface HomeProps {
  userObj: LaunchParams;
  userData?: {
    timezone: string;
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
  userData,
  userObj,
  hasClickedToday = false,
  timer,
}) => {
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

  const timeZoneLabel = useTimeZoneLabel(userData?.timezone);

  return (
    <div className={styles.mainPanel}>
      {/* таймер */}
      <div className='timer-wrapper'>
        {timer && (
          <CountdownTimer
            serverNow={timer.serverTime}
            endsAt={timer.nextClickAvailableAt}
            isReady={hasClicked}
            timeZoneLabel={timeZoneLabel}
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
