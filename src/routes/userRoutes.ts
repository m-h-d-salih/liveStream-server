import express from 'express';
import { trycatch } from '../middlewares/tryCatch';
import { createUser, getAllUsers, loginAdmin, registration } from '../controller/adminController';
import checkAuth from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';
import { loginUser } from '../controller/userController';

const router=express.Router();


router.post(`/login`,trycatch(loginUser))
router.post(`/create-user`,checkAuth,checkAdmin,trycatch(createUser))
router.get(`/users`,checkAuth,checkAdmin,trycatch(getAllUsers))
export default router;