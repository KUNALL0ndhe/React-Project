import jwt from "jsonwebtoken";
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';


const verifyjwtToken = asyncHandler(async( req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

// const verifyjwtToken = asyncHandler(async (req, _, next) => {
//     try {
//         // Extract token from cookies or Authorization header
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         // Log the token for debugging purposes
//         console.log("Token:", token); // This will help to debug the token

//         // Ensure token is a valid string
//         if (!token || typeof token !== 'string') {
//             throw new ApiError(401, "Unauthorized Access: Token is missing or invalid.");
//         }

//         // Verify the token
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // Find user by ID from the decoded token
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//         if (!user) {
//             throw new ApiError(401, "Invalid Access Token");
//         }

//         // Attach user to the request object
//         req.user = user;

//         // Proceed to the next middleware
//         next();
//     } catch (error) {
//         // Log the error for debugging
//         console.error("Error verifying JWT:", error);

//         // Handle errors
//         throw new ApiError(401, error?.message || "Something went wrong while verifying the token.");
//     }
// });


export default verifyjwtToken;