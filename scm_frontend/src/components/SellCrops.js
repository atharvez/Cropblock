import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, CircularProgress, Card, CardContent, Snackbar, Alert, InputAdornment, MenuItem } from '@mui/material';

const SellCrops = ({ farmerId, stocks }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [saleWeight, setSaleWeight] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [tokensToSend, setTokensToSend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleCropChange = (e) => {
    const cropName = e.target.value;
    setSelectedCrop(cropName);

    const selectedStock = stocks.find((stock) => stock.crop === cropName);
    if (selectedStock) {
      setSalePrice(selectedStock.price);
    } else {
      setSalePrice('');
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setTokensToSend(null);
    setLoading(true);

    const saleData = {
      crop: selectedCrop,
      weight: saleWeight,
      price: salePrice,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/sell/sell/${farmerId}`, saleData);
      const data = response.data;
      setSnackbar({ open: true, message: `Sale Executed on Ledger: ${data.crop} sold successfully!`, severity: 'success' });
      setTokensToSend(data.tokensToSend);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Error processing transaction on blockchain', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
          Execute <span style={{ color: '#2ecc71' }}>Trade</span>
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 4 }}>
          Offload your stock onto the market and receive token settlement.
        </Typography>

        <form onSubmit={handleSell}>
          <TextField
            select
            label="Select Asset to Sell"
            value={selectedCrop}
            onChange={handleCropChange}
            required
            fullWidth
            sx={{ mb: 3 }}
            variant="outlined"
          >
            <MenuItem value="">
              <em>Select an Asset</em>
            </MenuItem>
            {stocks.map((stock) => (
              <MenuItem key={stock.id} value={stock.crop}>
                {stock.crop} (Available: {stock.weight}kg)
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Weight to Offload"
              type="number"
              value={saleWeight}
              onChange={(e) => setSaleWeight(e.target.value)}
              required
              fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
              variant="outlined"
            />
            <TextField
              label="Locked Price (Read Only)"
              type="number"
              value={salePrice}
              InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              fullWidth
              variant="outlined"
              sx={{ opacity: 0.7 }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : 'Confirm Sale Execution'}
          </Button>
        </form>

        {tokensToSend !== null && (
          <Box sx={{ mt: 4, p: 3, background: 'rgba(26, 188, 156, 0.1)', border: '1px solid #1abc9c', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#1abc9c', fontWeight: 600, mb: 1 }}>
              Trade Settled
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
               <Typography variant="body2" sx={{ opacity: 0.8 }}>Tokens Transferred:</Typography>
               <Typography variant="body1" sx={{ fontWeight: 700, color: '#2ecc71' }}>{tokensToSend} Tx</Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SellCrops;