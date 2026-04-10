import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Divider, Chip, Grid } from '@mui/material';

const YieldsList = () => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYields = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/yields`);
        setYields(response.data);
      } catch (err) {
        setError('Error fetching yields from blockchain/database.');
      } finally {
        setLoading(false);
      }
    };

    fetchYields();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <CircularProgress color="primary" />
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Submitted <span style={{ color: '#2ecc71' }}>Yields</span>
      </Typography>

      {yields.length === 0 ? (
        <Typography sx={{ textAlign: 'center', opacity: 0.7 }}>No yields have been recorded onto the ledger yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {yields.map((yieldEntry) => (
            <Grid item xs={12} sm={6} md={4} key={yieldEntry.id}>
              <Card className="glass-card" sx={{ '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' }, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{yieldEntry.crop}</Typography>
                    <Chip label={`Ledger #${yieldEntry.id}`} color="secondary" size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#1abc9c', mb: 2 }}>{yieldEntry.farmer_name}</Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Weight:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{yieldEntry.weight} kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>Market Price:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{yieldEntry.price}/kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, p: 1, background: 'rgba(46, 204, 113, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Tokens Settled:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2ecc71' }}>{yieldEntry.tokens_earned} Tx</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default YieldsList;