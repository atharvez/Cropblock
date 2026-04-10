import React from 'react';
import { Link } from 'react-router-dom';

const VendorsPage = () => {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f6]/80 dark:bg-[#002d1c]/80 backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-200">
        <nav className="flex justify-between items-center h-20 px-8 max-w-[1440px] mx-auto">
          <div className="text-2xl font-bold tracking-tight text-[#002d1c] dark:text-[#fbf9f6]">Cropblock</div>
          <div className="hidden md:flex items-center gap-8 font-['Manrope'] tracking-wide font-medium">
            <Link className="text-[#002d1c]/60 dark:text-[#fbf9f6]/60 hover:text-[#002d1c] dark:hover:text-[#fbf9f6] transition-colors" to="/">Home</Link>
            <Link className="text-[#002d1c]/60 dark:text-[#fbf9f6]/60 hover:text-[#002d1c] dark:hover:text-[#fbf9f6] transition-colors" to="/farmers">Farmers</Link>
            <Link className="text-[#002d1c]/60 dark:text-[#fbf9f6]/60 hover:text-[#002d1c] dark:hover:text-[#fbf9f6] transition-colors" to="/yields/submit">Yields</Link>
            <Link className="text-[#002d1c]/60 dark:text-[#fbf9f6]/60 hover:text-[#002d1c] dark:hover:text-[#fbf9f6] transition-colors" to="/sell">Sell</Link>
            <Link className="text-[#002d1c] dark:text-white border-b-2 border-[#002d1c] dark:border-[#fbf9f6] pb-1" to="/vendors">Vendors</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#002d1c] dark:text-[#fbf9f6] hover:bg-[#fbf9f6] dark:hover:bg-[#00452e] rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#002d1c] dark:text-[#fbf9f6] hover:bg-[#fbf9f6] dark:hover:bg-[#00452e] rounded-full transition-all active:scale-95">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden active:scale-95 transition-transform cursor-pointer">
              <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTNCeuM47Rj63dx4CyxZBRov1V5N32DapTLIt9bzDCVgWKi7-ORXFdtnVE6iJFR1p7zDXDW4BIoI3tUt54kTSShVC3Rmf6B3GymAs_sSPeUpt17rOpQtYaH8SplY84GSVmOeosJB2BwoGmZjbc6XqIGHQM8wXAxCy-ZHS3TYyfqrDrRziUhC7cD7FyEjcD3oBqVi0Azl9xf2EFj6Xy7DzJtGWnBDjUkb6Rvyo_Lc7dgA09xnzSq0NCssAtTTaswlV_Jd7R3So95gI1" />
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Verified Vendors</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg mb-10">Discover and connect with top-rated agricultural buyers and logistical partners globally, secured by Cropblock Ledger.</p>
          
          <div className="bg-surface-container-high rounded-xl p-6 md:p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full flex-grow">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full h-14 pl-12 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface font-body" placeholder="Search by vendor name or location..." type="text" />
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
              <div className="relative min-w-[160px] flex-grow md:flex-grow-0">
                <select className="w-full h-14 pl-4 pr-10 bg-surface-container-lowest border-none rounded-lg appearance-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body cursor-pointer">
                  <option>Crop Type</option>
                  <option>Wheat</option>
                  <option>Maize</option>
                  <option>Soybeans</option>
                  <option>Coffee</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
              <div className="relative min-w-[160px] flex-grow md:flex-grow-0">
                <select className="w-full h-14 pl-4 pr-10 bg-surface-container-lowest border-none rounded-lg appearance-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body cursor-pointer">
                  <option>Price Range</option>
                  <option>$0 - $5/kg</option>
                  <option>$5 - $15/kg</option>
                  <option>$15+</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
              <div className="relative min-w-[160px] flex-grow md:flex-grow-0">
                <select className="w-full h-14 pl-4 pr-10 bg-surface-container-lowest border-none rounded-lg appearance-none focus:ring-2 focus:ring-primary/20 text-on-surface font-body cursor-pointer">
                  <option>Location</option>
                  <option>Within 50km</option>
                  <option>Regional</option>
                  <option>International</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
              <button className="h-14 px-8 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">tune</span> Apply
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="bg-surface-container-lowest rounded-xl overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img alt="Vendor Facility" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW-O9HmbXt8yGjkc8LyuaEhPh_i4hJcFBe5tqgAjU2HkITS-UBN51yj6Tk2Gla46R7qTxDLMR_RoDAurc26WnWfM4PNl4ajAnSp2ubBBQZTWoU2VIC_Qwau3ob5bwuOO4yigtwmJcjuFM8UxNf1qQRdi2kObO5jWBq09IW6lA-ZofHxqCWMg5cvgdTHb2xUVM0g9tdOEzF1fFQ8Y89Uj8gWLgJw3yBxNbNrRA33HG1zIolp1m4jLTo9z3DNk8i307weS1KWmFFIdz1" />
              <div className="absolute top-4 left-4 bg-primary/90 text-on-primary px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span> Verified
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Grains & Cereals Vendor</div>
                  <h3 className="text-xl font-bold text-primary mb-1">Terra-Green Hubs</h3>
                  <div className="flex items-center text-on-surface-variant text-sm gap-1">
                    <span className="material-symbols-outlined text-base">location_on</span> Nairobi, Kenya (12.4 km)
                  </div>
                </div>
                <div className="bg-surface-container-high px-2 py-1 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-base" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="font-bold text-primary">4.9</span>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Offered Price</p>
                    <p className="text-2xl font-bold text-secondary">$1.85<span className="text-sm font-normal text-on-surface-variant">/kg</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Capacity</p>
                    <p className="font-medium text-primary">500 Tons</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-12 border border-outline-variant/30 text-primary rounded-lg font-semibold hover:bg-surface-container transition-all active:scale-95">View Details</button>
                  <Link to="/sell" className="h-12 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center">Connect</Link>
                </div>
              </div>
            </div>
          </article>

          <article className="bg-surface-container-lowest rounded-xl overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img alt="Vendor Facility" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTM_4IOqgeefTFlrrvghpapW_M175spGe6Wp6Xx4SXHntPv6AcQ5zgp1-wTyvRciwjwE47--InUaSxmKVePYDZQKOTYjZXQ9DQFFO6ZKTrX5Etd5GbTv8eFpKYXEPNTrwYq1kjQyqOiHXIwIZicH22mYATV-9oTz9ilxUst-3s3lIWpT0Vs4UxwDFWettwotWqDnLHbDi6XrgK4bpBn12WYRqLK1qF3jlBhsu4VO50mp-5vW5dOvAo-aFHfEBQYryZFCntFnAJfbKr" />
              <div className="absolute top-4 left-4 bg-primary/90 text-on-primary px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span> Verified
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Fruits & Orchard Vendor</div>
                  <h3 className="text-xl font-bold text-primary mb-1">Global Harvest Co.</h3>
                  <div className="flex items-center text-on-surface-variant text-sm gap-1">
                    <span className="material-symbols-outlined text-base">location_on</span> Nakuru, Kenya (85 km)
                  </div>
                </div>
                <div className="bg-surface-container-high px-2 py-1 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-base" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="font-bold text-primary">4.7</span>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Offered Price</p>
                    <p className="text-2xl font-bold text-secondary">$1.72<span className="text-sm font-normal text-on-surface-variant">/kg</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Capacity</p>
                    <p className="font-medium text-primary">1.2k Tons</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-12 border border-outline-variant/30 text-primary rounded-lg font-semibold hover:bg-surface-container transition-all active:scale-95">View Details</button>
                  <Link to="/sell" className="h-12 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center">Connect</Link>
                </div>
              </div>
            </div>
          </article>

          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">add_business</span>
            <h3 className="text-lg font-bold text-primary mb-2">Be part of the chain</h3>
            <p className="text-on-surface-variant text-sm max-w-[200px] mb-6">Are you a buyer or supplier? Register to join our verified network.</p>
            <button className="text-secondary font-bold hover:underline">Apply for Verification</button>
          </div>
        </div>

        <div className="mt-16 flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-primary transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-primary font-semibold transition-colors">2</button>
          <span className="text-on-surface-variant px-2">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-primary transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      <footer className="w-full border-t border-[#c1c8c2]/20 bg-[#fbf9f6] dark:bg-[#002d1c]">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-[1440px] mx-auto space-y-4 md:space-y-0">
          <div className="font-['Manrope'] font-bold text-[#002d1c] dark:text-[#fbf9f6]">Cropblock</div>
          <div className="flex flex-wrap justify-center gap-6 font-['Public_Sans'] text-sm uppercase tracking-wider">
            <Link className="text-[#002d1c]/50 dark:text-[#fbf9f6]/50 hover:text-[#884f42] dark:hover:text-[#884f42] transition-colors" to="#">Privacy Policy</Link>
            <Link className="text-[#002d1c]/50 dark:text-[#fbf9f6]/50 hover:text-[#884f42] dark:hover:text-[#884f42] transition-colors" to="#">Terms of Service</Link>
          </div>
          <div className="text-[#002d1c]/50 dark:text-[#fbf9f6]/50 text-xs font-label uppercase tracking-widest">
            © 2024 Cropblock Ledger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VendorsPage;