import { useMutation } from "@tanstack/react-query";
import type { LaunchParams } from "@telegram-apps/sdk-react";

interface ApiResponse {
  message: string;
  success: boolean;
}

type userDataPayload = {
  regionId: number;
} & LaunchParams;

const registerUserRequest = async (
  userData: userDataPayload
): Promise<ApiResponse> => {
  const res = await fetch("https://my-button-back.onrender.com/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = res.json();
  return data;
};

export const useTelegramAuth = () => {
  return useMutation<ApiResponse, Error, userDataPayload>({
    mutationFn: registerUserRequest,
  });
};
