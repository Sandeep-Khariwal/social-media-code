import express from "express";
import { getUser , getUserFriends , addRemoveFriends, searchFriend, getSuggested, getMyProfile } from "../Controller/users.js";
import {verifyToken} from "../middleware/auth.js"

const router = express.Router()

// READ FETCHING PROFILE BY USING ID
router.route("/userprofile/:id/:myId").get(getUser);
router.route("/myprofile/:id").get(getMyProfile);

// FETCHING MY FRIENDSLIST
router.route("/friends/:id/:myId").get(getUserFriends);

// UPDATE - ADDING AND REMOVING FRIEND
router.route("/follow/:myId/:friendId").post(addRemoveFriends)

// FETCHING SUGGESTED CANDIDATES
router.route("/suggestions/:id").get(getSuggested)

// SEARCHING FRIEND BY KEYWORD/USERNAME
router.route("/search/:id/:keyword").get(searchFriend)

export default router