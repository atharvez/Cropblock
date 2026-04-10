import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const YieldSubmission = () => {
  const [yieldData, setYieldData] = useState({
    farmer_id: '',
    crop: '',
    weight: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);

  React.useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/farmers`);
        setFarmers(response.data);
      } catch (err) {
        console.error('Error fetching farmers:', err);
      } finally {
        setLoadingFarmers(false);
      }
    };
    fetchFarmers();
  }, []);

  const CROP_CATEGORIES = {
    "Grains": ["Wheat", "Rice", "Maize", "Barley", "Oats"],
    "Fruits": ["Apples", "Bananas", "Mangoes", "Citrus", "Grapes"],
    "Vegetables": ["Tomatoes", "Potatoes", "Onions", "Leafy Greens", "Carrots"],
    "Cash Crops": ["Cotton", "Sugarcane", "Coffee", "Cocoa", "Tea"]
  };

  const selectedFarmer = farmers.find(f => f.id.toString() === yieldData.farmer_id.toString());
  const availableCrops = selectedFarmer && selectedFarmer.crop_type && CROP_CATEGORIES[selectedFarmer.crop_type] 
      ? CROP_CATEGORIES[selectedFarmer.crop_type] 
      : [];

  const handleChange = (e) => {
    setYieldData({ ...yieldData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/yields/add`,
        yieldData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSuccess(true);
      setYieldData({ farmer_id: '', crop: '', weight: '', price: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting yield to network');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</div>
          <div className="hidden md:flex items-center space-x-8 font-headline tracking-wide font-medium">
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/farmers">Farmers</Link>
            <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/yields/submit">Yields</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/sell">Sell</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/vendors">Vendors</Link>
          </div>
          <div className="flex items-center space-x-5">
            <button className="p-2 rounded-full hover:bg-surface-container transition-all duration-200 active:scale-95">
              <span className="material-symbols-outlined text-primary">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container transition-all duration-200 active:scale-95">
              <span className="material-symbols-outlined text-primary">settings</span>
            </button>
            <div className="h-10 w-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
              <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA372Vu8ol5UzQ7dGPZShcQhVM_yTkHbT1wRc3iHOrpNmDYHiKdTtbaztiY-lxZDyHi31VCS2KaRCUXcjpHgNSqg8fUd8wsY3u0jPr_1lnb7fAgRe-afYlwrb99dq33ZnTEtAU2N-ZPJlB5vPb7PMhHSjt3RccUgioO6mnARszXUv3WJpyFw4iIIzZ1jbMpHdxYCnVEBk-zKEuRa3s4EBCo7vuyqxTs2RLBBCYVOqTutNZCob8nGsbbSxbqOE5_2oOeRLWZqBSG_aRI" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-12">
            <header>
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight mb-4">Submit Your Harvest</h1>
              <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                Digitize your agricultural output. Every entry is cryptographically signed and added to the Cropblock ledger to ensure absolute provenance.
              </p>
            </header>
            
            {success && (
              <div className="bg-primary-container text-on-primary-container p-6 rounded-xl flex items-center gap-4">
                 <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                 <div>
                   <h3 className="font-bold text-lg">Yield Broadcast Complete</h3>
                   <p className="opacity-90">Tokens have been dispersed seamlessly via smart contract.</p>
                 </div>
              </div>
            )}
            
            {error && (
              <div className="bg-error-container text-on-error-container p-6 rounded-xl flex items-center gap-4">
                 <span className="material-symbols-outlined text-3xl">error</span>
                 <div>
                   <h3 className="font-bold text-lg">Submission Failed</h3>
                   <p className="opacity-90">{error}</p>
                 </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-surface-container-low rounded-xl p-8 space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
                  <h2 className="text-xl font-bold font-headline text-primary uppercase tracking-wider">Yield Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Farmer Ledger ID (Database ID)</label>
                    <div className="relative">
                      <select name="farmer_id" value={yieldData.farmer_id} onChange={handleChange} required className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface appearance-none">
                        <option value="">Select Farmer</option>
                        {farmers.map(f => (
                          <option key={f.id} value={f.id}>{f.name} (ID: {f.id} - Type: {f.crop_type || 'Uncategorized'})</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Crop Type</label>
                    <div className="relative">
                      <select name="crop" value={yieldData.crop} onChange={handleChange} required disabled={!selectedFarmer || availableCrops.length === 0} className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg appearance-none focus:ring-2 focus:ring-primary/20 text-on-surface disabled:opacity-50">
                        <option value="">{selectedFarmer ? 'Select Variety' : 'Select Farmer First'}</option>
                        {availableCrops.map(crop => (
                          <option key={crop} value={crop}>{crop}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Quantity (kg)</label>
                    <div className="relative">
                      <input name="weight" value={yieldData.weight} onChange={handleChange} required className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant" placeholder="0.00" type="number" />
                      <span className="absolute right-4 top-4 font-bold text-primary/40">KG</span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label">Market Value Estimated (₹/kg)</label>
                    <div className="relative">
                      <input name="price" value={yieldData.price} onChange={handleChange} required className="w-full h-14 px-4 bg-surface-container-high border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant" placeholder="0.00" type="number" />
                      <span className="material-symbols-outlined absolute right-4 top-4 text-outline pointer-events-none">payments</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-surface-container-low rounded-xl p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>photo_camera</span>
                  <h2 className="text-xl font-bold font-headline text-primary uppercase tracking-wider">Visual Verification</h2>
                </div>
                <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 hover:bg-surface-container-high transition-colors group cursor-pointer relative">
                  <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-primary">Upload Crop Images</p>
                    <p className="text-sm text-on-surface-variant">Drag and drop or click to browse (JPG, PNG up to 10MB)</p>
                  </div>
                  <input type="file" className="block absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-container text-on-primary px-12 py-5 rounded-lg font-headline font-bold text-lg transition-all duration-300 custom-shadow active:scale-[0.98] disabled:opacity-70">
                  {loading ? 'Executing Protocol...' : 'Submit Yield'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-primary text-on-primary rounded-xl overflow-hidden custom-shadow">
              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-on-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                  <h3 className="text-lg font-bold font-headline uppercase tracking-widest">Trust Protocol</h3>
                </div>
                <p className="text-on-primary-container leading-relaxed">
                  Cropblock uses a distributed ledger to create an immutable record of your harvest. Once submitted, your yield data is:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <span className="material-symbols-outlined text-on-primary-container mt-1">link</span>
                    <span className="text-sm">Hashed and timestamped on a public blockchain network.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="material-symbols-outlined text-on-primary-container mt-1">visibility</span>
                    <span className="text-sm">Traceable by end-consumers via unique QR codes.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="material-symbols-outlined text-on-primary-container mt-1">security</span>
                    <span className="text-sm">Secured against post-harvest data manipulation.</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <div className="bg-primary-container/40 p-4 rounded-lg border border-primary-container/60">
                    <span className="text-[10px] block font-bold uppercase tracking-widest mb-1 opacity-60">Status Lozenge</span>
                    <div className="flex items-center text-on-primary-container">
                      <span className="material-symbols-outlined text-xs mr-2">token</span>
                      <span className="font-mono text-xs">Node Connection: Established</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-48 relative overflow-hidden">
                <img alt="Agricultural landscape" className="object-cover w-full h-full opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtP4Wlb0sEqGsOwv4wW1z4qKRRbfOsqd3Plv-00FYPJwq01loGPqDg8FYPJdxQ_2KSvmlWqbfuxdvW5oC6mg5Zk6c9CgEvb3Ud7IWuW8AAuJIuSwogrgieVIVyq1X_gVLWV2jzR60tWCZ1mrtkj8-3wFPds5UlM-ihf5OkO0_ADwrXPN-hbIb9Zv6EDA3Tj2nwHs2ms49tUby7KK9221oGgIXt8BSFD49uJLFnvox3BVoSpesJ4Z4hlc4J3JUtrPE2zldpetYwNSI6" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-8 space-y-4">
              <span className="material-symbols-outlined text-secondary">help_outline</span>
              <h4 className="font-headline font-bold text-primary">Need assistance?</h4>
              <p className="text-sm text-on-surface-variant">Verify the quantity matches your weigh-bridge ticket. Inaccurate entries may lead to ledger disputes.</p>
              <Link className="text-secondary font-bold text-sm flex items-center hover:opacity-80 transition-opacity" to="#">
                View Submission Guide 
                <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#c1c8c2]/20 bg-[#fbf9f6]">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-[1440px] mx-auto space-y-4 md:space-y-0">
          <div className="font-headline font-bold text-[#002d1c]">Cropblock Ledger</div>
          <div className="flex flex-wrap justify-center gap-6 font-body text-sm uppercase tracking-wider">
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-colors" to="#">Privacy Policy</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-colors" to="#">Terms of Service</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-colors" to="#">Blockchain Verification</Link>
            <Link className="text-[#002d1c]/50 hover:text-[#884f42] transition-colors" to="#">Contact Support</Link>
          </div>
          <div className="font-body text-sm uppercase tracking-wider text-[#002d1c]/50">
            © 2024 Cropblock Ledger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YieldSubmission;