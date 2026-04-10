import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FarmerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    aadhaar: '',
    location: '',
    crop_type: '',
  });
  const [loading, setLoading] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWalletDetails(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/farmers/register`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setWalletDetails(response.data);
      setFormData({ name: '', aadhaar: '', location: '', crop_type: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</span>
            <div className="hidden md:flex items-center gap-6 font-headline tracking-wide font-medium">
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
              <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/farmers">Farmers</Link>
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/yields/submit">Yields</Link>
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/sell">Sell</Link>
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/vendors">Vendors</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#002d1c] hover:bg-[#fbf9f6] transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <button className="p-2 text-[#002d1c] hover:bg-[#fbf9f6] transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="settings">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
              <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoV-VB8c6ZbH5l5qErlfY2of0QErowVRyb5bSD0luYsOTI52CTeVKsRudA2C1XXlukq3Qa2CUp4h3f2ffNHIT89OCLgT7JNhzaAJFsBgyi20BAntFxP1Bo7RG6VspbtWPhKiRW5aBnzwPJ-LJZTE3UYAv9KBqa5yDvr0icujfIYBs6XjRJOY5aQjhJxqyclbWpUDmpBCNnaYpMy4H4N5xkMhkpxj_44dKxR2voMqXb0QjAoSkMiUterzWu7jIhnzgPwZx8ZjnGmi6g" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mb-10">
          <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-3">Farmer Registration</h1>
          <p className="text-on-surface-variant text-lg">Onboard your farm to the Cropblock ledger for direct market access.</p>
        </div>

        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_8px_24px_rgba(27,28,26,0.06)] relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/20">
              {error}
            </div>
          )}

          {walletDetails ? (
             <div className="text-center py-8">
               <div className="inline-flex bg-primary-container p-4 rounded-full mb-6">
                 <span className="material-symbols-outlined text-on-primary text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
               </div>
               <h2 className="text-2xl font-bold text-primary font-headline mb-2">Registration Successful</h2>
               <p className="text-on-surface-variant mb-8">Your identity has been secured on the blockchain network.</p>
               
               <div className="bg-surface-container-high rounded-xl p-6 text-left border border-outline-variant/30 space-y-4">
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Public Ledger Address</p>
                   <p className="font-mono text-primary font-semibold break-all bg-surface-container p-3 rounded">{walletDetails.walletAddress}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Private Key (Phantom Wallet)</p>
                   <p className="font-mono text-error font-semibold break-all bg-error-container/30 px-3 py-2 rounded">{walletDetails.secretKey}</p>
                   <p className="text-xs text-error mt-2 italic">*Keep this private key safe. Never share it.</p>
                 </div>
               </div>

               <button onClick={() => setWalletDetails(null)} className="mt-8 h-12 px-8 border border-outline-variant/30 text-primary rounded-md font-semibold hover:bg-surface-container transition-all active:scale-95">
                 Register Another
               </button>
             </div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex items-center justify-center gap-3 bg-primary-container/5 py-4 rounded-lg mb-8">
                <div className="bg-primary-container p-1 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <span className="font-label text-xs uppercase tracking-widest font-semibold text-primary">Blockchain Verified Entry</span>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="h-[56px] px-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body w-full" placeholder="e.g. Samuel Green" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Aadhaar Number</label>
                    <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} required className="h-[56px] px-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body w-full" placeholder="XXXX-XXXX-XXXX" type="text" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Location</label>
                    <input name="location" value={formData.location} onChange={handleChange} required className="h-[56px] px-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body w-full" placeholder="Farm Address or Region" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Crop Category</label>
                    <select name="crop_type" value={formData.crop_type} onChange={handleChange} required className="h-[56px] px-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body w-full">
                      <option value="">Select Category</option>
                      <option value="Grains">Grains & Cereals</option>
                      <option value="Fruits">Fruits & Orchard</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Cash Crops">Cash Crops (Cotton, Coffee)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button disabled={loading} type="submit" className="w-full h-[64px] bg-primary text-on-primary font-headline font-bold text-lg rounded-md hover:bg-primary-container transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-3 disabled:opacity-70">
                  <span>{loading ? 'Securing Ledger...' : 'Register Account'}</span>
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
                <p className="text-center text-xs font-label text-on-surface-variant/60 mt-6 leading-relaxed">
                  By registering, you agree to secure your transactions on the Cropblock ledger. Your data is encrypted and used only for marketplace validation.
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-16">
          <div className="p-6 bg-surface-container-low rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
            <div>
              <h3 className="font-headline font-bold text-sm text-primary mb-1">Encrypted Data</h3>
              <p className="font-body text-xs text-on-surface-variant">End-to-end encryption for all personal farm records.</p>
            </div>
          </div>
          <div className="p-6 bg-surface-container-low rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>hub</span>
            <div>
              <h3 className="font-headline font-bold text-sm text-primary mb-1">Market Reach</h3>
              <p className="font-body text-xs text-on-surface-variant">Connect directly with 500+ verified regional vendors.</p>
            </div>
          </div>
          <div className="p-6 bg-surface-container-low rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
            <div>
              <h3 className="font-headline font-bold text-sm text-primary mb-1">Fast Payments</h3>
              <p className="font-body text-xs text-on-surface-variant">Smart contracts ensure automatic, fair compensation.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#c1c8c2]/20 bg-[#fbf9f6]">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-[1440px] mx-auto space-y-4 md:space-y-0">
          <div className="flex items-center gap-6">
            <span className="font-headline font-bold text-[#002d1c]">Cropblock</span>
            <span className="font-label text-sm uppercase tracking-wider text-[#002d1c]/50">© 2024 Cropblock Ledger. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-label text-sm uppercase tracking-wider">
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-opacity cursor-pointer" to="#">Privacy Policy</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-opacity cursor-pointer" to="#">Terms of Service</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-opacity cursor-pointer" to="#">Blockchain Verification</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-opacity cursor-pointer" to="#">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FarmerRegistration;