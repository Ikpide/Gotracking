const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample data
let trackingNumbers = {};
let statusList = [
    'picked up',
    'in transit',
    'out for delivery',
    'delivered'
];

// Function to generate fake tracking number
const generateTrackingNumber = () => {
    return 'TRACK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Route to create a package
app.post('/create-package', (req, res) => {
    const trackingNumber = generateTrackingNumber();
    trackingNumbers[trackingNumber] = {
        status: 'picked up',
        createdAt: new Date().toISOString()
    };
    res.status(201).json({ trackingNumber });
});

// Route to update package status
app.patch('/update-status/:trackingNumber', (req, res) => {
    const { trackingNumber } = req.params;
    const { status } = req.body;

    if (!trackingNumbers[trackingNumber]) {
        return res.status(404).json({ error: 'Tracking number not found' });
    }

    if (!statusList.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    trackingNumbers[trackingNumber].status = status;
    res.json({ trackingNumber, status });
});

// Route to get package status
app.get('/status/:trackingNumber', (req, res) => {
    const { trackingNumber } = req.params;
    if (trackingNumbers[trackingNumber]) {
        return res.json(trackingNumbers[trackingNumber]);
    }
    res.status(404).json({ error: 'Tracking number not found' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});