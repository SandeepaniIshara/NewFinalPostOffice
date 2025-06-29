import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware, requirePostal } from "../middlewares/authMiddleware";
import {
  CreateMail,
  DeleteMail,
  GetMailById,
  GetMails,
  UpdateMail,
} from "../controllers/mailController";

const mailRoute: Router = Router();

mailRoute.use(errorHandler(authMiddleware));
mailRoute.get("/", errorHandler(GetMails));
mailRoute.get("/:id", errorHandler(GetMailById));
mailRoute.post("/", errorHandler(requirePostal), errorHandler(CreateMail));
mailRoute.delete("/:id", errorHandler(requirePostal), errorHandler(DeleteMail));
mailRoute.put(
  "/:id/assign",
  errorHandler(requirePostal),
  errorHandler(UpdateMail)
);
mailRoute.put("/:id/status", errorHandler(UpdateMail));

export default mailRoute;
