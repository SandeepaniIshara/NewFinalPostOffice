import type { createMail as CreateMailType, Mail } from "@/types/mail";
import apiClient from ".";

export const getMails = async (): Promise<{ mails: Mail[] }> => {
  const response = await apiClient.get("/mail");
  return response.data as { mails: Mail[] };
};

export const createMail = async ({
  senderId,
  receiverId,
  type,
  direction,
}: CreateMailType) => {
  const response = await apiClient.post("/mail", {
    senderId,
    receiverId,
    type,
    direction,
  });
  return response.data as Mail;
};

export const assignMialToDelivery = async (
  mailId: number,
  routerId: string
) => {
  const response = await apiClient.put(`/mail/${mailId}/assign`, {
    routingAreaId:routerId,
  });

  return response.data as Mail;
};

export const updateStatus = async (mailId: number, status: string) => {
  const response = await apiClient.put(`/mail/${mailId}/status`, {
    status,
  });
  return response.data as Mail;
};

export const deleteMail = async (mailId: number) => {
  await apiClient.delete(`/mail/${mailId}`);
};
