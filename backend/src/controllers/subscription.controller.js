import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    
    try {
        const {channelId} = req.params //to get the user channel id from the subscription model
        const subscriberId = req.user?._id //to get the user id as subscription id from the subscription model

        if (!channelId || !isValidObjectId(channelId)) {
            throw new ApiError(400, "Invalid or missing channel ID")
        }

        if (!subscriberId || !isValidObjectId(subscriberId)) {
            throw new ApiError(400, "Invalid or missing subscriber ID")            
        }

        if (subscriberId.equals(channelId)) {
            throw new ApiError(403, "You cannot subscribe to your own channel")
        }

        const existingSubscriber = await Subscription.findOne({
            subscriber: subscriberId,
            channel: channelId,
        });

        if (existingSubscriber) {
            await Subscription.findByIdAndDelete(existingSubscriber._id)
            // I cannot search for the subscriberID becase it is extracted from the req.user which needs to be filtered,
            return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "You have successfully unsubscribed"
            )
        )
        };

        // To create a new subscription 
            const newSubscriber = await Subscription.create({
                subscriber: subscriberId,
                channel: channelId,
            })

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newSubscriber,
                "You have Successfully subscribed to the channel"
            )
        )
        
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to toggle subscription action");   
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
   try {
     const {channelId} = req.params
 
     if (!channelId || !isValidObjectId(channelId)) {
         throw new ApiError(400, "Invalid or missing channel ID")
     }

     const subscribersCount = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)     //Match by channel ID
        }},
        {
            $lookup: { // i am in subscription model looking into the user model
                from: "users",
                localField: "subscriber",
                foreignField: "_id", // for the _id field
                as: "subscriberDetails", //
            }
        },
        {
            $unwind: "$subscriberDetails" // flattens the array of  userSubscription , merges it and make one object
        },{
            $group: {
                _id: "$subscriberDetails._id",
                username: {$first: "$subscriberDetails.username"},
                avatar: {$first: "$subscriberDetails.avatar"},
                totalSubscriptions: {$sum: 1},
                subscribedAt: {$first: "$createdAt"}
            }
        },
        {
            $project: {
                _id: 0, // mongodb also adds the _id in the stage field of aggregate
                subscriberId: "$_id" ,
                username: 1,
                avatar: 1,
                totalSubscriptions: 1,
                subscribedAt: 1
            }
        }
     ])

     if (!subscribersCount.length) {
        throw new ApiError(404, "No subscribers found for this channel")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(
            200,
            subscribersCount,
            "Subscriber list fetched successfully"
        )
     )


   } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch subscriber list ");   
   }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const subscriberId = req.user?._id;

        // Validate subscriberId
        if (!subscriberId || !isValidObjectId(subscriberId)) {
            throw new ApiError(400, "Invalid or missing subscriber ID");
        }

        // Aggregate pipeline
        const getChannelList = await Subscription.aggregate([
            // Match subscriptions of the given subscriber
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(subscriberId),
                },
            },
            // Join with the "users" collection to fetch channel details
            {
                $lookup: {
                    from: "users", // The users collection
                    localField: "channel", // Channel field in the Subscription model
                    foreignField: "_id", // Match _id in the User model
                    as: "channelDetails",
                },
            },
            // Unwind the channel details array
            {
                $unwind: "$channelDetails",
            },
            // Group by channelId and calculate the total subscriptions
            {
                $group: {
                    _id: "$channelDetails._id", // Group by channel ID
                    username: { $first: "$channelDetails.username" }, // Take the username
                    avatar: { $first: "$channelDetails.avatar" }, // Take the avatar
                    totalSubscribers: { $sum: 1 }, // Count the number of subscribers for each channel
                },
            },
            // Project the desired output fields
            {
                $project: {
                    _id: 0, // Exclude MongoDB _id field
                    channelId: "$_id", // Rename the group _id to channelId
                    username: 1,
                    avatar: 1,
                    totalSubscribers: 1, // Include the count of total subscriptions
                },
            },
        ]);

        if (!getChannelList.length) {
            throw new ApiError(404, "No subscribed channels found for this user");
        }

        // Return the response
        return res.status(200).json(
            new ApiResponse(200, getChannelList, "Subscribed channels fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to fetch subscribed channels.");
    }
});



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}