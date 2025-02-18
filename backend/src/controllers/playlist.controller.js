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
    // TODO: remove video from playlist
    try {
        const {playlistId, videoId} = req.params;

        if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid or missing playlist ID")
         }
    
        if (!videoId || !mongoose.isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid or missing video ID")
        }

        const removedVideo = await Playlist.findOneAndUpdate(
            {_id: playlistId},
            { $pull: { videos: videoId } }, //we use this to pull out from the video array this videoId
            {new: true } // To get the updated document
        );

        if (!removedVideo || removedVideo.videos.length === 0) {
            throw new ApiError(404, "Playlist not found or video not in the playlist");
        }
        
        if (!removedVideo.videos.includes(videoId)) {
            return res
            .status(200)
            .json(
            new ApiResponse(
                200,
                null,
                "Video deleted from playlist"
            )
        )
        }
        
    } catch (error) {
        console.error("Error in removing video from playlist", error);
        throw new ApiError(500, error.message || "Failed to remove video from playlist");
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    try {
        const {playlistId} = req.params

        if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid or missing playlist ID")
         }

        const myDeletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

        if (!myDeletedPlaylist) {
            throw new ApiError(404, "Playlist not found")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Playlist deleted Successfully."
            )
        );

    } catch (error) {
        console.error("Error in removing video from playlist", error);
        throw new ApiError(500, error.message || "Failed to remove video from playlist");
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    
    try {
        const {playlistId} = req.params
        const {name, description} = req.body

        if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid or missing playlist ID")
         }
        
        if (!name || !description) {
            throw new ApiError(400, "Name or Description is Invalid")
        }

        const myUpdatePlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set : {
                    name,
                    description,
                }
            },
            {
                new: true
            }
        );

        if (!myUpdatePlaylist) {
            throw new ApiError(404, "Playlist cannot be update")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                myUpdatePlaylist,
                "Playlist updated successfully"
            )
        );

        
    } catch (error) {
        console.error("Error in updating the playlist", error);
        throw new ApiError(500, error.message || "Failed to update the playlist");
    }
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