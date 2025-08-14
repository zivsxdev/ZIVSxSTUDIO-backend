import express from "express";
import { auth } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
import { generateArticle,generateBlogTitle, generateImage, removeImageBackground,removeImageObject, resumeReview } from "../controllers/aiController.js";

const aiRouter = express.Router();
aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/remove-image-background', auth, upload.single('image'), removeImageBackground)  
aiRouter.post('/remove-image-object', auth, upload.single('image'), removeImageObject)
aiRouter.post('/resume-review', auth, upload.single('resume'), resumeReview)


export default aiRouter