import express from "express";
import { check, validationResult } from "express-validator";
import User from "../models/users.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { sendEmail } from "../helpers/nodeMailer.js";
const router = express.Router();


router.post('/signIn',
    [check("email", "Enter first name").isEmail(),
    check("Password", "Password length should be atleast 6 digits").isLength({ }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({error: errors.array()});
        }

        try {
            const { email, password } = req.body;
            console.log(req.body);
            const user=await User.findOne({email});
            if(!user){
                return res.status(500).json({error:"Invalid Credentials"});
            }
            const cmp=await bcryptjs.compare(password,user.password);
            if(!cmp){
                return res.status(500).json({error:"Invalid Credentials"});
            }
            const tokenData={
                userId:user._id,
                name:user.firstName +' '+user.lastName,
                email:user.email,
                isAdmin:user.isAdmin,
            }
            const token=await jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:process.env.TOKEN_EXPIRY});
            res.cookie('token',token,{
                httpOnly:true,
                secure:process.env.ENVIRONMENT==='production',
            });
            res.status(200).json({message:"signed in successfully",token:token});
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
});

router.get('/signOut', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Signed out successfully' });
});
router.post('/forgotPassword',async(req,res)=>{
    try{

        const {email}=req.body;
        console.log(req.body);
        const user=await User.findOne({email:email});
        if(!user){
            console.log("user doesn't exist");
            return res.status(404).json({error:"user doesn't exist"});
        }
        await sendEmail({email:email,emailType:'forgotPassword',userId:user._id});
        res.status(200).json({message:'reset password mail sent'});

    }
    catch(error){
        console.log(error);
        res.status(500).json({error:error});
    }
})
router.post('/resetPassword',async(req,res)=>{
    try {
        const {token,password,confirmPassword}=req.body;
        const user=await User.findOne({forgotPasswordToken:token,forgotPasswordTokenExpiry:{
            $gt:Date.now()
        }});
        if(!user){
            console.log("user doesn't exist");
            return res.status(404).json({error:"user doesn't exist"})
        }
        console.log(user);
        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password, salt);
        user.password=hashedPass;
        await user.save();
        res.status(200).json({message:'successfull'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
    }
})


export default router;