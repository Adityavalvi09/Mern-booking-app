import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/users'; // Make sure this path is correct
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import myHotelRoutes from './routes/my-hotels';
import bookingRoutes from "./routes/my-bookings";

import hotelRoutes from "./routes/hotels";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Ensure this matches your imported userRoutes
app.use('/api/my-hotels', myHotelRoutes);
app.use('/api/hotels', hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);



app.use('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(7000, () => {
    console.log('Server Running On LocalHost:7000');
});
