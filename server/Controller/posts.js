import User from "../Models/userSchema.js";
import Post from "../Models/post.js"
import fs from "fs"
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


/* CREATE */
export const CreatePost = async(req,resp) =>{
    try {
        const { userId } = req.params;
        const {description } = req.fields;
        const { photo } = req.files;

        const user = await User.findById(userId);

        /************ SAVING IMAGE IN FIREBASE AND GETTING URL OF IT  *******************/
        if(photo){
          const dateTime = giveCurrentDateTime();
          const storageRef = ref(storage, `Posts/${"photo" + "       " + dateTime}`);
          
          // Create file metadata including the content type
          const metadata = {
              contentType: req.files.mimetype,
          };

          const photoPath = fs.readFileSync(photo.path);
          photoPath.contentType = Buffer;
  
          // Upload the file in the bucket storage
          const snapshot = await uploadBytesResumable(storageRef, photoPath, metadata);
          var photoUrl = await getDownloadURL(snapshot.ref);

        }

        const {profilePic} = user;
        console.log(profilePic);
        const name = user.username;

        const newPost = new Post({
                userId,
                username:name,
                description,
                userPhoto:profilePic,
                photo:photoUrl,
                likes:{},
                comments:[]

            })
            const postReady = await newPost.save();
            /* SAVING THE POST IN USER PROFILE*/
            user.posts.push(postReady);
            const newUser = await user.save();

            /* GETTING ALL POSTS IN DB */
            const post = await Post.find({})
            resp.status(201).send({success:true, message:"Post Success",post, newUser })
    } catch (error) {
        console.log("Error in getFeedPosts");
        resp.status(500).send({message:error.message})
    }
} 

/* READ ALL POSTS */
export const getFeedPosts = async(req,resp) =>{
    try {
        const post = await Post.find({})
        resp.status(200).send({success:true,post})
    } catch (error) {
        console.log("Error in getFeedPosts");
        resp.status(404).send({message:error.message})  
    }
}
/*GETT ALL POSTS */
export const gettingAllPosts = async(req,resp)=>{
  try {
    const posts = await Post.find({});
    resp.status(201).send({success:true,posts})
  } catch (error) {
    console.log("error in gettingAllPosts",error);
    resp.status(404).send({success:false,error:error.message})
  }
}

/* READ ALL POSTS BY AN USER*/
export const getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params;
      const post = await Post.find({ userId });
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  /* UPDATE LIKES ON POST */
export const likePost = async (req, res) => {
    try {
      // id of post
      const { id } = req.params;
      //userId who likes the post
      const {userId} = req.fields;
      const post = await Post.findById(id);
      const isLiked = post.likes.get(userId);
  
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
  
      res.status(200).json({success:true,updatedPost});
    } catch (err) {
      console.log("Error in like");
      res.status(404).json({ success:false, message: err.message });
    }
  };

  // UPDATE COMMENTS ON POST
  export const commentPost = async(req,resp) =>{
    try {
      const {id,userId} = req.params;
      const {comment} = req.fields;

      //find the post
      const post = await Post.findById(id);
      post.comments.unshift({userId,comment});
      const user = await Post.findByIdAndUpdate(id,{comments:post.comments},{new:true})
  
      resp.status(200).send({
        success:true,
        message:"Comment Posted",
        user,
        comments:post.comments
      })
    } catch (error) { 
      console.log("Error in comment",error);
      resp.send(404).send({success:false,message:"something went wrong"})
   }
  }

  export const allLikesAndComments = async(req,resp) =>{
    try {
      const {likes,comments} = await Post.findById(req.params.id)
      resp.status(201).send({success:true,likes,comments})
    } catch (error) {
      console.log("Error in allLikesAndComments",error.message);
      resp.status(404).send({message:error.message})
    }
  }

  export const getCommentProfile = async(req,resp) =>{
    try {
      const {username , profilePic} = await User.findById(req.params.id)
      resp.status(201).send({success:true,username,profilePic})
      
    } catch (error) {
      console.log("error in getCommentProfile : ",error);
      resp.status(404).send({success:false,error:error.message})
    }
  }

  export const DeletePost = async(req,resp) =>{
    try {
      // console.log("delete post called ",req.params.id);
      const {id,myId} = req.params
      const {userId} = await Post.findById(id);
      const user = await User.findById(myId)

      if(userId===myId){
        const posts = await Post.findByIdAndDelete(id);
        user.posts = user?.posts?.filter((item)=>!(item._id.equals(id)))
        await user.save();
        resp.status(201).send({success:true,posts,message:"Post Deleted "})
      } else {
        resp.status(201).send({success:false,message:"Not Authorized"})
      }
    } catch (error) {
      console.log("Error in delete Controller");
      resp.status(404).send({status:false,message:"Something went wrong"})
    }
  }

  export const letSavePosts = async(req,resp) =>{
    try {
      const {myId , postId} = req.params;
      const post = await Post.findById(postId);
      const user = await User.findById(myId);

      /* CHECK IF POST IS ALREADY SAVED DO IT UNSAVED */
      let present = false;
      user?.savedPosts?.map((item)=>{
        if(item._id.equals(post._id) ){
          present = true
        }
      })
      if(present){
        user.savedPosts  = user?.savedPosts?.filter((item)=>!(item._id.equals(post._id)))
        await user.save();
        resp.status(201).send({success:true,posts:user.savedPosts,message:"Post Removed"});
      } else {
        user.savedPosts.push(post);
        await user.save();
        resp.status(201).send({success:true,posts:user.savedPosts,message:"Post Saved"});
      }

    } catch (error) {
      console.log("Error in letSavePosts Controller",error);
      resp.status(401).send({status:false,message:"Something went wrong"})
    }
  }

  export const getSavePosts = async(req,resp) =>{
    try {
      const {savedPosts} = await User.findById(req.params.id);
      resp.status(201).send({success:true,savedPosts})
      
    } catch (error) {
      console.log("Error in getSavePosts Controller");
      resp.status(401).send({status:false,message:"Something went wrong"})
    }
  }