// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;        // add this line
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}


const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
  },
  { timestamps: true }
);

// Prevent recompilation during hot reloads in dev
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
