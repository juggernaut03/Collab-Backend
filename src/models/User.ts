import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        avatarUrl: { type: String },
    },
    { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
