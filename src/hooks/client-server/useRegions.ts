import { useQuery } from "@tanstack/react-query";
import { localImages } from "../../Data/SliderRegistratiom";
import type { Region } from "../../interfaces/interfaces";

interface RegionsResponse {
  success: boolean;
  data: { id: number; name: string }[];
}

const fetchRegions = async (): Promise<Region[]> => {
  const res = await fetch("https://my-button-back.onrender.com/api/regions");
  if (!res.ok) throw new Error("Ошибка при запросе регионов");

  const json: RegionsResponse = await res.json();
  if (!json.success) throw new Error("Ошибка загрузки данных");

  return json.data.map((region) => ({
    ...region,
    image:
      localImages.find((img) => img.id === region.id)?.image || "/default.jpg",
  }));
};

export const useRegions = () => {
  return useQuery<Region[]>({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 5 * 60 * 1000,
  });
};
