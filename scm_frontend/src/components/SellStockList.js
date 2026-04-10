import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent } from '@mui/material';

const SellStockList = ({ onStocksFetched, setFarmerId }) => {
  const [farmerId, setLocalFarmerId] = useState('');
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      if (!farmerId) {
        setError('Please enter a valid ledger ID.');
        setLoading(false);
        return;
      }
      setFarmerId(farmerId);
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/sell/stocks/${farmerId}`);
      const data = await response.json();

      if (response.ok) {
        setStocks(data);
        setError('');
        onStocksFetched(data); 
      } else {
        setError(data.error || 'Failed to locate ledger assets');
        setStocks([]);
      }
    } catch (err) {
      setError('Error querying blockchain database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card" sx={{ mb: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
          Fetch <span style={{ color: '#2ecc71' }}>Ledger Assets</span>
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
          Query available stock tied to a specific Farmer identity.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
          <TextField
            label="Farmer Ledger ID"
            value={farmerId}
            onChange={(e) => setLocalFarmerId(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchStocks}
            disabled={loading}
            sx={{ px: 4, whiteSpace: 'nowrap' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Query Ledger'}
          </Button>
        </Box>

        {error && <Typography color="error" sx={{ mt: 2, fontWeight: 500 }}>{error}</Typography>}

        {stocks.length > 0 && (
          <TableContainer sx={{ mt: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#2ecc71', fontWeight: 700 }}>Asset Name</TableCell>
                  <TableCell sx={{ color: '#2ecc71', fontWeight: 700 }}>Available Weight</TableCell>
                  <TableCell sx={{ color: '#2ecc71', fontWeight: 700 }}>Market Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: '#fff' }}>{stock.crop}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{stock.weight} kg</TableCell>
                    <TableCell sx={{ color: '#fff' }}>₹{stock.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SellStockList;