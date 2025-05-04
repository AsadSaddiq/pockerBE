import express from "express";
import userRoute from "../main/user/user.routes.js";
import authRoute from "../main/auth/auth.routes.js";

// const protectedRouter = express.Router();
const unProtectedRouter = express.Router();

unProtectedRouter.use("/user", userRoute);
unProtectedRouter.use("/auth", authRoute);

export { unProtectedRouter };
