import mongoose from "mongoose";

export const database = async() =>{
    try {
        await mongoose.connect(process.env.DB_URL,{useUnifiedTopology:true,useNewUrlParser: true})
        .then(()=>{console.log("databse connected successfully");})
    } catch (error) {
        console.log("error while connecting databse",error);
    }
}