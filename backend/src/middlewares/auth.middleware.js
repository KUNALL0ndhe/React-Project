import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/user.model';


const verifyjwtToken = asyncHandler(async( req, res, next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "UnAuthorized Access");
        }

        const decodeToken  = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid acces token")
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(402, "Something went wrong in refresh token or access token ")
    }   
})

export default verifyjwtToken;