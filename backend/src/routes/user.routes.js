import { Router } from "express";
import { registerUser, login, logout  } from "../controllers/user.controller.js";
import verifyjwtToken from "../middlewares/auth.middleware.js";
import upload  from "../middlewares/multer.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]), registerUser)

    userRouter.route("/login").post(login)

    // Secure User

    userRouter.route("/logout").post(verifyjwtToken, logout)

export default userRouter 