import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';


import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ItemMaster from './pages/ItemMaster';
import PurchaseOrders from './pages/PurchaseOrders';
import Invoicing from './pages/Invoicing';
import Agencies from './pages/Agencies';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success' && data.data) {
          const dark = data.data.theme === 'dark';
          setIsDark(dark);
          if (dark) document.body.classList.add('dark-theme');
          else document.body.classList.remove('dark-theme');
        }
      }).catch(() => {});
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newDark ? 'dark' : 'light' })
    }).catch(() => {});
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Sidebar (left) */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Backdrop overlay on mobile */}
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main area (right: header + content) */}
        <div className="main-area">
          {/* Top Header */}
          <header className="main-header">
            {/* Hamburger menu for mobile */}
            <button className="mobile-toggle-btn" onClick={() => setIsSidebarOpen(true)} title="Open Menu">
              <Menu size={20} />
            </button>

            <div className="header-welcome">
              Welcome, <span style={{ color: 'var(--accent-teal)' }}>Admin</span> 👋
            </div>


            {/* Search */}
            <div className="header-search">
              <Search size={16} color="var(--text-muted)" />
              <input type="text" placeholder="Search..." />
            </div>

            <div className="header-actions">
              {/* Theme toggle */}
              <button className="header-icon-btn" onClick={toggleTheme} title="Toggle Theme">
                {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
              </button>
              {/* Bell */}
              <button className="header-icon-btn">
                <Bell size={18} />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/items" element={<ItemMaster />} />
              <Route path="/purchase" element={<PurchaseOrders />} />
              <Route path="/invoicing" element={<Invoicing />} />
              <Route path="/agencies" element={<Agencies />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
