import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"Please Provide a First Name"],
        unique:false
    },
    lastName:{
        type:String,
        required:[true,"Please Provide a Last Name"],
        unique:false 
    },
    email:{
        type:String,
        required:[true,"Please Provide an Email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please Provide a Password"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
});

const User=mongoose.model("User",userSchema);

export default User;