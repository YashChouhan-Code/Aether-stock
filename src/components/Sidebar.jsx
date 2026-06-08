import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart,
  FileText, Users, BarChart3, Settings, LogOut, X
} from 'lucide-react';


const navItems = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/items', icon: <Package size={18} />, label: 'Inventory' },
  { to: '/purchase', icon: <ShoppingCart size={18} />, label: 'Purchase' },
  { to: '/invoicing', icon: <FileText size={18} />, label: 'Invoicing' },
  { to: '/agencies', icon: <Users size={18} />, label: 'Agencies' },
  { to: '/reports', icon: <BarChart3 size={18} />, label: 'Reporting' },
  { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Close button for mobile */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
        <X size={18} />
      </button>

      {/* Logo */}
      <div style={{
        padding: '24px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        textAlign: 'center'
      }}>

        <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
          Aether<span style={{ color: '#f36c21' }}>Stock</span>
        </div>
        {/* <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
       Inventory
        </div> */}
      </div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar" style={{ background: 'linear-gradient(135deg, #f36c21, #d95316)' }}>A</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Admin User</div>
          <div className="sidebar-user-email">admin@yash.com</div>
        </div>
      </div>

      {/* Navigation */}
      <ul className="nav-menu">
        {navItems.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div style={{ padding: '12px' }}>
        <a href="#" className="nav-item" style={{ color: '#ef9a9a' }} onClick={onClose}>
          <LogOut size={18} />
          <span>Logout</span>
        </a>
      </div>

    </aside>
  );
}

