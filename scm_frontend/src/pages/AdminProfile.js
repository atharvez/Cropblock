import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
  const [farmers, setFarmers] = useState([]);
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const farmersRes = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/farmers`);
        setFarmers(farmersRes.data);
        
        const yieldsRes = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5001"}/api/yields`);
        setYields(yieldsRes.data);
      } catch (err) {
        console.error("Failed to fetch ledger analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalYieldsCalculated = yields.reduce((acc, y) => acc + parseFloat(y.weight), 0);
  const totalSystemValue = yields.reduce((acc, y) => acc + (parseFloat(y.weight) * parseFloat(y.price)), 0);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen pb-24">
      <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-error font-headline">Cropblock Administrator</div>
          <div className="hidden md:flex items-center space-x-8 font-headline tracking-wide font-medium">
            <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/admin">Global Ledger</Link>
            <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Exit to Home</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-[1440px] mx-auto space-y-8">
        
        <header>
          <h1 className="text-4xl font-extrabold font-headline text-primary mb-2">Network Oversight</h1>
          <p className="text-on-surface-variant font-medium">Read-only global analytics of the decentralized supply chain.</p>
        </header>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low rounded-2xl p-6 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Registered Entities</p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-extrabold font-headline text-primary">{farmers.length} <span className="text-lg font-medium opacity-60">Farmers</span></h2>
              <span className="material-symbols-outlined text-4xl text-primary opacity-20">group</span>
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-2xl p-6 border-l-4 border-secondary shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Global Yield Mass</p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-extrabold font-headline text-secondary">{totalYieldsCalculated.toFixed(1)} <span className="text-lg font-medium opacity-60">kg</span></h2>
              <span className="material-symbols-outlined text-4xl text-secondary opacity-20">scale</span>
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-2xl p-6 border-l-4 border-[#1abc9c] shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">System Asset Value</p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-extrabold font-headline text-[#1abc9c]">₹{totalSystemValue.toFixed(2)}</h2>
              <span className="material-symbols-outlined text-4xl text-[#1abc9c] opacity-20">account_balance</span>
            </div>
          </div>
        </div>

        {/* Global Databases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Farmers Table */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 bg-surface-container-low/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-bold font-headline text-lg">Blockchain Identities</h3>
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{farmers.length} Nodes</span>
            </div>
            <div className="overflow-y-auto flex-grow p-0">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-container sticky top-0 z-10 text-xs uppercase text-on-surface-variant font-bold tracking-wider">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Focus</th>
                    <th className="p-4">Wallet Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {farmers.map(f => (
                    <tr key={f.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-primary">{f.id}</td>
                      <td className="p-4 font-bold">{f.name}</td>
                      <td className="p-4">
                        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                          {f.crop_type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-on-surface-variant max-w-[150px] truncate">{f.wallet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {farmers.length === 0 && <div className="p-8 text-center text-on-surface-variant">No farmers registered on the network.</div>}
            </div>
          </section>

          {/* Yields Table */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-[500px]">
             <div className="p-6 bg-surface-container-low/50 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="font-bold font-headline text-lg">Global Crop Declarations</h3>
              <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full">{yields.length} Assets</span>
            </div>
            <div className="overflow-y-auto flex-grow p-0">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-container sticky top-0 z-10 text-xs uppercase text-on-surface-variant font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Farmer</th>
                    <th className="p-4">Crop</th>
                    <th className="p-4 text-right">Mass</th>
                    <th className="p-4 text-right">Value/kg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {yields.map(y => (
                    <tr key={y.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4 font-bold text-primary">{y.farmer_name}</td>
                      <td className="p-4 font-medium">{y.crop}</td>
                      <td className="p-4 font-mono text-right">{y.weight}kg</td>
                      <td className="p-4 font-mono text-right text-secondary">₹{y.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {yields.length === 0 && <div className="p-8 text-center text-on-surface-variant">No crops have been submitted to the ledger.</div>}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
