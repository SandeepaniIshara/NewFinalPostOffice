import { z } from "zod";

export const MailSchema = z.object({
  senderId: z.number().min(1, { message: "Sender ID is required" }),
  receiverId: z.number().min(1, { message: "Receiver ID is required" }),
  type: z.enum(["LETTER", "PARCEL", "DOCUMENT"], {
    errorMap: () => ({ message: "Type is required" }),
  }),
  direction: z.enum(["INCOMING", "OUTGOING"], {
    errorMap: () => ({ message: "Direction is required" }),
  }),
});
