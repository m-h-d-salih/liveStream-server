import { Request, Response } from "express";
import { User } from "../model/userSchema";
import jwt from 'jsonwebtoken';
import AppError from "../middlewares/AppError";

  export const loginUser=async (req:Request, res:Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials' ,400);
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  }