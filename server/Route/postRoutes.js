import express from "express";
import { CreatePost, DeletePost, allLikesAndComments, commentPost, getCommentProfile, getFeedPosts , getSavePosts, getUserPosts , gettingAllPosts, letSavePosts, likePost } from "../Controller/posts.js";
import {verifyToken} from "../middleware/auth.js"
import formidable from "express-formidable";

import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import multer from "multer";
import config from "../config/firebase.config.js"

//Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();
// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router()

/* CREATING A POST */
router.route("/post/:userId").post(formidable(),upload.single("filename") , CreatePost)

/*GETTING ALL POSTS */
router.route("/allposts").get(gettingAllPosts)
/* GETTING ALL POSTS OF ANY USER */
router.route("/:userId/posts").get(verifyToken , getUserPosts)

/* UPDATE */
router.route("/likes/:id").put(formidable(),likePost)
router.route("/comment/:id/:userId").post(formidable(), commentPost)

router.route("/likesAndComments/:id").get( allLikesAndComments)
router.route("/getCommentProfile/:id").get( getCommentProfile)

/*DELETE THE POST */
router.route("/deletepost/:id/:myId").delete(DeletePost);

/* LET SAVE THE POST */
router.route("/letSavePosts/:myId/:postId").post(letSavePosts)

/* GET SAVED POSTS */
router.route("/getSavePosts/:id").get(getSavePosts)
export default router