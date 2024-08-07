import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the UserType with the fields you need
export type UserType = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

// Interface for the user document, extending UserType and Document
interface UserDocument extends UserType, Document {
    isModified: (path: string) => boolean; // Add isModified method
    comparePassword(candidatePassword: string): Promise<boolean>; // Add comparePassword method
}

// Define the user schema
const userSchema = new Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

// Pre-save middleware to hash the password if it's modified
userSchema.pre<UserDocument>('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password);
};

// Create the user model
const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
