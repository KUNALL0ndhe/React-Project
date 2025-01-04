import { Router } from 'express';
import { 
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from '../controllers/comments.controller.js';
import verifyjwtToken from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyjwtToken); // To apply verification to all the comment routes

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router