import express from "express";
import { Login, Register, editProfile, getProfilePic } from "../Controller/auth.js";
import formidable from "express-formidable"

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

router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/editprofile/:id").put(formidable(), upload.single("filename"),editProfile)
// router.route("/:uid").get(getProfilePic)

export default router