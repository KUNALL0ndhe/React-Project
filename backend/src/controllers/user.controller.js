import { asyncHandler } from "../utils/asyncHandler.js";
import  ApiError  from "../utils/ApiError.js";
import User from '../models/user.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessandRefreshToken = async (userId) => {
    try {
        // Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = await user.generateAccessToken();
        console.log("Access Token:", accessToken);

        const refreshToken = await user.generateRefreshToken();
        console.log("Refresh Token:", refreshToken);


        // Validate token generation
        if (!accessToken || typeof accessToken !== 'string') {
            throw new ApiError(500, "Failed to generate access token");
        }
        if (!refreshToken || typeof refreshToken !== 'string') {
            throw new ApiError(500, "Failed to generate refresh token");
        }

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        // Log error for debugging
        console.error("Error generating tokens:", error);

        // Throw a detailed error
        throw new ApiError(500, error.message || "Error generating access and refresh tokens");
    }
};

const registerUser = asyncHandler( async (req, res ) => {
    // res.status(200).json({
    //     message: "OK Youtube"
    // })

    const {fullName, email, username, password} = req.body
    // console.log(`email :`, email);

    if (
        [
        fullName,
        email,
        username,
        password,
    ].some( (field) => field?.trim() === "" )) {
        throw new ApiError(400, "All Feilds are required");
    } 

    const existedUser = await User.findOne({
        $or: [
            {
                username
            },
            {
                email
            },
        ]})
    
        if  (existedUser) {
            throw new ApiError(409, "User Already Existed");
        }


        const avatarLocalPath = req.files?.avatar[0]?.path // to check from multer in express to check about the files

        // let coverImagePath = req.files?.coverImage[0].path;
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is required");

        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar is needed")
        }

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong, Server Side issue");
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User Created Successfully")
        )
} );

const login = asyncHandler (async (req, res) => {
    const {username, email, password } = req.body;

    console.log(email);


    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")        
    // };

   const user =  await User.findOne({
        $or : [ {username}, {email} ]
    });

    if (!user) {
        throw new ApiError(404, "Account does not exist");
    };

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { refreshToken, accessToken } = await generateAccessandRefreshToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly : true,
        secure: true,
    };


    return res.
    status(201)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken",refreshToken, option)
    .json(
        new ApiResponse(200,{
            user: loggedInUser, accessToken, refreshToken
        },
    "User created Succesfully")
    )
    
})

const logout = asyncHandler( async( req, res ) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken',options)
    .json(
        new ApiResponse(200, {}, "user Logged out successfully ")
    )


})

export {registerUser, login, logout, generateAccessandRefreshToken}