import mongoose, { Schema, Document, Model } from "mongoose";

// ---------------- Message Interface + Schema ----------------
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

// ---------------- User Interface + Schema ----------------
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: mongoose.Types.DocumentArray<Message>; // ✅ fix here
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: { type: String, required: true },
  verifyCode: { type: String, required: true },
  verifyCodeExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [MessageSchema],
});

// ---------------- Models ----------------
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
