import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const farmerRes = await axios.get(`${API}/api/farmers/${id}`);
        setFarmer(farmerRes.data);
        try {
          const stocksRes = await axios.get(`${API}/api/sell/stocks/${id}`);
          setStocks(stocksRes.data);
        } catch {
          setStocks([]);
        }
      } catch {
        setError('Farmer identity could not be found on the ledger.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(farmer.wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #1a6b3c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#1a6b3c', fontFamily: 'system-ui', fontWeight: 600 }}>Loading profile...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f7f0', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', maxWidth: 360, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: '#1a1a1a', fontFamily: 'system-ui', fontWeight: 700, marginBottom: 8 }}>Not Found</h2>
          <p style={{ color: '#666', fontFamily: 'system-ui', marginBottom: 24 }}>{error}</p>
          <Link to="/farmers" style={{ background: '#1a6b3c', color: '#fff', padding: '12px 24px', borderRadius: 10, fontFamily: 'system-ui', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Farmers
          </Link>
        </div>
      </div>
    );
  }

  const maskedAadhaar = farmer.aadhaar ? `XXXX-XXXX-${farmer.aadhaar.slice(-4)}` : 'N/A';
  const totalWeight = stocks.reduce((sum, s) => sum + parseFloat(s.weight || 0), 0);
  const initials = farmer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const categoryColors = {
    'Grains': '#f59e0b',
    'Fruits': '#f97316',
    'Vegetables': '#22c55e',
    'Cash Crops': '#8b5cf6',
  };
  const categoryColor = categoryColors[farmer.crop_type] || '#1a6b3c';

  return (
    <div style={{ background: '#f0f7f0', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Top Bar */}
      <div style={{ background: '#1a6b3c', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>
          🌿 Cropblock
        </Link>
        <Link to="/farmers" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          ← Directory
        </Link>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Hero Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: categoryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, margin: '0 auto 16px', boxShadow: `0 4px 16px ${categoryColor}40` }}>
            {initials}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            {farmer.name}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${categoryColor}15`, color: categoryColor, padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            <span>●</span> {farmer.crop_type} Specialist
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
            <div style={{ background: '#f8faf8', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999', marginBottom: 4 }}>Location</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>📍 {farmer.location || 'N/A'}</p>
            </div>
            <div style={{ background: '#f8faf8', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999', marginBottom: 4 }}>Gov. ID</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>🪪 {maskedAadhaar}</p>
            </div>
            <div style={{ background: '#f8faf8', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999', marginBottom: 4 }}>Crop Types</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: categoryColor }}>{stocks.length}</p>
            </div>
            <div style={{ background: '#f8faf8', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999', marginBottom: 4 }}>Total Stock</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a6b3c' }}>{totalWeight.toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div style={{ background: '#1a6b3c', borderRadius: 20, padding: '20px 20px', marginBottom: 16, boxShadow: '0 4px 16px rgba(26,107,60,0.3)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>
            🔗 Blockchain Address
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 11, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {farmer.wallet}
            </p>
            <button onClick={handleCopy} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* QR Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px', marginBottom: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>🔍 Scan to Verify</h3>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#888' }}>Share this QR to access profile on any device</p>
          <div style={{ display: 'inline-block', background: '#fff', padding: 12, borderRadius: 16, border: '2px solid #e8f0e8', boxShadow: '0 2px 12px rgba(26,107,60,0.1)' }}>
            <QRCodeCanvas value={window.location.href} size={180} level="H" />
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 12, color: '#aaa', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {window.location.href}
          </p>
        </div>

        {/* Inventory */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>🌾 Live Inventory</h3>
            <Link to="/sell" style={{ background: '#1a6b3c', color: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Trade
            </Link>
          </div>

          {stocks.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p style={{ margin: 0, color: '#aaa', fontWeight: 500 }}>No active inventory</p>
            </div>
          ) : (
            <div>
              {stocks.map((stock, i) => (
                <div key={stock.id} style={{ padding: '16px 20px', borderBottom: i < stocks.length - 1 ? '1px solid #f5f5f5' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{stock.crop}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#aaa' }}>ID #{stock.id}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: '#1a6b3c' }}>{stock.weight} kg</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#888', fontWeight: 600 }}>₹{stock.price}/kg</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', margin: '24px 0 0', fontSize: 12, color: '#bbb', fontWeight: 500 }}>
          © 2024 Cropblock Ledger • Verified Identity
        </p>
      </div>
    </div>
  );
};

export default FarmerProfile;
