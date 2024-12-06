import { Router } from "express";
import { 
    registerUser, 
    login, 
    logout,
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUSer,
    updateAccountdetails, 
    updateUserAvatar, 
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchedHistory
} from "../controllers/user.controller.js";
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
    userRouter.route("/refresh-token").post(refreshAccessToken)
    userRouter.route("/change-password").post(verifyjwtToken, changeCurrentPassword)
    userRouter.route("/current-user").post(verifyjwtToken, getCurrentUSer)
    userRouter.route("/update-account").patch(verifyjwtToken, updateAccountdetails)

    userRouter.route("/avatar").patch(verifyjwtToken, upload.single("avatar"), updateUserAvatar)
    userRouter.route("/cover-image").patch(verifyjwtToken, upload.single("coverImage"), updateUserCoverImage)

    userRouter.route("/c/:username").get(verifyjwtToken, getUserChannelProfile)
    userRouter.route("/history").get(verifyjwtToken, getWatchedHistory)


export default userRouter 