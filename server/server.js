require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/config');

// Import routes
const userRouter = require('./api/User/UserRouter');
const flightRouter = require('./api/flights/flightRouter');
const markerRouter = require('./api/icons/markerRouter');
const passengerRouter = require('./api/passengers/passengerRouter');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

// Routes
app.use('/api/user', userRouter);
app.use('/api/flights', flightRouter);
app.use('/api/markers', markerRouter);
app.use('/api/passengers', passengerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5002;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();