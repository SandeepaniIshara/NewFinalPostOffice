import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware, requirePostal } from "../middlewares/authMiddleware";
import { deleteEmployee, getEmployees, updateEmployee } from "../controllers/employeeController";

const employeeRoute: Router = Router();

employeeRoute.use(errorHandler(authMiddleware));
employeeRoute.get("/", errorHandler(requirePostal), errorHandler(getEmployees));
employeeRoute.put("/:id", errorHandler(requirePostal), errorHandler(updateEmployee));
employeeRoute.delete(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(deleteEmployee)
);

export default employeeRoute;
