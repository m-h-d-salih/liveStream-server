import express from 'express';
import { trycatch } from '../middlewares/tryCatch';
import { createRoom, createUser, getAllUsers, loginAdmin, registration } from '../controller/adminController';
import checkAuth from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';

const router=express.Router();

router.post(`/register-admin`,trycatch(registration))
router.post(`/login`,trycatch(loginAdmin))
router.post(`/create-user`,checkAuth,checkAdmin,trycatch(createUser))
router.get(`/users`,checkAuth,checkAdmin,trycatch(getAllUsers))
router.post(`/room/create`,checkAuth,checkAdmin,trycatch(createRoom))
export default router;