import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define User Document Interface
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    comparePassword(password: string): Promise<boolean>;
}

// Define User Schema
const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
});

// Hash Password Before Saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Add comparePassword Method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// Create User Model
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
