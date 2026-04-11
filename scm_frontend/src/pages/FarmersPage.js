import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FarmersPage = () => {
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

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
      <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</span>
            <div className="hidden md:flex items-center gap-6 font-headline tracking-wide font-medium">
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
              <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/farmers">Farmers</Link>
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/dashboard">Dashboard</Link>
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

      <main className="pt-32 pb-20 px-8 max-w-[1440px] mx-auto min-h-screen">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-2">Farmer Dashboard</h1>
            <p className="text-on-surface-variant max-w-2xl text-lg">Active participants authenticated on the Cropblock ledger.</p>
          </div>
          <Link to="/farmers/register" className="h-12 px-6 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-all active:scale-95 shadow shrink-0 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">add</span> Register New Farmer
          </Link>
        </header>

        {loading && (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/20 flex items-center gap-3">
             <span className="material-symbols-outlined shrink-0 text-xl">error</span>
             <span className="font-semibold">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.length === 0 ? (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">nature_people</span>
                <p className="text-on-surface-variant font-medium">No farmers registered yet.</p>
              </div>
            ) : (
               farmers.map(farmer => (
                 <article key={farmer.id} className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_24px_rgba(27,28,26,0.06)] hover:-translate-y-1 transition-transform duration-300 border border-outline-variant/20 flex flex-col group">
                   <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-xl uppercase">
                         {farmer.name.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-bold text-primary font-headline text-lg group-hover:text-secondary transition-colors line-clamp-1 truncate block max-w-[150px]">{farmer.name}</h3>
                         <div className="bg-surface-container px-2 py-0.5 rounded-sm inline-flex items-center mt-1">
                           <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Ledger ID: {farmer.id}</span>
                         </div>
                       </div>
                     </div>
                     <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                   </div>

                   <div className="mt-4 pt-4 border-t border-outline-variant/20 flex-grow">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Solana Wallet Hash</p>
                      <div className="font-mono text-xs text-primary bg-primary-container/10 p-3 rounded-lg break-all border border-primary/20 mb-4">
                        {farmer.wallet}
                      </div>
                      <Link to={`/profile/${farmer.id}`} className="block w-full text-center h-10 leading-10 bg-surface-container-high hover:bg-primary text-primary hover:text-on-primary rounded-lg font-bold transition-colors">
                        View Public Profile
                      </Link>
                   </div>
                 </article>
               ))
            )}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-[#c1c8c2]/20 bg-[#fbf9f6]">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-[1440px] mx-auto space-y-4 md:space-y-0">
          <div className="flex items-center gap-6">
            <span className="font-headline font-bold text-[#002d1c]">Cropblock</span>
            <span className="font-label text-sm uppercase tracking-wider text-[#002d1c]/50">© 2024 Cropblock Ledger. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FarmersPage;