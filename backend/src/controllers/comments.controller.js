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

   try {
     const { content } = req.body; // i will get this from the frontend
     const {videoId} = req.params; // i will get this from the search parameter
 
     const userId  = req.user?._id; // if user exists then search for _id
 
     if (!content || content.trim() === "" ) {
         throw new ApiError(400, "Content comment is missing or empty")
     }
 
     if (!videoId || !mongoose.isValidObjectId(videoId)) {
         throw new ApiError(400, "Invalid or missing Video ID")
     };
 
     if (!userId || !mongoose.isValidObjectId(userId)) {
         throw new ApiError(400, "Invalid or missing user ID")
     };
     
     // Creating Comment Model
     const createComment = await Comment.create({
         content,       // Content comment
         video: videoId,    // in video the video ID
         owner: userId,     // In the owner the user id
     });
 
     return res
     .status(201)
     .json( 
         new ApiResponse(
             201,
             createComment,
             "Comment added on Video"
         )
     )
   } catch (error) {
    throw new ApiError(500, error.message || "Failed to add comment");

   }
     
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    try {
        const userId = req.user?._id; // to get the user ID
        const { comment } = req.body; // new comment to add
        const { commentId } = req.params; // to get the comment ID from the search params

        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid or missing user ID") // check for userId and its valid object
        }
        if (!comment || comment.trim() === "")  {
            throw new ApiError(400, "Content comment is missing or empty")    // check for the comment is present to update
        }

        if (!commentId || !mongoose.isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid or missing commentId ID")
        };

        const existingComment = await Comment.findById(commentId);

        if (!existingComment) {
            throw new ApiError(404, "Comment not found")
        }

        if ( existingComment.owner?.toString() !== userId) {
            throw new ApiError(403, "You are not Authorized to update another's comment")
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: comment }, // Here the content field is updated by comment
            { new: true} // returns the new updated document 
        );

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedComment,
                "Comment updated Succesfully"
            )
        )

    } catch (error) {
        throw new ApiError(500, error.message || "Failed to update comment");   
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const userId = req.user?._id;
        const { commentId } = req.params;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid or missing user ID") // check for userId and its valid object
        }

        if (!commentId || !mongoose.isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid or missing commentId ID")
        };

        const existingComment = await Comment.findById(commentId);

        if (!existingComment) {
            throw new ApiError(404, "Comment not found ");
        }

        if (existingComment.owner?.toString() !== userId ) {
            throw new ApiError(403, "You are not authorized to delete this comment.")            
        }

        await Comment.findByIdAndDelete( commentId );

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Comment Deleted Successfully"
            )
        )

    } catch (error) {
        throw new ApiError(500, error.message || "Failed to delete a comment");   

    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }