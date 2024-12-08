import { Router } from "express";

import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from '../controllers/tweet.controller.js';
import { verifyjwtToken } from '../middlewares/auth.middleware.js'

const tweetRouter = Router();
tweetRouter.use(verifyjwtToken); // Applied JWT verification to all the Routes in the file

tweetRouter.route("/").post(createTweet);
tweetRouter.route("/user/:userId").get(getUserTweets);
tweetRouter.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
