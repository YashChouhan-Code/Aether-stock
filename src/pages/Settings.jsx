import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    low_stock_threshold: '100',
    gst_options: '0,5,12,18,28',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success' && data.data) {
          setSettings(prev => ({ ...prev, ...data.data }));
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success') {
          if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
          } else {
            document.body.classList.remove('dark-theme');
          }
          alert('Settings saved successfully!');
        }
      });
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="box">
        <div className="box-header">System Configuration</div>
        <div className="box-body">
          <form onSubmit={handleSave} style={{ maxWidth: '500px' }}>
            <div className="form-group">
              <label>Low Stock Warning Threshold (Quantity)</label>
              <input 
                type="number" 
                className="form-control" 
                name="low_stock_threshold" 
                value={settings.low_stock_threshold} 
                onChange={handleChange} 
                required 
                min="1" 
              />
              <small style={{ color: '#666' }}>Items below this quantity will be marked as "Low Stock" (Warning Color).</small>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>GST Percentages Options (Comma separated)</label>
              <input 
                type="text" 
                className="form-control" 
                name="gst_options" 
                value={settings.gst_options} 
                onChange={handleChange} 
                required 
                placeholder="0,5,12,18,28" 
              />
              <small style={{ color: '#666' }}>These options will appear in the GST dropdown when adding/editing an item.</small>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Application Theme</label>
              <select 
                className="form-control" 
                name="theme" 
                value={settings.theme || 'light'} 
                onChange={handleChange}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
              <Save size={16} /> Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
