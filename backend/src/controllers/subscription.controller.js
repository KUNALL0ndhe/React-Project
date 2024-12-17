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
    const {channelId} = req.params
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