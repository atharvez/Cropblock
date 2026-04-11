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
    if (farmer) {
      navigator.clipboard.writeText(farmer.wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
      <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</span>
          <div className="hidden md:flex items-center gap-6 font-headline tracking-wide font-medium">
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/farmers">Farmers</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/yields/submit">Yields</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/sell">Sell</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/vendors">Vendors</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#002d1c] hover:bg-[#fbf9f6] transition-all active:scale-95">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
            <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoV-VB8c6ZbH5l5qErlfY2of0QErowVRyb5bSD0luYsOTI52CTeVKsRudA2C1XXlukq3Qa2CUp4h3f2ffNHIT89OCLgT7JNhzaAJFsBgyi20BAntFxP1Bo7RG6VspbtWPhKiRW5aBnzwPJ-LJZTE3UYAv9KBqa5yDvr0icujfIYBs6XjRJOY5aQjhJxqyclbWpUDmpBCNnaYpMy4H4N5xkMhkpxj_44dKxR2voMqXb0QjAoSkMiUterzWu7jIhnzgPwZx8ZjnGmi6g" />
          </div>
        </div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer className="w-full border-t border-[#c1c8c2]/20 bg-[#fbf9f6]">
      <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-[1440px] mx-auto space-y-4 md:space-y-0">
        <div className="flex items-center gap-6">
          <span className="font-headline font-bold text-[#002d1c]">Cropblock</span>
          <span className="font-label text-sm uppercase tracking-wider text-[#002d1c]/50">© 2024 Cropblock Ledger. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );

  if (loading) {
    return (
      <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-8">
          <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 text-center max-w-md w-full">
            <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
            <h2 className="font-headline text-2xl font-bold text-primary mb-2">Not Found</h2>
            <p className="text-on-surface-variant mb-6">{error}</p>
            <Link to="/farmers" className="inline-flex h-12 px-6 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-all active:scale-95 items-center justify-center">
              Back to Farmers
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const maskedAadhaar = farmer.aadhaar ? `XXXX-XXXX-${farmer.aadhaar.slice(-4)}` : 'N/A';
  const totalWeight = stocks.reduce((sum, s) => sum + parseFloat(s.weight || 0), 0);
  const initials = farmer.name ? farmer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'FA';

  const categoryColors = {
    'Grains': 'bg-amber-100 text-amber-700 border-amber-200',
    'Fruits': 'bg-orange-100 text-orange-700 border-orange-200',
    'Vegetables': 'bg-green-100 text-green-700 border-green-200',
    'Cash Crops': 'bg-purple-100 text-purple-700 border-purple-200',
  };
  const badgeClass = categoryColors[farmer.crop_type] || 'bg-primary-container text-on-primary-container border-primary/20';

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-[1200px] mx-auto min-h-screen">
        {/* Back Link for Mobile */}
        <div className="mb-6 md:hidden">
          <Link to="/farmers" className="text-primary font-bold flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Directory
          </Link>
        </div>

        <div className="flex justify-between items-end mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-2">Public Profile</h1>
            <p className="text-on-surface-variant max-w-2xl text-lg">Identity verified on the blockchain.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Identity Card */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
                <div className="w-28 h-28 shrink-0 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-4xl uppercase border-4 border-surface shadow-md">
                  {initials}
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="font-headline text-3xl font-extrabold text-[#1a1a1a] mb-2">{farmer.name}</h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-6 ${badgeClass}`}>
                    {farmer.crop_type} Specialist
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-1">Location</p>
                      <p className="font-semibold text-primary">{farmer.location || 'N/A'}</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-1">Gov. ID</p>
                      <p className="font-semibold text-primary">{maskedAadhaar}</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-1">Active Crops</p>
                      <p className="font-semibold text-primary">{stocks.length}</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                      <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-1">Total Stock</p>
                      <p className="font-semibold text-primary">{totalWeight.toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Inventory */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-2xl font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">inventory_2</span> Live Inventory
                </h3>
                <Link to="/sell" className="text-secondary font-bold text-sm hover:underline flex items-center gap-1">
                  Trade active stocks <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              {stocks.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-outline-variant/30 rounded-2xl flex flex-col items-center justify-center bg-surface-container-low">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
                  <p className="text-on-surface-variant font-medium">No active inventory currently listed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stocks.map((stock) => (
                    <div key={stock.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low hover:border-primary/30 transition-colors">
                      <div className="mb-2 sm:mb-0">
                        <p className="font-headline font-bold text-lg text-primary">{stock.crop}</p>
                        <p className="text-xs text-on-surface-variant font-mono">Lot ID: #{stock.id}</p>
                      </div>
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-0.5">Volume</p>
                          <p className="font-bold text-primary">{stock.weight} kg</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider mb-0.5">Price</p>
                          <p className="font-bold text-secondary">₹{stock.price}/kg</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Wallet Hash */}
            <div className="bg-primary text-on-primary rounded-3xl p-6 shadow-lg shadow-primary/20">
              <div className="flex items-center space-x-2 mb-4">
                <span className="material-symbols-outlined">link</span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-primary-container">Blockchain Address</h3>
              </div>
              <div className="bg-on-primary/10 rounded-xl p-4 flex flex-col gap-3">
                <p className="font-mono text-sm break-all leading-relaxed">{farmer.wallet}</p>
                <button 
                  onClick={handleCopy} 
                  className="bg-primary-container text-on-primary-container flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm hover:brightness-105 active:scale-95 transition-all w-full mt-2"
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                  {copied ? 'Copied to Clipboard' : 'Copy Address'}
                </button>
              </div>
            </div>

            {/* QR Scanner Block - Hidden on small screens, heavily stylized */}
            <div className="hidden sm:block bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                </div>
              </div>
              
              <h3 className="font-headline font-bold text-xl text-primary mb-2">Verify Identity</h3>
              <p className="text-sm text-on-surface-variant mb-6 px-4">
                Scan this cryptographically secure QR code with any mobile device to view this verified profile.
              </p>
              
              <div className="inline-block bg-white p-4 rounded-2xl shadow-inner border border-outline-variant/30 mb-2 relative">
                {/* Scanner decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg pointer-events-none"></div>
                
                <QRCodeCanvas value={window.location.href} size={160} level="H" fgColor="#002d1c" />
              </div>
              <p className="text-[10px] uppercase font-bold text-outline tracking-widest mt-4">Scan for mobile view</p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FarmerProfile;

