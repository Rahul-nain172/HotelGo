import mongoose  from "mongoose";
const bookingSchema=mongoose.Schema({
    orderId:{
        required:true,
        type:String,
        unique:true,
    },
    userId:{
        required:true,
        type:String,
    },
    checkIn:{
        required:true,
        type:Date
    },
    checkOut:{
        required:true,
        type:Date
    },
    hotelName:{
        required:true,
        type:String,
    }
});

const Booking =mongoose.model('Booking',bookingSchema);
export default Booking;