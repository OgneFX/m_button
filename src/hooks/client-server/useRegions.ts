import { useQuery } from "@tanstack/react-query";
import { localImages } from "../../Data/SliderRegistratiom";
import type { CountriesForRegistration } from "../../interfaces/interfaces";

interface RegionsResponse {
  success: boolean;
  data: {
    countries: Country[];
    timezones: Timezone[];
  };
}

interface Country {
  id: number;
  name: string;
  regions: Region[];
}

interface Timezone {
  id: number;
  name: string;
  offset: string;
}

interface Region {
  id: number;
  name: string;
  countryId: number;
}

const fetchRegions = async (): Promise<{
  countries: CountriesForRegistration[];
  timezones: Timezone[];
  allRegions: Region[];
}> => {
  const res = await fetch("https://my-button-back.onrender.com/api/regions");
  if (!res.ok) throw new Error("Ошибка при запросе регионов");

  const json: RegionsResponse = await res.json();
  if (!json.success) throw new Error("Ошибка загрузки данных");
  console.log("Данные в хуке", json);
  const allCountries: CountriesForRegistration[] = json.data.countries.map(
    (country) => ({
      id: country.id,
      name: country.name,
      image:
        localImages.find((img) => img.id === country.id)?.image ||
        "/default-country.jpg",
    }),
  );

  const allRegions: Region[] = json.data.countries.flatMap((country) =>
    country.regions.map((region) => ({
      ...region,
    })),
  );
  return {
    countries: allCountries,
    timezones: json.data.timezones,
    allRegions,
  };
};

export const useRegions = () => {
  return useQuery<{
    countries: CountriesForRegistration[];
    timezones: Timezone[];
    allRegions: Region[];
  }>({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 5 * 60 * 1000,
  });
};
