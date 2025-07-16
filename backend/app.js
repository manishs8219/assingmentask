import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';

import connectDB from './connectDB.js';

import categoryRouter from './routes/category.js';

import expenseRouter from './routes/expense.js';

import statisRouter from './routes/statis.js';

import usersRouter from './routes/users.js';

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketIO(httpServer, {
    cors: {
        origin: '*'
    }
});

// Expose io for usage in controllers if needed
app.set('io', io);

// Middleware
app.use(cors());
connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

app.use('/category', categoryRouter);

app.use('/expense', expenseRouter);

app.use('/statis', statisRouter);


app.use('/users', usersRouter);

// 404 handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});

export default app;
