import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-header shadow-sm">
        <div className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tight text-[#002d1c] font-headline">Cropblock</span>
            <div className="hidden md:flex items-center gap-6 font-headline tracking-wide font-medium">
              <Link className="text-[#002d1c] border-b-2 border-[#002d1c] pb-1" to="/">Home</Link>
              <Link className="text-[#002d1c]/60 hover:text-[#002d1c] transition-colors" to="/farmers">Farmers</Link>
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

      <main className="pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl text-center mb-16">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-primary tracking-tight mb-6">Decentralized Supply Chain</h1>
          <p className="text-on-surface-variant text-xl leading-relaxed max-w-2xl mx-auto">Empowering farmers with immutable transparent ledgers and smart contract payments on the Solana Blockchain.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          <Link to="/farmers/register" className="group p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container transition-all hover:shadow-[0_8px_24px_rgba(0,45,28,0.08)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">how_to_reg</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-primary mb-2">Register Farmer</h3>
            <p className="text-sm text-on-surface-variant">Secure your decentralized identity on the ledger.</p>
          </Link>

          <Link to="/yields/submit" className="group p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 hover:border-secondary/50 hover:bg-surface-container transition-all hover:shadow-[0_8px_24px_rgba(136,79,66,0.08)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">eco</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-primary mb-2">Submit Yield</h3>
            <p className="text-sm text-on-surface-variant">Record cryptographic provenance for your crops.</p>
          </Link>

          <Link to="/sell" className="group p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container transition-all hover:shadow-[0_8px_24px_rgba(0,45,28,0.08)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-primary mb-2">Sell Dashboard</h3>
            <p className="text-sm text-on-surface-variant">Execute zero-trust smart contract sales instantly.</p>
          </Link>

          <Link to="/vendors" className="group p-8 bg-surface-container-low rounded-2xl border border-outline-variant/20 hover:border-secondary/50 hover:bg-surface-container transition-all hover:shadow-[0_8px_24px_rgba(136,79,66,0.08)] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">handshake</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-primary mb-2">Find Vendors</h3>
            <p className="text-sm text-on-surface-variant">Connect with audited international buyers.</p>
          </Link>
        </div>
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

export default HomePage;