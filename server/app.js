import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { productsRouter } from './router/productsRouter.js';
import { usersRouter } from './router/usersRouter.js';
import { userLoginRouter } from './router/userLoginRouter.js';
import { categoriesRouter } from './router/categoriesRouter.js';
import { statusesRouter } from './router/statusesRouter.js';

const server = express();
server.use('/uploads', express.static('uploads'));

server.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] ,
    credentials: true
}))
server.use(express.json());
server.use(bodyparser.json())
server.use(bodyparser.urlencoded({
    extended: true
}))
server.use(cookieParser());

server.post('/logout', (req, res) => {
    res.clearCookie('x-access-token', { httpOnly: true, secure: true });
    res.clearCookie('refresh-token', { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logout successful' });
});


server.use('/userLogin',userLoginRouter)

server.use('/products',productsRouter);
server.use('/users',usersRouter);

server.use('/categories',categoriesRouter);
server.use('/statuses',statusesRouter);

// Serve static files from the frontend build folder
server.use(express.static(join(__dirname, '../client/build')));

// Handle unmatched routes (send React's index.html)
server.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build', 'index.html'));
});

server.listen(8080, (err) => {
    if (err) console.error(err);
    console.log("Server listening on PORT", 8080);
});