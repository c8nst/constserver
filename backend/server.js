
// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(bodyParser.json()); // Parse JSON request bodies

// Path to store our data
const dataFilePath = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({ data: "No data received yet" }), 'utf8');
}

// API endpoint to receive data
app.post('/api/create-answer', (req, res) => {
  try {
    // Extract data from request body
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data field is required' });
    }
    
    // Store the data
    fs.writeFileSync(dataFilePath, JSON.stringify({ data }), 'utf8');
    
    // Respond with success
    res.status(200).json({ success: true, message: 'Data received and stored' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to retrieve the stored data
app.get('/api/get-answer', (req, res) => {
  try {
    // Read the stored data
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
