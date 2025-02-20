require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserRouter = require('./api/User/UserRouter');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', UserRouter);


app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 3000;
mongoose.connect("mongodb+srv://david:david123456@cluster0.rawvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
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
