import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

const PORT = process.env.PORT;

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes)


app.listen(PORT, () => {
    console.log( 'Run', PORT)
})