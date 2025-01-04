import { Router } from "express";

import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from '../controllers/tweet.controller.js';
import { verifyjwtToken } from '../middlewares/auth.middleware.js'

const router = Router();
router.use(verifyjwtToken); // Applied JWT verification to all the Routes in the file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;