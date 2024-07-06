import express from 'express';
import multer from 'multer';
import { v2 } from 'cloudinary';
import Hotel from '../models/hotels.js';
import { check, validationResult } from "express-validator";
import jwtAuth from '../middlewares/jwt.middleware.js';
import mongoose from 'mongoose';


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,

    }
});
const uploadImagetoCloudinary=async (imageFiles)=>{
    const uploadPromises = imageFiles.map(async (image) => {
        let b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await v2.uploader.upload(dataURI);
        return res.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
router.post("/addHotel", jwtAuth, [
    check("name", "name is required").isString().notEmpty(),
    check("city", "city is required").isString().notEmpty(),
    check("country", "country is required").isString().notEmpty(),
    check("description", "description is required").isString().notEmpty(),
    check("type", "type is required").isString().notEmpty(),
    check("facilities", "facilities is required").isArray().notEmpty(),
    check("pricePerNight", "pricePerNight is required").isNumeric().notEmpty(),
    check("starsRating", "starsRating is required").isNumeric().notEmpty(),
],
    upload.array('imageFiles', 6), async (req, res) => {
        const errors=validationResult(req.body);
        console.log('req body',req.body);
        if(!errors.isEmpty()){
            return res.status(500).json({error:errors.array()});
        }
        const {isAdmin,userId}=req.user;
        if(isAdmin===false){
            return res.status(401).json({error:'Unauthorized'});
        }
        try {
            const imageFiles = req.files;
            const hotelInfo = req.body;
            hotelInfo.userId=userId;
            //uploading images as url to cloudinary
            console.log('image files are',imageFiles)
            // inserting these urls to my hotelinfo object and adding lastUpdated field also
            hotelInfo.imageUrls = await uploadImagetoCloudinary(imageFiles);
            hotelInfo.lastUpdated = Date.now();

            // creating and saving new hotel to my database
            console.log('adding ',hotelInfo)
            const newHotel = new Hotel(hotelInfo);
            const savedHotel = await newHotel.save();
            return res.status(201).json({ message: "Hotel created successfully", user: savedHotel });
        }
        catch (error) {
            console.log('error in creating hotel', error);
            res.status(500).json({ error: 'error in creating hotel' });
        }
});

router.get('/getHotels',jwtAuth,async (req,res)=>{
    try{
        const hotels=await Hotel.find({userId:req.user.userId});
        res.status(201).json(hotels);
    }
    catch(error){
        res.status(501).json({error:"error in fetching hotels"});
    }
});

router.get('/getHotel/:id',jwtAuth,async(req,res)=>{
    try{
        const hotelId=req.params.id.toString();
        console.log()
        const hotel=await Hotel.findOne({_id:hotelId,userId:req.user.userId})
        if(hotel){
            res.status(201).json(hotel);
        }
        else{
            res.status(501).json({error:'hotel not Found'});
        }
    }
    catch(error){
        console.log(error);
        res.status(501).json({error:"error in fetching this hotel"});
    }
})
//update
router.post('/updateHotel/:id',jwtAuth,[
    check("name", "name is required").isString().notEmpty(),
    check("city", "city is required").isString().notEmpty(),
    check("country", "country is required").isString().notEmpty(),
    check("description", "description is required").isString().notEmpty(),
    check("type", "type is required").isString().notEmpty(),
    check("facilities", "facilities is required").isArray().notEmpty(),
    check("pricePerNight", "pricePerNight is required").isNumeric().notEmpty(),
    check("starsRating", "starsRating is required").isNumeric().notEmpty(),
    check("imageFiles","imageFiles are required").notEmpty()],
    upload.array('imageFiles', 6)
    ,async(req,res)=>{
        const errors=validationResult(req.body);
        if(!errors.isEmpty()){
            return res.status(500).json({error:errors.array()});
        }
        const {isAdmin,userId}=req.user;
        if(isAdmin===false){
            return res.status(401).json({error:'Unauthorized'});
        }
        try{
            const hotelId=req.params.id.toString();
            const imageFiles=req.files;

            const newImageUrls=await uploadImagetoCloudinary(imageFiles);
            const updatedHotel=req.body;
            updatedHotel.lastUpdated=new Date();

            const hotel=await Hotel.findOneAndUpdate({
                _id:hotelId,
                userId:userId
            },
            updatedHotel,{new:true});

            if(!hotel){
                return res.status(404).json({error:'Hotel Not Found'});
            }
            if(newImageUrls&&newImageUrls.length){
                hotel.imageUrls=[...newImageUrls,...(updatedHotel.imageUrls||[])]
            }
            const savedHotel=await hotel.save();
            return res.status(200).json({message:'Successfully updated hotel',savedHotel});

        }
        catch(error){
            res.status(501).json({error:"error in updating this hotel"});
        }
})
router.get('/search',async(req,res)=>{
    try{
        const query=makeQuery(req.query);
        let pageSize=5;
        const pageNumber=parseInt(req.query.page?req.query.page.toString():"1");
        const skippedPages=(pageNumber-1)*pageSize;

        let sortOption={};
        if(req.query.sortOption==='starsRatingAsc')
        sortOption={starsRating:1};
        else if(req.query.sortOption==='starsRatingDesc')
        sortOption={starsRating:-1};
        else if(req.query.sortOption==='pricePerNightAsc')
        sortOption={pricePerNight:1};
        else if(req.query.sortOption==='pricePerNightDesc')
        sortOption={pricePerNight:-1};
        
        
        const hotels=await Hotel.find(query).skip(skippedPages).limit(pageSize).sort(sortOption);
        const total=await Hotel.countDocuments(query);
        const response={
            hotels:hotels,
            pagination:{
                total:total,
                pages:Math.ceil(total/pageNumber),
                page:pageNumber
            }
        }
        res.status(200).json(response);
    }
    catch(error){
        console.log('error in fetching hotel: ',error);
        return res.status(501).json({error:'error in fetching hotel'});
    }
})

router.get('/search/:id',async(req,res)=>{
    try{
        const hotelId=req.params.id.toString();
        console.log('req aayi',hotelId);
        const hotel=await Hotel.findOne({
            _id:hotelId,
        })
        if(!hotel){
            console.log('not found');
            return res.status(404).json({error:"hotel not found"});
        }
        return res.status(200).json(hotel);
    }
    catch(error){
        return res.status(501).json({error:'error in getting this specific hotel'});
    }
})

router.post('/deleteHotel',jwtAuth,async(req,res)=>{
    try {
        const userId=req.user.userId;
        const hotelId=req.body.hotelId;
        const hotel = await Hotel.findOne({ _id: hotelId, userId: userId });
        if (!hotel) {
            return res.status(404).json({ error: "Hotel not found or you do not have permission to delete this hotel." });
        }
        await Hotel.deleteOne({_id:hotelId,userId:userId});
        return res.status(200).json({ message: "Hotel deleted successfully." });
        
        
    } catch (error) {
        console.log(error);
        return res.status(501).json({error:'error in deleting this specific hotel'});
    }
});

const makeQuery=(queryParams)=>{
    let resQuery={};
    if(queryParams.destination){
        resQuery.$or=[
            {
                city:new RegExp(queryParams.destination,"i")
            },
            {
                country:new RegExp(queryParams.destination,"i")
            }
        ]
    }
    if(queryParams.childCount){
        resQuery.childCount={
            $gte:parseInt(queryParams.childCount),
        };
    }
    if(queryParams.adultCount){
        resQuery.adultCount={
            $gte:parseInt(queryParams.adultCount),
        };
    }
    if(queryParams.facilities){
        resQuery.facilities={
            $all:Array.isArray(queryParams.facilities)?queryParams.facilities:[queryParams.facilities],
        };
    }
    if(queryParams.types){
        resQuery.type={
            $in:Array.isArray(queryParams.types)?queryParams.types:[queryParams.types],
        }
    }
    if(queryParams.stars){
        const starsRating=Array.isArray(queryParams.stars)?
        queryParams.stars.map((star)=>parseInt(star)):parseInt(queryParams.stars);
        resQuery.starsRating={$in:starsRating}
    }
    if(queryParams.minPrice&&queryParams.maxPrice){
        resQuery.pricePerNight={
            $gte:parseInt(queryParams.minPrice).toString(),
            $lte:parseInt(queryParams.maxPrice).toString(),
        };
    }
    return resQuery;
}

export default router;