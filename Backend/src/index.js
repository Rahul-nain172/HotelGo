import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser"
import "dotenv/config";
import userRoutes from './routes/users.js';
import authRoute from './routes/auth.js';
import HotelRoute from './routes/hotels.js';
import bookingRoute from './routes/booking.js';
import paymentRoute from './routes/paymentGateway.js'
import { connect } from './dbConfig.js';
import {v2} from 'cloudinary'
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: '*',
    credentials: true 
};
app.use(cors(corsOptions));


app.use("/api/users",userRoutes);
app.use("/api/auth",authRoute);
app.use("/api/hotel",HotelRoute);
app.use('/api/payment',paymentRoute);
app.use('/api/booking',bookingRoute);
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
// });
app.listen(3000,()=>{
    connect();
    console.log('app is running at 3000');
});
