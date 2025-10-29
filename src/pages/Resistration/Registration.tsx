import { MoblieSlider } from "../../Components/Sliders/MobileSlider/MobileSlider";
import { DesktopSlider } from "../../Components/Sliders/DesktopSlider/DesktopSlider";
import { isMobile, isDesktop } from "react-device-detect";
import { useTelegramAuth } from "../../hooks/useTelegramAuth";
import React, { useState } from "react";
import type { LaunchParams } from "@telegram-apps/sdk-react";
import styles from "./Registration.module.scss";
import { useRegions } from "../../hooks/useRegions";

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
  const { data: regions, isLoading, isError } = useRegions();

  const handleRegistrationClick = async () => {
    if (!regions) return;
    const payload = {
      ...userObj,
      regionId: regions[regionIndex]?.id,
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
