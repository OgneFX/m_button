import { useQuery } from "@tanstack/react-query";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useCallback } from "react";

export const useCheckRegistration = () => {
  const userObj = useLaunchParams();
  const userId = userObj?.tgWebAppData?.user?.id;

  const checkRegistration = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      throw new Error("User ID is nit avalible");
    }

    const response = await fetch(
      `https://my-button-back.onrender.com/api/user/check?userId=${userId}`
    );

    const data = await response.json();
    return data.isRegistered === true;
  }, [userId]);

  const {
    data: isRegistered,
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
    isRegistered: isRegistered ?? false,
    isLoading,
    isError,
    refetch,
    userObj,
  };
};
