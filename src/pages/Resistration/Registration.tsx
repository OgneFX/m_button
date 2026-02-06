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

export const Registration: React.FC<RegistrationProps> = ({
  userObj,
  onSuccess,
}) => {
  const [selectedCountryId, setSelectedCountryId] = useState<number>(0);
  const [selectedRegionId, setSelectedRegionId] = useState<number>(0);
  const [selectedTimezone, setSelectedTimezone] =
    useState<string>("Europe/Moscow");

  const { mutate, isPending } = useTelegramAuth();
  const { data, isLoading, isError } = useRegions();

  const { countries, allRegions: regions, timezones: timezone } = data || {};

  const filteredRegions =
    regions?.filter((region) => region.countryId === selectedCountryId) || [];

  const defaultTimezone = timezone?.[0]?.name || "";

  const handleRegistrationClick = async () => {
    if (!regions || !timezone) return;
    const payload = {
      ...userObj,
      regionId: selectedRegionId,
      timezone: selectedTimezone,
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
  if (isError || !regions?.length || !countries?.length || !timezone?.length)
    return <p>Ошибка загрузки регионов</p>;

  const checkDevice = () => {
    if (isMobile) {
      return (
        <MoblieSlider
          slides={countries}
          setCountryIndex={setSelectedCountryId}
        />
      );
    } else if (isDesktop) {
      return (
        <DesktopSlider
          slides={countries}
          setCountryIndex={setSelectedCountryId}
        />
      );
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
          value={defaultTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
        >
          {timezone.map((tz) => (
            <option key={tz.id} value={tz.name}>
              {`${tz.name}/${tz.offset}`}
            </option>
          ))}
        </select>
      </div>

      {selectedCountryId > 0 && filteredRegions.length > 0 && (
        <div className={styles.registration__region}>
          <label htmlFor='region-select'>Выберите регион:</label>
          <select
            id='region-select'
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(Number(e.target.value))}
          >
            {filteredRegions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
