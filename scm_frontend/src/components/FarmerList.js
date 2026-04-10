import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Divider, Chip } from '@mui/material';

const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/farmers`);
        setFarmers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch farmers. Please try again later.');
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <CircularProgress color="primary" />
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Registered <span style={{ color: '#2ecc71' }}>Farmers</span>
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {farmers.length === 0 ? (
           <Typography sx={{ textAlign: 'center', opacity: 0.7 }}>No farmers registered yet.</Typography>
        ) : (
          farmers.map((farmer) => (
            <Card key={farmer.id} className="glass-card" sx={{ '&:hover': { transform: 'translateY(-2px)', transition: '0.3s' }}}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{farmer.name}</Typography>
                  <Chip label={`ID: ${farmer.id}`} color="primary" size="small" />
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>Solana Wallet Address:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#1abc9c', wordBreak: 'break-all', background: 'rgba(0,0,0,0.3)', p: 1.5, borderRadius: 2 }}>
                  {farmer.wallet}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default FarmersList;