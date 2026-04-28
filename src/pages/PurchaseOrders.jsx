import React, { useState, useEffect } from 'react';
import { Plus, BrainCircuit, X } from 'lucide-react';
import FilterBar from '../components/FilterBar';

export default function PurchaseOrders() {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ supplier: '', amount: '' });
  const [search, setSearch] = useState('');

  const fetchPOs = () => {
    setLoading(true);
    fetch('/api/purchase-orders')
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success') setPos(data.data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchPOs(); }, []);

  const handleGenAIPO = () => {
    const aiVendor = ["MedLife Agency", "CarePharma Suppliers", "Global Medical"][Math.floor(Math.random() * 3)];
    const aiAmount = Math.floor(Math.random() * 50000) + 5000;
    const newPO = {
      id: `PO-AI-${Math.floor(Math.random() * 10000)}`,
      supplier: aiVendor,
      type: 'AI Generated',
      amount: aiAmount,
      status: 'Pending'
    };

    fetch('/api/purchase-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPO)
    }).then(() => fetchPOs());
  };

  const handleManualPO = (e) => {
    e.preventDefault();
    const newPO = {
      id: `PO-M-${Math.floor(Math.random() * 10000)}`,
      supplier: formData.supplier,
      type: 'Manual',
      amount: parseFloat(formData.amount),
      status: 'Pending'
    };

    fetch('/api/purchase-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPO)
    }).then(() => {
      setIsModalOpen(false);
      setFormData({ supplier: '', amount: '' });
      fetchPOs();
    });
  };

  const handleApprovePO = (id) => {
    fetch(`/api/purchase-orders/${id}/approve`, { method: 'PUT' })
      .then(() => fetchPOs());
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Automated Purchasing & Vendors</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Manual P.O.
          </button>
          <button className="btn-ai" onClick={handleGenAIPO}>
            <BrainCircuit size={16} /> GenAI Auto-Generate POs
          </button>
        </div>
      </div>

      <FilterBar search={search} setSearch={setSearch} showDateFilter={false} />

      <div className="box">
        <div className="box-header">Recent Purchase Orders</div>
        <div className="box-body">
          {loading ? <p>Loading POs...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier/Agency</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pos.filter(po => {
                  const q = search.toLowerCase();
                  return (
                    (po.id || '').toLowerCase().includes(q) ||
                    (po.supplier || '').toLowerCase().includes(q) ||
                    (po.type || '').toLowerCase().includes(q) ||
                    (po.status || '').toLowerCase().includes(q)
                  );
                }).map(po => (
                  <tr key={po.id}>
                    <td><b>{po.id}</b></td>
                    <td>{po.supplier}</td>
                    <td><span className={po.type === 'AI Generated' ? "badge badge-ai" : "badge badge-warning"}>{po.type}</span></td>
                    <td>₹ {po.amount.toLocaleString()}</td>
                    <td><span className={`badge ${po.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{po.status}</span></td>
                    <td>
                      {po.status === 'Pending' && (
                        <button className="btn-primary" style={{padding: '4px 8px', fontSize: '12px'}} onClick={() => handleApprovePO(po.id)}>Approve</button>
                      )}
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
              Create Manual P.O.
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleManualPO}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input type="text" className="form-control" required 
                    value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Total Amount (₹)</label>
                  <input type="number" className="form-control" required min="0"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
