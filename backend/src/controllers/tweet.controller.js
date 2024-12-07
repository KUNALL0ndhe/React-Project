import mongoose from "mongoose";
import Tweet from "../models/tweet.model";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

   try {
     const {  content, owner } = req.body;
 
     if ( !content ) 
     {
         throw new ApiError(402, "Content is Required")
     };
     
     // Create Tweet for the tweet page

     const tweet = await Tweet.create( { content, owner } )

     //Send the response

     return res
     .status(201)
     .json(
        new ApiResponse(201, tweet, "Tweet is created. ")
     )
   } catch (error) {

    throw new ApiError(400, error.message || "Invalid Request to Create")
   }

    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}