import { MoblieSlider } from "../../Components/Sliders/MobileSlider/MobileSlider";
import { DesktopSlider } from "../../Components/Sliders/DesktopSlider/DesktopSlider";
import { isMobile, isDesktop } from "react-device-detect";
import { useTelegramAuth } from "../../hooks/client-server/useTelegramAuth";
import React, { useState } from "react";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import styles from "./Registration.module.scss";
import { useRegions } from "../../hooks/client-server/useRegions";

interface RegistrationProps {
  userObj: LaunchParams;
  onSuccess: () => void;
}

const timezones = [
  "Europe/Moscow",
  "Europe/Kaliningrad",
  "Asia/Yekaterinburg",
  "Asia/Novosibirsk",
  "Asia/Krasnoyarsk",
  "Asia/Irkutsk",
  "Asia/Yakutsk",
  "Asia/Vladivostok",
  "Asia/Magadan",
  "Asia/Kamchatka",
];

export const Registration: React.FC<RegistrationProps> = ({
  userObj,
  onSuccess,
}) => {
  const [regionIndex, setRegionIndex] = useState(0);
  const [timezone, setTimezone] = useState(timezones[0]);
  const { mutate, isPending } = useTelegramAuth();
  const { data: regions, isLoading, isError } = useRegions();

  const handleRegistrationClick = async () => {
    if (!regions) return;
    const payload = {
      ...userObj,
      regionId: regions[regionIndex]?.id,
      timezone,
    };

    mutate(payload, {
      onSuccess: (response) => {
        if (response.success) {
          console.log("Регистрация успешна:");
          onSuccess();
        } else {
          console.log("Ошибка регистрации");
        }
      },
      onError: (err) => {
        console.error("Ошибка", err);
      },
    });
  };

  if (isLoading) return <p>Загрузка регионов...</p>;
  if (isError || !regions?.length) return <p>Ошибка загрузки регионов</p>;

  const checkDevice = () => {
    if (isMobile) {
      return <MoblieSlider slides={regions} setRegionIndex={setRegionIndex} />;
    } else if (isDesktop) {
      return <DesktopSlider slides={regions} setRegionIndex={setRegionIndex} />;
    }
  };

  return (
    <div className={styles.registration}>
      <h1 className={styles.registration__text}>
        {" "}
        {`Добро пожаловать в Society Mind Research`}
      </h1>

      <div className={styles.registration__timezone}>
        <label htmlFor='timezone-select'>Выберите часовой пояс:</label>
        <select
          id='timezone-select'
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {checkDevice()}
      <button
        className={styles.registration__button}
        onClick={handleRegistrationClick}
        disabled={isPending}
      >
        {" "}
        {isPending ? "Отправка..." : "Выбрать"}{" "}
      </button>
    </div>
  );
};
