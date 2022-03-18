import express from 'express';
import { getUserInfo } from './users.controller.js';

const router = express.Router();

router.route('/')
    .get(getUserInfo)


export default router;