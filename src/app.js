import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.router.js';
import usersRouter from './users/users.router.js';
import { validateAuth } from './auth/auth.middleware.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 4000;
console.log(process.env)
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => res.send('Pong'));
app.use('/auth', authRouter); // declaramos el router de autenticación
app.use('/users', validateAuth, usersRouter);
app.use('/authenticated', validateAuth);

app.listen(port, () => console.log(`Servidor levantado en el puerto ${port}`));