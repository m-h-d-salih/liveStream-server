import { Request,Response } from "express";
import { User } from "../model/userSchema";
import AppError from "../middlewares/AppError";
import jwt from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import { io } from "../server";

const rooms: Record<string, string[]> = {};

export const registration=async (req:Request, res:Response) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) 
      throw new  AppError(`admin alserdy exist`,400)
  
    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    res.json({ message: 'Admin created successfully' });
  };

  export const loginAdmin=async (req:Request, res:Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.status(200).json({ success:true,token, user: { id: user._id, name: user.name, role: user.role } });
  }

  export const createUser=async (req:Request, res:Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) throw new AppError( 'User already exists', 400);
  
    const user = new User({ name, email, password });
    await user.save();
    res.status(200).json({success:true, message: 'User created successfully' });
  }
  export const getAllUsers=async (req:Request, res:Response) =>{
    const users=await User.find();
    if(!users)
      throw new AppError(`no users found`);
    res.status(200).json({success:true,message:`users get successfully`,data:users})
  }

  export const createRoom=async (req:Request, res:Response) =>{
    const roomId = uuidV4();
    rooms[roomId] = [];
    io.emit('room-created', { roomId });
    console.log(`Room created: ${roomId}`);
    res.status(201).json({ message: 'Room created successfully', roomId });
  }