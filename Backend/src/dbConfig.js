import mongoose from "mongoose";

export const connect=async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        const connection =mongoose.connection;
        connection.on('connected',()=>{
            console.log("connect ho gaya mongo db! ");
        })
        connection.on('error',(err)=>{
            console.log("connection hone ke baad ab koi dikkat aa rhi ",err);
            process.exit();
        })
    }
    catch(error){
        console.log("Something Went Wrong in connecting to DB");
        console.log(error);
    }
} 