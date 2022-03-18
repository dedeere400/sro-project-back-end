import express from 'express';
import { registerCtrl, validateEmailCtrl, loginCtrl } from './auth.controller.js';
import { validateUser } from './auth.middleware.js';

const router = express.Router();

// enpoint par el registro del usuario
router.post('/register', validateUser, registerCtrl);

// enpoint par la validación del email del usuario
router.get('/validate', validateEmailCtrl);

// enpoint par el login del usuario
router.post('/login', loginCtrl);

export default router;