import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware, requirePostal } from "../middlewares/authMiddleware";
import {
  CreateRoutingArea,
  DeleteRoutingArea,
  GetRoutingAreaById,
  GetRoutingAreas,
  UpdateRoutingArea,
} from "../controllers/routingAreaController";

const routingAreaRoute: Router = Router();

routingAreaRoute.use(errorHandler(authMiddleware));
routingAreaRoute.get(
  "/",
  errorHandler(requirePostal),
  errorHandler(GetRoutingAreas)
);
routingAreaRoute.get(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(GetRoutingAreaById)
);
routingAreaRoute.post(
  "/",
  errorHandler(requirePostal),
  errorHandler(CreateRoutingArea)
);
routingAreaRoute.put(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(UpdateRoutingArea)
);
routingAreaRoute.delete(
  "/:id",
  errorHandler(requirePostal),
  errorHandler(DeleteRoutingArea)
);

export default routingAreaRoute;
