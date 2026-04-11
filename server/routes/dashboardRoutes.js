const express = require('express');
const db = require('../db/connection');
const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ total_farmers }]] = await db.query('SELECT COUNT(*) as total_farmers FROM farmers');
    const [[{ total_volume_sold, total_value_traded }]] = await db.query(`
      SELECT 
        COALESCE(SUM(weight), 0) as total_volume_sold,
        COALESCE(SUM(weight * price), 0) as total_value_traded
      FROM sales
    `);
    const [[{ active_supply }]] = await db.query(`
      SELECT COALESCE(SUM(weight), 0) as active_supply FROM yields
    `);

    res.json({
      total_farmers,
      total_volume_sold,
      total_value_traded,
      active_supply
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/dashboard/transactions
router.get('/transactions', async (req, res) => {
  try {
    const [transactions] = await db.query(`
      SELECT 
        sales.id, 
        farmers.name AS farmer_name, 
        sales.crop, 
        sales.weight, 
        sales.price, 
        (sales.weight * sales.price) AS total_value
      FROM sales 
      JOIN farmers ON farmers.id = sales.farmer_id 
      ORDER BY sales.id DESC
    `);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
