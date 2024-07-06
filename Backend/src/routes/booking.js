import express from 'express';
import jwtAuth from '../middlewares/jwt.middleware.js';
import Booking from '../models/booking.js'
import { sendEmail } from '../helpers/nodeMailer.js';
import User from '../models/users.js';
const router=express.Router();

router.post('/create',jwtAuth,async (req,res)=>{
    try{
        const userId=req.user.userId;
        console.log('le bhai ',req.body);
        const bookingInfo=req.body;
        bookingInfo.userId=userId;
        const newBooking=new Booking(bookingInfo);
        const savedBooking=await newBooking.save();
        const user=await User.findOne({_id:userId});
        await sendEmail({email:user.email,emailType:'bookingSuccess',userId:userId,orderId:req.body.orderId});
        console.log('add kr di and mail sent',savedBooking);
        res.status(200).json({savedBooking});
    }
    catch(error){
        console.log(error);
        res.status(501).json({error:"error in creating Booking"});
    }
})
router.get('/getBookings',jwtAuth,async(req,res)=>{
    try{
        const userId=req.user.userId;
        const bookings =await Booking.find({
            userId:userId
        });
        if(!bookings){
            return res.status(501).json({error:'No booking found'});
        }
        res.status(200).json(bookings);
    }
    catch(error){
        console.log(error);
        res.status(501).json({error:"error in fetching Booking"});
    }
})

export default router