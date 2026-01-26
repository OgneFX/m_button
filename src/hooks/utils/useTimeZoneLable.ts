import { useMemo } from "react";

const RU_TZ_ABBR: Record<string, string> = {
  "Europe/Moscow": "МСК",
  "Europe/Kaliningrad": "КЛГ",
  "Asia/Yekaterinburg": "ЕКТ",
  "Asia/Novosibirsk": "НСК",
  "Asia/Krasnoyarsk": "КРС",
  "Asia/Irkutsk": "ИРК",
  "Asia/Yakutsk": "ЯКТ",
  "Asia/Vladivostok": "ВЛД",
  "Asia/Magadan": "МГД",
  "Asia/Kamchatka": "КМЧ",
};

const getGMTOffset = (iana: string): string => {
  try {
    const parts = new Intl.DateTimeFormat("ru-RU", {
      timeZone: iana,
      timeZoneName: "short",
    }).formatToParts(new Date());

    const tz = parts.find((p) => p.type === "timeZoneName")?.value;

    // ru-RU может вернуть "GMT+3" или "UTC+3"
    return tz?.replace("UTC", "GMT") ?? "";
  } catch {
    return "";
  }
};

export const useTimeZoneLabel = (iana?: string) => {
  return useMemo(() => {
    if (!iana) return "";

    const abbr = RU_TZ_ABBR[iana] ?? iana;
    const gmt = getGMTOffset(iana);

    return gmt ? `${abbr} / ${gmt}` : abbr;
  }, [iana]);
};
