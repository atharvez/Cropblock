import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const farmerRes = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/farmers/${id}`);
        setFarmer(farmerRes.data);
        
        try {
          const stocksRes = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/sell/stocks/${id}`);
          setStocks(stocksRes.data);
        } catch(stockErr) {
          // If 404, they just have no stocks.
          setStocks([]);
        }
        
      } catch (err) {
        setError("Farmer identity could not be found on the ledger.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-6">
        <div className="bg-error-container text-on-error-container p-8 rounded-xl max-w-md w-full text-center">
          <span className="material-symbols-outlined text-5xl mb-4">error</span>
          <h2 className="text-xl font-bold font-headline mb-2">Immutable Record Missing</h2>
          <p>{error}</p>
          <Link to="/farmers" className="mt-6 inline-block text-primary hover:underline font-bold">Return to Directory</Link>
        </div>
      </div>
    );
  }

  // To display the Aadhar securely, mask it.
  const maskedAadhaar = farmer.aadhaar ? `XXXX-XXXX-${farmer.aadhaar.slice(-4)}` : 'N/A';

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-primary font-headline">Cropblock Ledger</div>
          <div className="hidden md:flex items-center space-x-8 font-headline tracking-wide font-medium">
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
            <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/farmers">Farmers</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/yields/submit">Yields</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/sell">Sell</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/vendors">Vendors</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Farmer Overview */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                     <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>verified</span> 
                     Identity Verified
                  </div>
               </div>
               
               <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-extrabold text-4xl mb-6 shadow-inner">
                 {farmer.name.charAt(0).toUpperCase()}
               </div>
               
               <h1 className="text-3xl font-extrabold font-headline text-primary mb-1">{farmer.name}</h1>
               <p className="text-secondary font-bold text-sm tracking-widest uppercase mb-4">{farmer.crop_type} Specialist</p>

               <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                 <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                   <div>
                     <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Registered Location</p>
                     <p className="font-medium text-on-surface">{farmer.location || 'Not Specified'}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined text-on-surface-variant">badge</span>
                   <div>
                     <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Government ID</p>
                     <p className="font-medium text-on-surface tracking-widest">{maskedAadhaar}</p>
                   </div>
                 </div>
               </div>

               <div className="mt-8 pt-6 border-t border-outline-variant/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Blockchain Address</p>
                  <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between group">
                    <span className="font-mono text-xs text-primary truncate w-full">{farmer.wallet}</span>
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-sm ml-2">content_copy</button>
                  </div>
               </div>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30 text-center flex flex-col items-center">
               <span className="material-symbols-outlined text-secondary text-3xl mb-2">qr_code_scanner</span>
               <h3 className="font-bold text-primary font-headline mb-4">Mobile Profile Access</h3>
               <div className="bg-white p-3 rounded-xl shadow-sm inline-block">
                 <QRCodeCanvas value={window.location.href} size={150} level={"H"} className="rounded" />
               </div>
               <p className="text-xs text-on-surface-variant mt-4 opacity-80 leading-relaxed max-w-[200px]">
                 Scan this QR code to verify this farmer's ledger history on the go.
               </p>
            </div>
          </div>

          {/* Right Column: Inventory & Stats */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary text-on-primary rounded-2xl p-6 relative overflow-hidden">
                   <div className="relative z-10">
                     <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Available Inventory Types</p>
                     <h2 className="text-4xl font-extrabold font-headline">{stocks.length}</h2>
                   </div>
                   <span className="material-symbols-outlined absolute right-4 bottom-4 text-6xl opacity-10" style={{fontVariationSettings: "'FILL' 1"}}>inventory_2</span>
                </div>
                
                <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-6 relative overflow-hidden">
                   <div className="relative z-10">
                     <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Yield Mass</p>
                     <h2 className="text-4xl font-extrabold font-headline">
                        {stocks.reduce((sum, s) => sum + parseFloat(s.weight), 0).toFixed(1)} <span className="text-xl font-normal opacity-80">KG</span>
                     </h2>
                   </div>
                   <span className="material-symbols-outlined absolute right-4 bottom-4 text-6xl opacity-10" style={{fontVariationSettings: "'FILL' 1"}}>scale</span>
                </div>
             </div>

             {/* Inventory List */}
             <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
                   <h2 className="text-xl font-bold font-headline text-primary">Current Ledger Inventory</h2>
                   <Link to="/sell" className="text-sm font-bold bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-container transition-colors">
                     Initiate Trade
                   </Link>
                </div>
                
                <div className="p-6 flex-grow">
                   {stocks.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                         <span className="material-symbols-outlined text-5xl mb-3">hourglass_empty</span>
                         <p className="font-semibold">No active inventory.</p>
                         <p className="text-sm mt-1">This farmer has sold all their yields.</p>
                      </div>
                   ) : (
                      <div className="space-y-4">
                         {stocks.map(stock => (
                            <div key={stock.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-secondary/40 transition-colors">
                               <div>
                                 <h3 className="font-bold text-primary font-headline text-lg">{stock.crop}</h3>
                                 <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Database Hash ID: {stock.id}</p>
                               </div>
                               <div className="flex items-center gap-6 mt-4 md:mt-0 text-right w-full md:w-auto overflow-hidden">
                                 <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Available Mass</p>
                                    <p className="font-bold text-on-surface text-lg">{stock.weight} <span className="text-sm font-normal">kg</span></p>
                                 </div>
                                 <div className="h-8 w-px bg-outline-variant/30"></div>
                                 <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Oracle Price</p>
                                    <p className="font-bold text-secondary text-lg">₹{stock.price}<span className="text-sm font-normal">/kg</span></p>
                                 </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerProfile;
