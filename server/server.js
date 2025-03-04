require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001', // הקליינט רץ על 3001
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/user', require('./api/User/UserRouter'));
const flightRouter = require('./api/flights/flightRouter');
app.use('/api/flights', flightRouter);
app.use('/api/markers', require('./api/icons/markerRouter'));

const PORT = 5050;

mongoose.connect("mongodb+srv://david:david123456@cluster0.rawvp.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});
//