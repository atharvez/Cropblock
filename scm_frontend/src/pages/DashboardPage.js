import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total_farmers: 0,
        total_volume_sold: 0,
        total_value_traded: 0,
        active_supply: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, transRes] = await Promise.all([
                    axios.get(`${API}/api/dashboard/stats`),
                    axios.get(`${API}/api/dashboard/transactions`)
                ]);
                setStats(statsRes.data);
                setTransactions(transRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const Navbar = () => (
        <nav className="fixed top-0 w-full z-50 glass-header shadow-sm bg-white/80 backdrop-blur-md">
            <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</span>
                    <div className="hidden md:flex items-center gap-6 font-headline tracking-wide font-medium">
                        <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/">Home</Link>
                        <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/farmers">Farmers</Link>
                        <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/dashboard">Dashboard</Link>
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
                <main className="flex-grow flex items-center justify-center pt-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-[1440px] mx-auto min-h-screen w-full">
                <header className="mb-12">
                    <h1 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-4 text-[#002d1c]">System Dashboard</h1>
                    <p className="text-on-surface-variant max-w-2xl text-xl text-[#002d1c]/60">Real-time aggregate metrics and blockchain transaction history from across the supply chain.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <span className="material-symbols-outlined text-3xl">groups</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#002d1c]/40 mb-2">Total Farmers</p>
                        <h3 className="text-4xl font-black text-[#002d1c] font-headline">{stats.total_farmers}</h3>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                            <span className="material-symbols-outlined text-3xl">inventory_2</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#002d1c]/40 mb-2">Active Supply</p>
                        <h3 className="text-4xl font-black text-[#002d1c] font-headline">{stats.active_supply.toLocaleString()}kg</h3>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <span className="material-symbols-outlined text-3xl">local_shipping</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#002d1c]/40 mb-2">Volume Sold</p>
                        <h3 className="text-4xl font-black text-[#002d1c] font-headline">{stats.total_volume_sold.toLocaleString()}kg</h3>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                            <span className="material-symbols-outlined text-3xl">payments</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#002d1c]/40 mb-2">Total Value</p>
                        <h3 className="text-4xl font-black text-[#002d1c] font-headline">₹{stats.total_value_traded.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-outline-variant/20 shadow-[0_8px_24px_rgba(27,28,26,0.06)] overflow-hidden">
                    <div className="px-10 py-8 border-b border-outline-variant/10 flex justify-between items-center bg-[#fbf9f6]/30">
                        <h2 className="font-headline text-2xl font-bold text-[#002d1c] flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                            Transaction Ledger
                        </h2>
                        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest leading-none">
                            Immutable Record
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#fbf9f6]/50">
                                    <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#002d1c]/40 border-b border-outline-variant/10">ID</th>
                                    <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#002d1c]/40 border-b border-outline-variant/10">Farmer</th>
                                    <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#002d1c]/40 border-b border-outline-variant/10">Crop</th>
                                    <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#002d1c]/40 border-b border-outline-variant/10 text-right">Weight</th>
                                    <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#002d1c]/40 border-b border-outline-variant/10 text-right">Price</th>
                                    <th className="px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#002d1c]/40 border-b border-outline-variant/10 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="material-symbols-outlined text-5xl text-[#002d1c]/10 mb-4">history</span>
                                                <p className="text-[#002d1c]/30 font-medium">No transactions recorded on the ledger yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-[#fbf9f6]/30 transition-colors group">
                                            <td className="px-10 py-6 border-b border-outline-variant/5 text-sm font-mono text-[#002d1c]/40">#{tx.id}</td>
                                            <td className="px-10 py-6 border-b border-outline-variant/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                                                        {tx.farmer_name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-[#002d1c]">{tx.farmer_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 border-b border-outline-variant/5">
                                                <span className="px-3 py-1 rounded-full bg-secondary/5 text-secondary text-xs font-bold border border-secondary/10 uppercase tracking-widest">
                                                    {tx.crop}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 border-b border-outline-variant/5 text-right font-medium text-[#002d1c]">{tx.weight} kg</td>
                                            <td className="px-10 py-6 border-b border-outline-variant/5 text-right text-[#002d1c]/60">₹{tx.price}/kg</td>
                                            <td className="px-10 py-6 border-b border-outline-variant/5 text-right font-black text-primary">₹{tx.total_value.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardPage;
