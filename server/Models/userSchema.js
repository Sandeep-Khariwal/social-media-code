import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:2,
        max:50
    }, 
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        min:6
    },
    bio:{
        type:String,
        default:""
    },
    look:{
        type:String,
        default:""
    },
    collegename:{
        type:String,
        require:true
    },
    coursename:{
        type:String,
        require:true
    },
    stream:{
        type:String,
        require:true
    },
    batch:{
        type:String,
        default:""
    },
    year:{
        type:String,
        default:""
    },
    address:{
        type:String,
        require:true
    },
    skills:{
        type:Array,
        default:[]
    },
    profilePic: {
        type:String,
        default:""
    },
    BgPic: {
        type:String,
        default:""
    },
    friends:{
        type:Array,
        default:[]
    },
    posts:{
        type:Array,
        default:[]
    },
    savedPosts:{
        type:Array,
        default:[]
    }
},{timestamps:true});

const User = mongoose.model("User",userSchema)
export default User