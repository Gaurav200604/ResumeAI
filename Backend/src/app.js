const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
const cors = require('cors');


app.use(cookieParser());

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

/* require all the routes here */
const authRouter = require('./routes/auth.routes');

/* using all the routes here */ 
app.use('/api/auth', authRouter);

module.exports = app;
