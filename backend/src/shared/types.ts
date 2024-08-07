import { Document } from 'mongoose';

export interface UserType {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
export interface HotelType extends Document {
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  _id: string;
}
