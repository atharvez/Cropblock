const express = require('express');
const path = require('path');
const bs58 = require('bs58').default || require('bs58'); // Base58 encoding library
const router = express.Router();
const db = require('../db/connection');

const { Keypair } = require('@solana/web3.js');

// Route: Get all farmers
router.get('/', async (req, res) => {
  try {
    const [farmers] = await db.query('SELECT * FROM farmers');
    res.json(farmers);
  } catch (error) {
    console.error('Error fetching farmers:', error.message);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Route: Get a specific farmer by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [farmers] = await db.query('SELECT * FROM farmers WHERE id = ?', [id]);
    if (farmers.length === 0) {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmers[0]);
  } catch (error) {
    console.error('Error fetching farmer:', error.message);
    res.status(500).json({ error: 'Failed to fetch farmer profile' });
  }
});

// Route: Register a new farmer
router.post('/register', async (req, res) => {
  const { aadhaar, name, location, crop_type } = req.body;

  // Validate input
  if (!aadhaar || !name || !location || !crop_type) {
    return res.status(400).json({ error: 'Aadhaar, Name, Location, and Crop Type are required' });
  }

  try {
    // Generate wallet keypair
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toBase58(); // Public key in Base58 format
    const secretKeyArray = keypair.secretKey; // Secret key as a byte array

    // Convert the secret key array to a Base58-encoded string
    const secretKey = bs58.encode(secretKeyArray);

    // Validate generated wallet address
    try {
      bs58.decode(walletAddress);
    } catch (err) {
      console.error('Generated wallet address is invalid:', walletAddress);
      return res.status(500).json({ error: 'Failed to generate a valid wallet address' });
    }

    // Save farmer details to the database
    await db.query(
      'INSERT INTO farmers (aadhaar, name, wallet, location, crop_type, wallet_balance) VALUES (?, ?, ?, ?, ?, ?)',
      [aadhaar, name, walletAddress, location, crop_type, 0]
    );

    // Respond with wallet details
    res.json({
      message: 'Farmer registered successfully',
      walletAddress,
      secretKey,
    });
  } catch (error) {
    console.error('Error registering farmer:', error.message);
    res.status(500).json({ error: 'Failed to register farmer' });
  }
});

module.exports = router;