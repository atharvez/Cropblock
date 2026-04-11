import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellPage = () => {
  const [stocks, setStocks] = useState([]);
  const [farmerId, setFarmerId] = useState('');
  
  // Sell Logic states
  const [selectedCrop, setSelectedCrop] = useState('');
  const [saleWeight, setSaleWeight] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tokensToSend, setTokensToSend] = useState(null);

  const fetchStocks = async () => {
    setLoadingFetch(true);
    setError(null);
    setSuccess(null);
    try {
      if (!farmerId) {
        setError('Please enter a valid ledger ID.');
        setLoadingFetch(false);
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/sell/stocks/${farmerId}`);
      const data = await response.json();

      if (response.ok) {
        setStocks(data);
      } else {
        setError(data.error || 'Failed to locate ledger assets');
        setStocks([]);
      }
    } catch (err) {
      setError('Error querying blockchain database.');
    } finally {
      setLoadingFetch(false);
    }
  };

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
    setLoadingSale(true);
    setError(null);
    setSuccess(null);
    setTokensToSend(null);

    const saleData = {
      crop: selectedCrop,
      weight: saleWeight,
      price: salePrice,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/sell/sell/${farmerId}`, saleData);
      const data = response.data;
      setSuccess(`Sale Executed on Ledger: ${data.crop} sold successfully!`);
      setTokensToSend(data.tokensToSend);
      // Refresh stocks after sale
      fetchStocks();
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing transaction on blockchain');
    } finally {
      setLoadingSale(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-[#fbf9f6]/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</div>
          <div className="hidden md:flex items-center space-x-8 font-['Manrope'] tracking-wide font-medium">
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/farmers">Farmers</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/dashboard">Dashboard</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/yields/submit">Yields</Link>
            <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/sell">Sell</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/vendors">Vendors</Link>
          </div>
          <div className="flex items-center space-x-5">
            <button className="material-symbols-outlined text-[#002d1c] p-2 hover:bg-[#fbf9f6] transition-all duration-200 rounded-full active:scale-95" data-icon="notifications">notifications</button>
            <button className="material-symbols-outlined text-[#002d1c] p-2 hover:bg-[#fbf9f6] transition-all duration-200 rounded-full active:scale-95" data-icon="settings">settings</button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
              <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-L_HWgBDEIMg3FRyYklVq4NUg2nJgaR8XkYsGrlTW2__DdZh_gbLUkqRkD3jQvLLa2Hkd30NTR8RDBhY8rDIz_cHhT5Np2rQwSW8ii7na60P2BuUiVZZmyGCsp6bUlAOgC5BH_QX06Xa4bll0b7NDjGO3L_NPEJFHQSHv6PIaTAYR-D30XL7H69bve-wUe9OutYfuJ2vqAsysydtHpmw0oR3cgoKQFxnXCwXuFMgBycZ99LBWKuUyf3U9WbiCoaHaY8x4kCzKWp-T" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8 max-w-[1440px] mx-auto">
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-2">Sell Dashboard</h1>
          <p className="text-on-surface-variant max-w-2xl">Manage your crop yields, track blockchain certifications, and accept the best market offers directly from verified global vendors.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Total Yield Available</span>
              <div className="font-headline text-3xl font-bold text-primary">{stocks.reduce((acc, s) => acc + s.weight, 0)} kg</div>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl">agriculture</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-secondary relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-widest block mb-1">Blockchain Tokens Earned</span>
              <div className="font-headline text-3xl font-bold text-primary">{tokensToSend || 0} Tx</div>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
            </div>
          </div>
          <div className="bg-primary-container p-8 rounded-xl shadow-sm relative overflow-hidden group flex flex-col justify-center">
            <div className="relative z-10">
              <label className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-2 block">Lookup Farmer Ledger ID</label>
              <div className="flex gap-2">
                <input type="text" value={farmerId} onChange={(e) => setFarmerId(e.target.value)} placeholder="e.g. 1" className="h-10 px-3 flex-grow rounded-md border-none focus:ring-2 focus:ring-primary text-gray-900" />
                <button onClick={fetchStocks} disabled={loadingFetch} className="bg-white text-primary-container px-4 rounded-md font-bold hover:bg-gray-100 transition shadow">
                  {loadingFetch ? '...' : 'Query'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
            <div className="mb-6 bg-error-container text-on-error-container p-4 rounded-xl border border-error/20 flex items-center gap-3">
              <span className="material-symbols-outlined shrink-0 text-xl">error</span>
              <span className="font-semibold">{error}</span>
            </div>
        )}

        {success && (
            <div className="mb-6 bg-[#d4edda] text-[#155724] p-4 rounded-xl border border-[#c3e6cb] flex items-center gap-3">
              <span className="material-symbols-outlined shrink-0 text-xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="font-semibold">{success}</span>
            </div>
        )}

        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="font-headline text-2xl font-bold text-primary">Execute Crop Sale</h2>
          </div>

          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm pt-6 px-8 pb-8">
            {stocks.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3 block">inventory_2</span>
                <p className="text-on-surface-variant">No crops available. Lookup a Farmer ID first.</p>
              </div>
            ) : (
               <form onSubmit={handleSell} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Select Asset</label>
                    <div className="relative">
                      <select required value={selectedCrop} onChange={handleCropChange} className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg appearance-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                        <option value="" disabled>Select from available {stocks.length} assets</option>
                        {stocks.map(s => (
                           <option key={s.id} value={s.crop}>{s.crop} ({s.weight}kg)</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Price Estimated (₹)</label>
                    <input readOnly value={salePrice} type="number" className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg text-on-surface opacity-70" placeholder="0.00" />
                  </div>

                  <div className="space-y-2 md:col-span-2 flex items-end gap-4">
                    <div className="flex-grow space-y-2">
                       <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Weight to Sell (kg)</label>
                       <input required value={saleWeight} onChange={(e) => setSaleWeight(e.target.value)} type="number" className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface" />
                    </div>
                    <button type="submit" disabled={loadingSale} className="h-14 bg-primary text-on-primary px-8 rounded-lg text-sm font-bold shadow-md hover:bg-primary-container active:scale-95 transition-all min-w-[200px]">
                      {loadingSale ? 'Processing...' : 'Accept Best Offer'}
                    </button>
                  </div>
               </form>
            )}
          </div>
          
          {/* Decorative Static Content from UI template */}
          <div className="opacity-70 mt-12 bg-surface-container-low rounded-xl overflow-hidden shadow-sm border-2 border-dashed border-outline-variant/30 pointer-events-none">
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-3xl">pending_actions</span>
            </div>
            <div>
            <h3 className="font-headline font-bold text-lg text-primary">Awaiting Harvest Certification</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto">Your past shipments are currently being audited by a 3rd-party inspector.</p>
            </div>
            <div className="flex items-center gap-3">
            <div className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Pending Audit
                                        </div>
            </div>
            </div>
          </div>

        </section>
      </main>

      <footer className="bg-[#fbf9f6] w-full border-t border-[#c1c8c2]/20 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-[1440px] mx-auto space-y-4 md:space-y-0">
          <div className="font-headline font-bold text-[#002d1c]">Cropblock Ledger</div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-sm uppercase tracking-wider">
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-colors" to="#">Privacy Policy</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-colors" to="#">Terms of Service</Link>
          </div>
          <div className="font-body text-sm uppercase tracking-wider text-[#002d1c]/50">
            © 2024 Cropblock Ledger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellPage;