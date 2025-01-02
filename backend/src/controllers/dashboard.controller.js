import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import Like from "../models/likes.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
   try {
    const {channelId} = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid or missing channel ID");        
    }

        // Count subscribers (using the channelId in the Subscription model)
    const countSubscriber = await Subscription.countDocuments({ channel : channelId })

        // Count videos (using the channelId in the owner field of the Video model)
    const countVideo = await Video.countDocuments({ owner: channelId});

    const totalLikedVideo = await Like.aggregate([
        {
            $lookup: {
                from: "videos",          // We are joining with the 'videos' collection
                localField: "video",     // 'video' is the field in the 'likes' collection
                foreignField: "_id",     // '_id' is the field in the 'videos' collection
                as: "videoDetails"       // Alias the result as 'videoDetails'
            }
        },
        {
            $unwind: "$videoDetails"   // Unwind 'videoDetails' to access its fields
        },
        {
            $match: {
                "videoDetails.owner": new mongoose.Types.ObjectId(channelId) // Match the 'owner' field of the video with the channelId
            }
        },
        {
            $group: {
                _id: null,               // Group everything together into one document
                totalLikes: { $sum: 1 }  // Count the total number of likes
            }
        }
    ]);

        // Access the count of likes
    const totalLikes = totalLikedVideo.length > 0 ? totalLikedVideo[0].totalLikes : 0;

    const totalViewedVideo = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }

    ]);

            // Access the count of views
    const totalViews = totalViewedVideo.length > 0 ? totalViewedVideo[0].totalViews : 0;

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                countSubscriber,
                countVideo,
                totalLikes,
                totalViews,
            },
            "Channel Stats fetched Successfully."
        )
    )

   } catch (error) {
    console.error("Error while getting the Stats", error);
    throw new ApiError(500,error.message || "Failed to get the stats")
   }
})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    try {

        const { channelId } = req.params;

        if (!mongoose.isValidObjectId(channelId)) {
            throw new ApiError(400, "Invalid or missing channel ID");        
        }

        const getAllVideos = await Video.find({owner: channelId})
        .select("_id title description views createdAt")
        .sort({ createdAt: -1 });

        if (getAllVideos.length === 0) {
            throw new ApiError(404, "No videos found for this channel")  
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                getAllVideos,
                "Videos fetched successfully."
            )
        )
        
    } catch (error) {
        console.error("Error while getting the videos", error);
        throw new ApiError(500,error.message || "Failed to get the videos")
    }
})

export {
    getChannelStats, 
    getChannelVideos
    }