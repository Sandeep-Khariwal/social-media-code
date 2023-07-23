import mongoose from "mongoose";

const ConverSchema = new mongoose.Schema({

    members:{
        type:Array
    }

},{timestamps:true})

const Conversation = mongoose.model("conversation",ConverSchema)
export default Conversation