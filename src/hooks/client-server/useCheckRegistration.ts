import { useQuery } from "@tanstack/react-query";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useCallback } from "react";

interface CheckRegistrationResponse {
  isRegistered: boolean;
  user?: {
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

export const useCheckRegistration = () => {
  const userObj = useLaunchParams();
  const userId = userObj?.tgWebAppData?.user?.id;

  const checkRegistration =
    useCallback(async (): Promise<CheckRegistrationResponse> => {
      if (!userId) {
        throw new Error("User ID is not avalible");
      }

      const response = await fetch(
        `https://my-button-back.onrender.com/api/user/check?userId=${userId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to check registration");
      }

      const data = await response.json();
      return data;
    }, [userId]);

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["checkRegistration", userId],
    queryFn: checkRegistration,
    enabled: !!userId,
    retry: 1,
  });

  return {
    isRegistered: responseData?.isRegistered ?? false,
    userData: responseData?.user,
    hasClickedToday: responseData?.hasClickedToday ?? false,
    timer: responseData?.timer,
    isLoading,
    isError,
    refetch,
    userObj,
  };
};
