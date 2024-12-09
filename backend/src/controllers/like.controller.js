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
        const deleteLike = await Like.findOneAndDelete({video: videoId , likedBy: userId})

        if (!deleteLike) {
            throw new ApiError(400, "Failed to Unlike the Video")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, null, " Video unlike successfully")
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
    try {
        const {commentId} = req.params
        //TODO: toggle like on comment
    
        const userId = req.user?._id;

        if (!commentId || !mongoose.isValidObjectId(commentId)) {
            throw new  ApiError(400, "commentId is missing or Invalid comment Id")
        }

        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new  ApiError(400, "userId is missing or Invalid user Id")
        }

        const existingLike = await Like.findOne({ comment: commentId, likedBy: userId }) // To find the exact comment id and user id

        if (existingLike) {
        const unlikeComment = await Like.findOneAndDelete( {comment: commentId, likedBy: userId }) // used this as .remove() is deprecated
                                                                                                        // As i want to delete exact comment of user

            if (!unlikeComment) {
            throw new ApiError(400, "Failed to Unlike the Comment")    
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, null, "Comment Deleted Successfully") // send the deleted user as to be updated
            )
        }

        const createComment = await Like.create( {comment: commentId, likedBy: userId})

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createComment,
                "Comment created successfully"
            )
        )
    
    }  catch (error) {
        console.error("Error toggling comment like:", error);
        throw new ApiError(500, error.message || "Failed to toggle like on comment");
      }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id;

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new  ApiError(400, "tweetId is missing or Invalid tweet Id")
    }
    
    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new  ApiError(400, "userId is missing or Invalid user Id")
    }

    const existingLike = await Like.findOne( {likedBy: userId, tweet: tweetId } )

    if (existingLike) {
        const deleteTweet = await Like.findOneAndDelete( { likedBy: userId, tweet: tweetId } );

        if (!deleteTweet) {
            throw new ApiError(404, "Cannot unlike the tweet");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
            200,
            null,
            "Tweet unlike successfully"
            )
        )
    }

    const createTweetLiked = await Like.create({ likedBy: userId, tweet: tweetId })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createTweetLiked,
            "Tweet liked successfully"
        )
    )
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