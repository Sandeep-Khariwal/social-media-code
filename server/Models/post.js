import mongoose from "mongoose";
const ObjectId = mongoose.Schema.type
const postSchema = new mongoose.Schema({
    
    userId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        require:true,
        min:2,
        max:50
    },
    photo: {
       type:String
    },
    description:{
        type:String,
        min:2,
    }, 
    userPhoto: {
        type:String
    },
    picturePath:String,
    location:String,
    
    likes:{type:Map,of:Boolean},
    
    comments:{
        type:Array,
        default:[]
    }
},{timestamps:true});

const User = mongoose.model("post",postSchema)
export default User