import express from 'express';
import { getUserInfo, updateUserInfo, deleteUserInfo } from './users.controller.js';

const router = express.Router();

router.route('/')
    .get(getUserInfo)

router.route("/")
    .patch(updateUserInfo);

router.route("/")
    .delete(deleteUserInfo);


export default router;