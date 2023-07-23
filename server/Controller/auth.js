import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../Models/userSchema.js"
import Posts from "../Models/post.js"
import fs from "fs"
import path from "path"
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app"
import multer from "multer";
import config from "../config/firebase.config.js"
//Initialize a firebase application
initializeApp(config.firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

/* REGISTER USER */

export const Register = async(req,resp) =>{
    try {
        const {
        username,
        email,
        password,
        collegename,
        coursename,
        stream,
        address

    } = req.body

        const existUser = await User.findOne({email:email})
        if(existUser){
            resp.status(401).json({success:false,message:"User already exist"})
        } else {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password,salt)
            const user = await new User({
                username,
                email,
                password:passwordHash,
                collegename,
                coursename,
                stream,
                address
            }).save();
            var token = await jwt.sign({_id:User._id},process.env.SECRET_KEY,{expiresIn:"7d"})
            delete user.password;
            resp.status(201).json({success:true,message:"Registration Success",user,token})
        }

    } catch (error) {
        resp.status(500).send({success:false,message:"Error while Registering",error})
    }
}

export const Login = async(req,resp) =>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        const allUser = await User.find({});

        if(!user){
            resp.status(400).send({success:false,message:"User Not Registered"})
        }
        else{
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){ 
            resp.status(400).send({success:false,message:"Enter valid Details"})
        } else {
        var token = await jwt.sign({_id:User._id},process.env.SECRET_KEY,{expiresIn:"7d"})
        delete user.password;
        }
    }

    const suggested = [];
    allUser.map((suggest)=>{
            if( suggest.coursename.toUpperCase() === user.coursename.toUpperCase() || suggest.stream.toUpperCase() === user.stream.toUpperCase()  || suggest.collegename.toUpperCase() === user.collegename.toUpperCase()){
                if(user._id !== suggest._id){
                    suggested.push(suggest)
                }
            }
        });

        const formatteSuggested = suggested.map(
            ({_id, username, coursename, stream, profilePic} )=>{
             return {_id, username, coursename, stream, profilePic};
            }
        );
    
    resp.status(201).send({success:true,token , user,suggestions:formatteSuggested,message:"Login Successfuly"})

    } catch (error) {
        console.log("Error While LoginController",error);
        resp.status(500).send({
            success:false,
            error
        })
    }
}

export const editProfile = async(req,resp) =>{
    try {
        const {profilePic , BgPic }= req.files
        const { username , bio , look , collegename , coursename , stream  , batch , address , skills} = req.fields;
        
      /************ SAVING IMAGE IN FIREBASE AND GETTING URL OF IT  *******************/
   if(profilePic || BgPic){
    const dateTime = giveCurrentDateTime();
    var storageRef1 = ref(storage, `files/${profilePic?.name + "       " + dateTime}`);
    var storageRef2 = ref(storage, `files/${BgPic?.name + "       " + dateTime}`);
    
    // Create file metadata including the content type
    var metadata = {
        contentType: req.files.mimetype,
    };
   }

      if(profilePic){
        var profile = fs.readFileSync(profilePic.path);
        profile.contentType = Buffer;

        // Upload the file in the bucket storage
        const snapshot1 = await uploadBytesResumable(storageRef1, profile, metadata);
        var profileURL = await getDownloadURL(snapshot1.ref);
    }
    if(BgPic){
        var background = fs.readFileSync(BgPic.path);
        background.contentType = BgPic.type;

        // Upload the file in the bucket storage
        const snapshot2 = await uploadBytesResumable(storageRef2, background, metadata);
        var BgPicURL = await getDownloadURL(snapshot2.ref);
    }

    /* converting skills string into an array */
     const mySkills = skills.split(",");

    /*FINDING YEAR */
    if(batch){
    const getYear = batch.split("-");
    const admisionYear = parseInt(getYear[0]);
    const currYear = new Date().getFullYear()
    var year = currYear - admisionYear;
    switch (year) {
        case 1:
            year = year + "st";
            break;
        case 2:
            year = year + "nd";
            break;
        case 3:
            year = year + "rd";
            break;
        case 4:
            year = year + "th";
            break;
        default :
            year = " Passed ";
    }
}
    
      /************ SAVING DATA IN DB  *******************/

        const me = await User.findByIdAndUpdate(req.params.id,{username , bio ,look , collegename ,coursename , stream, batch , year, profilePic:profileURL , BgPic:BgPicURL , skills:mySkills } , {new:true});

    /*SET ALL PROFILE PIC ON POSTS */
    me.posts.map((item)=>{
        item.userPhoto=profileURL;
    })

    const user = await me.save();
    delete user.password;

    /* FILTERING SUGGESTIONS */
    const allUser = await User.find({})
    const suggested = [];
    allUser.map((suggest)=>{
        if( suggest.coursename.toUpperCase() === user.coursename.toUpperCase() || suggest.stream.toUpperCase() === user.stream.toUpperCase()  || suggest.collegename.toUpperCase() === user.collegename.toUpperCase()){
            if(user._id !== suggest._id){
                suggested.push(suggest)
            }
        }
    });

    const formatteSuggested = suggested.map(
        ({_id, username, coursename, stream, profilePic} )=>{
            return {_id, username, coursename, stream, profilePic};
        }
    );

    resp.status(201).send({
      success: true,
      message: "Profile Updated",
      user,
      suggestions:formatteSuggested
    });

    } catch (error) {
    console.log(error);
    resp.status(500).send({
        success: false,
        error:error.message,
        message:"Something went wrong",
    });
    }
}

export const getProfilePic = async (req, res) => {
    try {
      const user = await User.findOne({_id:req.params.uid}).select("profilePic");
      if (user.profilePic.data) {
        res.set("Content-type", user.profile.contentType);
        return res.status(200).send(user.profile.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: error.message,
        error,
      });
    }
  };