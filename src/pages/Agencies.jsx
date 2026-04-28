import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import FilterBar from '../components/FilterBar';

export default function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', performance_score: 100 });
  const [search, setSearch] = useState('');

  const fetchAgencies = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/agencies')
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success') setAgencies(data.data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchAgencies(); }, []);

  const handleAddAgency = (e) => {
    e.preventDefault();
    const newAgency = {
      id: `V-00${Math.floor(Math.random() * 100) + 10}`,
      name: formData.name,
      contact: formData.contact,
      performance_score: formData.performance_score
    };

    fetch('http://localhost:5000/api/agencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgency)
    }).then(() => {
      setIsModalOpen(false);
      setFormData({ name: '', contact: '', performance_score: 100 });
      fetchAgencies();
    });
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Agencies & Suppliers</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add New Vendor
        </button>
      </div>

      <FilterBar search={search} setSearch={setSearch} showDateFilter={false} />

      <div className="box">
        <div className="box-header">Registered Agencies</div>
        <div className="box-body">
          {loading ? <p>Loading Agencies...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Agency Name</th>
                  <th>Contact Info</th>
                  <th>AI Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {agencies.filter(agency => {
                  const q = search.toLowerCase();
                  return (
                    (agency.id || '').toLowerCase().includes(q) ||
                    (agency.name || '').toLowerCase().includes(q) ||
                    (agency.contact || '').toLowerCase().includes(q)
                  );
                }).map(agency => (
                  <tr key={agency.id}>
                    <td><b>{agency.id}</b></td>
                    <td>{agency.name}</td>
                    <td>{agency.contact}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <div style={{background: '#eee', height: '8px', width: '100px', borderRadius: '4px'}}>
                          <div style={{background: agency.performance_score > 90 ? '#10b981' : '#f59e0b', height: '100%', width: `${agency.performance_score}%`, borderRadius: '4px'}}></div>
                        </div>
                        <span style={{fontSize: '12px', fontWeight: 'bold'}}>{agency.performance_score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              Add New Vendor
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAgency}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Agency Name</label>
                  <input type="text" className="form-control" required 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contact Details</label>
                  <input type="text" className="form-control" required
                    value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Register Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
