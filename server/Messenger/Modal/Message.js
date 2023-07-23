import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    conversationId:{
        type:String
    },
    sender:{
        type:String
    },
    text:{
        type:String
    }

},{timestamps:true})

const Messages = mongoose.model("message",messageSchema);
export default Messages