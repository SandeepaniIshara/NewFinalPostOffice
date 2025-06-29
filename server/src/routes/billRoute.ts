import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware, requirePostal } from "../middlewares/authMiddleware";
import { CreateBill,  GetBills } from "../controllers/billController";

const billRoute: Router = Router();

billRoute.use(errorHandler(authMiddleware));
billRoute.get("/", errorHandler(requirePostal), errorHandler(GetBills));
billRoute.post("/", errorHandler(requirePostal), errorHandler(CreateBill));

export default billRoute;
