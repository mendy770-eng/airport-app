const express = require('express');
const router = express.Router();
const Marker = require('./MarkerModel');

// נתונים התחלתיים
const initialMarkers = [
    {
        title: "airportInspector",
        position: { lat: 40.642289, lng: -73.781261 },
        type: "control_tower"
    },
    {
        title: "technicion",
        position: { lat: 40.6551680, lng: -73.802397 },
        type: "airport"
    },
    {
        title: "manager",
        position: { lat: 40.648402, lng: -73.799179 },
        type: "airport"
    },
    {
        title: "ground_attendant",
        position: { lat: 40.647680, lng: -73.792892 },
        type: "airport"
    }
];

// אתחול המרקרים אם אין נתונים
const initializeMarkers = async () => {
    try {
        const count = await Marker.countDocuments();
        if (count === 0) {
            await Marker.insertMany(initialMarkers);
            console.log('Initialized markers successfully');
        }
    } catch (error) {
        console.error('Error initializing markers:', error);
    }
};

// קריאה לפונקציית האתחול
initializeMarkers();

router.get('/positions', async (req, res) => {
    try {
        const markers = await Marker.find();
        console.log('Found markers:', markers);
        res.json(markers);
    } catch (error) {
        console.error('Error in /positions route:', error);
        res.status(500).json({ message: 'Failed to fetch marker positions' });
    }
});

router.post('/position', async (req, res) => {
    try {
        const { title, position } = req.body;
        
        const marker = await Marker.findOneAndUpdate(
            { title },
            { position },
            { upsert: true, new: true }
        );
        
        res.json(marker);
    } catch (error) {
        console.error('Error updating marker position:', error);
        res.status(500).json({ message: 'Failed to update marker position' });
    }
});

module.exports = router; 