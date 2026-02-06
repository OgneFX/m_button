// import { MoblieSlider } from "../../Components/Sliders/MobileSlider/MobileSlider";
// import { DesktopSlider } from "../../Components/Sliders/DesktopSlider/DesktopSlider";
// import { isMobile, isDesktop } from "react-device-detect";
import { useTelegramAuth } from "../../hooks/client-server/useTelegramAuth";
import React, { useMemo, useState } from "react";
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
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [regionSearch, setRegionSearch] = useState<string>("");

  const { mutate, isPending } = useTelegramAuth();
  const { data, isLoading, isError } = useRegions();
  console.log("Данные", data);

  const { countries, allRegions: regions, timezone } = data || {};

  const filteredRegions = useMemo(() => {
    if (!regions) return [];

    const filteredByCountry = regions.filter(
      (region) => region.countryId === selectedCountryId,
    );

    if (!regionSearch.trim()) return filteredByCountry;

    return filteredByCountry.filter((region) =>
      region.name.toLowerCase().includes(regionSearch.toLowerCase()),
    );
  }, [regions, selectedCountryId, regionSearch]);

  React.useEffect(() => {
    if (filteredRegions.length > 0 && selectedRegionId === 0) {
      setSelectedRegionId(filteredRegions[0].id);
    }
  }, [filteredRegions]);

  React.useEffect(() => {
    if (timezone?.length && !selectedTimezone) {
      setSelectedTimezone(timezone[0].name);
    }
  }, [timezone]);

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

  // const checkDevice = () => {
  //   if (isMobile) {
  //     return (
  //       <MoblieSlider
  //         slides={countries}
  //         setSelectedCountryId={setSelectedCountryId}
  //       />
  //     );
  //   } else if (isDesktop) {
  //     return (
  //       <DesktopSlider
  //         slides={countries}
  //         setSelectedCountryId={setSelectedCountryId}
  //       />
  //     );
  //   }
  // };

  return (
    <div className={styles.registration}>
      <h1 className={styles.registration__text}> {`Society Mind Research`}</h1>

      {/* {checkDevice()} */}

      <div className={styles.registration__country}>
        <label htmlFor='country-search'>Выберите страну:</label>

        <div className={styles.searchWrapperCountry}>
          <input
            type='text'
            id='country-search'
            placeholder='Поиск страны...'
            value={regionSearch}
            onChange={(e) => setRegionSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={selectedCountryId}
          onChange={(e) => setSelectedCountryId(Number(e.target.value))}
          className={styles.countrySelect}
          size={5}
        >
          {countries?.length > 0 ? (
            countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))
          ) : (
            <option disabled>Страны не найдены</option>
          )}
        </select>
      </div>

      <div className={styles.registration__region}>
        <label htmlFor='region-search'>Выберите регион:</label>

        <div className={styles.searchWrapper}>
          <input
            type='text'
            id='region-search'
            placeholder='Поиск региона...'
            value={regionSearch}
            onChange={(e) => setRegionSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={selectedRegionId}
          onChange={(e) => setSelectedRegionId(Number(e.target.value))}
          className={styles.regionSelect}
          size={5} // Показываем несколько вариантов
        >
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))
          ) : (
            <option disabled>Регионы не найдены</option>
          )}
        </select>
      </div>

      <div className={styles.registration__timezone}>
        <label htmlFor='timezone-select'>Выберите часовой пояс:</label>
        <select
          id='timezone-select'
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
        >
          {timezone.map((tz) => (
            <option key={tz.id} value={tz.name}>
              {tz.name} ({tz.offset})
            </option>
          ))}
        </select>
      </div>

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
