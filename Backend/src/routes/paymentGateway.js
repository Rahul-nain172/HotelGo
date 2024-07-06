import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import jwtAuth from '../middlewares/jwt.middleware.js';
const router=express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

router.post('/create',jwtAuth,async(req,res)=>{
    console.log('request for payment');
    const {amount,currency}=req.body;
    try {
        const options = {
          amount: amount * 100,
          currency,
        };
    
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
})

router.post('/validate',async(req,res)=>{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  const sha=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  if(sha.digest('hex')!==razorpay_signature){
    return res.status(501).json({error:'Payment is not authentic'});
  }
  console.log('payment was authentic');
  return res.status(200).json({message:'payment is authentic',orderId:razorpay_order_id,paymentId:razorpay_payment_id});
});
export default router;