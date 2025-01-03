import mongoose from 'mongoose';
import ApiError from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Playlist} from "../models/playlist.model.js";


const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;
        const owner = req.user?._id;

        if (!name || !description) {
            throw new ApiError(400, "Name and description are required");
        }

        if (!owner || !mongoose.isValidObjectId(owner)) {
            throw new ApiError(400, "Invalid or missing owner ID");
        }

        const playlist = await Playlist.create({
            name,
            description,
            owner,
        });

        res.status(201).json(
            new ApiResponse(201, playlist, "Playlist created successfully")
        );
    } catch (error) {
        console.error("Error creating playlist:", error);
        throw new ApiError(500, error.message || "Failed to create playlist");
    }
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params
        //TODO: get user playlists
        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid or missing user ID")
        }

        const userPlaylists = await Playlist.find({
            owner: userId,
        });

        if (!userPlaylists.length) {
            throw new ApiError(404, "No Playlist found for this user")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlaylists,
                "User Playlist fetched Successfully."
            )
        );
        
    } catch (error) {
        console.error("Error getting user playlists:", error);
        throw new ApiError(500, error.message || "Failed to get user playlists");
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    try {
        const {playlistId} = req.params;

        if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid or missing playlist ID")            
        }
        
        const myPlaylist = await Playlist.findById(playlistId);

        if (!myPlaylist) {
            throw new ApiError(404, "No playlist found with the provided ID");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                myPlaylist,
                "Playlist fetched successfully by ID."
            )
        )
        

    } catch (error) {
        console.error("Error fetching playlist by ID:", error);
        throw new ApiError(500, error.message || "Failed to fetch playlist");
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   try {
     const {playlistId, videoId} = req.params;

     if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid or missing playlist ID")
     }

     if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid or missing video ID")
     }

     const newlyAdded = await Playlist.findByIdAndUpdate(
        playlistId, // to check the playlist id
        {$push : { videos: videoId }}, // find the video field in schema and update it and push into db via mongoose
       { new: true} // returns new array
    );

    if (!newlyAdded) {
        throw new ApiError(404, "No playlist found with the provided ID");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            newlyAdded,
            "Video added to Playlist successfully"
        )
    )

   } catch (error) {
    console.error("Error in adding video to playlist");
        throw new ApiError(500, error.message || "Failed to add video to playlist");
   }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}