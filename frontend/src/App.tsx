import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { HomePage } from './pages/HomePage';
import { WizardPage } from './pages/WizardPage';
import { SchemesPage } from './pages/SchemesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { StatesPage } from './pages/StatesPage';
import { MinistriesPage } from './pages/MinistriesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { ChatPage } from './pages/ChatPage';
import { DigiLockerCallback } from './pages/DigiLockerCallback';
import { CscPage } from './pages/CscPage';
import { AboutPage } from './pages/AboutPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-setu-bg text-slate-900 selection:bg-setu-saffron selection:text-white">
      {/* 1. Top Header with Emblem */}
      <Header />

      {/* 2. Sticky Navigation Bar */}
      <Navbar />

      {/* 3. Main Content Area */}
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find" element={<WizardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/schemes/:id" element={<SchemeDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/digilocker/callback" element={<DigiLockerCallback />} />
          <Route path="/csc" element={<CscPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      {/* 4. Official Government Footer */}
      <Footer />

      {/* 5. Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
