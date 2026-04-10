import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page imports
import HomePage from './pages/HomePage';
import FarmersPage from './pages/FarmersPage';
import YieldsPage from './pages/YieldsPage';
import SellPage from './pages/SellPage'; 
import VendorsPage from "./pages/VendorsPage";
import AdminProfile from "./pages/AdminProfile";
import FarmerProfile from "./pages/FarmerProfile";

// Component imports
import FarmersList from './components/FarmerList';
import YieldsList from './components/YieldList';
import YieldSubmission from './components/YieldSubmission';
import SellCrop from './components/SellCrops'; 
import SellStockList from './components/SellStockList'; 
import FarmerRegistration from './components/FarmerRegistration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/farmers" element={<FarmersPage />} />
      <Route path="/farmers/list" element={<FarmersList />} />
      <Route path="/yields" element={<YieldsPage />} />
      <Route path="/yields/list" element={<YieldsList />} />
      <Route path="/yields/submit" element={<YieldSubmission />} />
      <Route path="/farmers/register" element={<FarmerRegistration />} />
      <Route path="/sell" element={<SellPage />} /> 
      <Route path="/sell/submit" element={<SellCrop />} /> 
      <Route path="/sell/stocks/:farmerId" element={<SellStockList />} /> 
      <Route path="/vendors" element={<VendorsPage />} />
      <Route path="/admin" element={<AdminProfile />} />
      <Route path="/profile/:id" element={<FarmerProfile />} />
    </Routes>
  );
}

export default App;