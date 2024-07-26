import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

// Interface for the user document
interface UserDocument extends UserType, Document {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const userSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    const user = this as UserDocument;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
