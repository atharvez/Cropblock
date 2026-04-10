const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// Check if .env was loaded from root if not found in server/
if (!process.env.MINT_PUBLIC_KEY) {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
}

// Initialize Express app
const app = express();

// Import Routes
const farmerRoutes = require('./routes/farmerRoutes');
const yieldRoutes = require('./routes/yieldRoutes');
const sellRoutes = require('./routes/sellRoutes'); // Add this line for the new sell routes

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Define Routes
app.use('/api/farmers', farmerRoutes); // Farmer routes
app.use('/api/yields', yieldRoutes);   // Yield routes
app.use('/api/sell', sellRoutes);      // Add this line for the sell routes

// Health Check or Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Supply Chain Management API!');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});