import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    try {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "HealthCheck done, connected with the server."
            )
        )
    } catch (error) {
        console.error("Something went wrong while connecting the server. ")
        throw new ApiError(500, error.message || "Error something went wrong")
    }
})

export {
    healthcheck
    }