import mongoose, {isValidObjectId, equals} from "mongoose"
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
                pipeline: [ //nested lookup to join the user to subscription model
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id", // now in the _id
                            foreignField: "subscriber", // match where the user is a subscriber
                            as: "userSubscriptions"
                        }
                    },
                    {   // project the necessary field & include the count
                        $project: { // the projection is applied to the user collection field (subscriberDetails) 
                            //as userSubscriptions does not have the username, avatar
                            username: 1,
                            avatar: 1,
                            totalSubscriptions:{ $size: "$userSubscriptions"} // count the userSubscriptions
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$subscriberDetails" // flattens the array of  userSubscription , merges it and make one object
        },
        {
            $project: {
                _id: 0, // mongodb also adds the _id in the stage field of aggregate
                subscriberId: "$subscriberDetails._id" ,
                username: "$subscriberDetails.username",
                avatar: "$subscriberDetails.avatar",
                totalSubscriptions: "$subscriberDetails.totalSubscriptions",
                subscribedAt: "$createdAt"
                
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
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}