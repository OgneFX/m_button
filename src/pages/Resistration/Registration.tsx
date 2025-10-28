import { MoblieSlider } from "../../Components/Sliders/MobileSlider/MobileSlider";
import { DesktopSlider } from "../../Components/Sliders/DesktopSlider/DesktopSlider";
import { isMobile, isDesktop } from "react-device-detect";
import { mapImages } from "../../Data/SliderRegistratiom";
import { useTelegramAuth } from "../../hooks/useTelegramAuth";
import React, { useState } from "react";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import styles from "./Registration.module.scss";

interface RegistrationProps {
  userObj: LaunchParams;
  onSuccess: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({
  userObj,
  onSuccess,
}) => {
  const [regionIndex, setRegionIndex] = useState(0);

  const { mutate, isPending } = useTelegramAuth();

  const handleRegistrationClick = async () => {
    const payload = {
      ...userObj,
      regionIndex: mapImages[regionIndex].id,
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

  const checkDevice = () => {
    if (isMobile) {
      return (
        <MoblieSlider slides={mapImages} setRegionIndex={setRegionIndex} />
      );
    } else if (isDesktop) {
      return (
        <DesktopSlider slides={mapImages} setRegionIndex={setRegionIndex} />
      );
    }
  };

  return (
    <div className={styles.registration}>
      <h1 className={styles.registration__text}>
        {" "}
        {`Добро пожаловать в Society Mind Research`}
      </h1>

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
