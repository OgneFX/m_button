import { useMutation } from "@tanstack/react-query";

interface ClickResponse {
  message: string;
  success: boolean;
}

type ClickPayload = {
  telegramId: number;
};

const sendClickRequest = async (
  payload: ClickPayload
): Promise<ClickResponse> => {
  const res = await fetch("https://my-button-back.onrender.com/api/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send click");
  }

  return res.json();
};

export const useClickButton = () => {
  return useMutation<ClickResponse, Error, ClickPayload>({
    mutationFn: sendClickRequest,
  });
};
