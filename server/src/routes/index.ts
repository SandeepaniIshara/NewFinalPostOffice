import { Router } from "express";

import authRouter from "./authRoute";
import customerRoute from "./customerRoute";
import routingAreaRoute from "./routingAreaRoute";
import mailRoute from "./mailRoute";
import billRoute from "./billRoute";
import employeeRoute from "./employeeRoute";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/customer", customerRoute);
rootRouter.use("/routingArea", routingAreaRoute);
rootRouter.use("/mail", mailRoute);
rootRouter.use("/bill", billRoute);
rootRouter.use("/employee", employeeRoute);

rootRouter.get("/test", (req, res) => {
  res.status(200).json({
    message: "Hello from root router",
  });
});

export default rootRouter;
