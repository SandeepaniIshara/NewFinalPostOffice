import { Router } from "express";
import { errorHandler } from "../error-handler";
import {
  CreateCustomer,
  DeleteCustomer,
  GetCustomerById,
  GetCustomers,
  UpdateCustomer,
} from "../controllers/customerController";
import { authMiddleware, requirePostal } from "../middlewares/authMiddleware";

const customerRoute: Router = Router();

customerRoute.use(errorHandler(authMiddleware));
customerRoute.get("/", errorHandler(requirePostal), errorHandler(GetCustomers));
customerRoute.get(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(GetCustomerById)
);
customerRoute.post(
  "/",
  errorHandler(requirePostal),
  errorHandler(CreateCustomer)
);
customerRoute.put(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(UpdateCustomer)
);
customerRoute.delete(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(DeleteCustomer)
);

export default customerRoute;
