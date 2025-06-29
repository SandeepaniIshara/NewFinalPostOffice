import { Router } from "express";
import { errorHandler } from "../error-handler";

import { SignIn, SignOut, SignUp } from "../controllers/authController";

const authRouter: Router = Router();

authRouter.post("/signup", errorHandler(SignUp));
authRouter.post("/signin", errorHandler(SignIn));
authRouter.post("/signout", errorHandler(SignOut));

export default authRouter;
