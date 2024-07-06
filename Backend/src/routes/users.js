import express from "express";
import User from "../models/users.js";
import bcryptjs from "bcryptjs";
import { check, validationResult } from "express-validator";
import { sendEmail } from "../helpers/nodeMailer.js";
const router = express.Router();

router.post("/signUp",[
        check("firstName","Enter first name").isString().notEmpty(),
        check("lastName","Enter first name").isString().notEmpty(),
        check("email","Enter first name").isEmail().notEmpty(),
        check("password","Password length should be atleast 6 digits").isLength({min:6}).notEmpty(),
    ] ,async (req, res) => {

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log('Received: ', req.body);
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "This Email Id is already used!" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPass
        });
        const savedUser = await newUser.save();
        await sendEmail({email:email,emailType:'verifyEmail',userId:savedUser._id});
        console.log('mail sent');
        console.log("Saved User info: ", savedUser);
        return res.status(201).json({ message: "User created successfully", user: savedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});
router.post('/verifyEmail',async(req,res)=>{
    try {
        console.log('req for verification',req.body);
        const verifyToken=req.body.token;
        const user= await User.findOne({verifyToken:verifyToken,verifyTokenExpiry:{$gt: Date.now()}});
        if(!user){
            console.log("user doesn't exist! ");
            return res.status(404).json({error:"user doesn't exist! "});
            
        }
        user.isVerified=true;
        user.verifyToken=undefined;
        user.verifyTokenExpiry=undefined;
        await user.save();
        console.log('verified');
        res.status(200).json({message:'verified'});
    } catch (error) {
        console.log(error);
    }
})



export default router;
