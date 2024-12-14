import mongoose from "mongoose";
import Comment from "../models/comments.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid or missing Video ID")
    }

    const options  = {
        page: parseInt(page, 10),
        limit: parseInt(limit,10),
        sort: { createdAt: -1 } // uses newest comment first
    }

   try {
     const comment = await Comment.aggregatePaginate(
         Comment.aggregate([
             {
                 $match: {
                     video: new mongoose.Types.ObjectId(videoId)
                 }
             },
             {
                 $lookup: {
                     from: "users",
                     localField: "owner",
                     foreignField: "_id",
                     as: "owner"
                 },
             },
             {
                 $unwind: "$owner" //Bind Whole array document in mongoDb and merges it to one object
             },
             {
                 $project: {
                     content: 1,
                     owner: { username: 1, avatar: 1 },
                     createdAt: 1,
                 }
             }
         ]),options
     )

     if (!comment.docs.length) {
        throw new ApiError(404, "No comment not found for this video")
     }
 
 return res
 .status(200)
 .json(
     new ApiResponse(200, comment, "All the comments are Fetched")
 )
   } catch (error) {
    throw new ApiError(400, error.message || "Invalid Request to list the comment")
   }

})
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }