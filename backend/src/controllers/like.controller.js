import mongoose from "mongoose";
import Like from "../models/likes.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

//TODO: toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
   try {
     const {videoId} = req.params
     const  userId  = req.user?._id
 
     if (!videoId || !mongoose.isValidObjectId( videoId)) {
         throw new  ApiError(400, "videoID is missing or Invalid video Id")
     }
 
     if (!userId || !mongoose.isValidObjectId( userId)) {
        throw new  ApiError(400, "user is missing or Invalid user Id")
    }
 
    const existingLike = await Like.findOne({video: videoId , likedBy: userId});

    if (existingLike) {
        //Unlike the video
        const deleteLike = await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200, deleteLike, " Video unlike successfully")
        )
    }

    const createLike = await Like.create({ video: videoId, likedBy: userId })

    return res
    .status(200)
    .json(
        new ApiResponse(200, createLike, "Like Created successfully")
    )

   } catch (error) {
    console.error("Error toggling video like:", error);
    throw new ApiError(500, error.message || "Failed to toggle like on video");
  }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}