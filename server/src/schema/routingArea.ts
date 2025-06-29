import { z } from "zod";

export const RoutingAreaSchema = z.object({
  area: z.string(),
  deliverId: z.string(),
});
