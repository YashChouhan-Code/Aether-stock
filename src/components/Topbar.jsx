import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Search items, invoices, orders..." />
      </div>
      
      <div className="topbar-actions">
        <button className="icon-button">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar">A</div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Admin User</span>
        </div>
      </div>
    </header>
  );
}
