import mongoose, { Schema } from "mongoose";

const tweetSchema = new mongoose.Schema( {
    content: {
        type: String,
        required: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true});

const tweet = mongoose.model("tweet", tweetSchema);

export default tweet;