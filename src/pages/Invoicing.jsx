import React, { useState, useEffect } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import FilterBar from '../components/FilterBar';

export default function Invoicing() {
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState({ gst_options: '0,5,12,18,28' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customer: '', contact: '', amount: 0, gstRate: '18', status: 'Due' });

  // Filter states
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchInvoicesAndSettings = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/invoices').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([invoicesData, settingsData]) => {
      if (invoicesData.message === 'success') setInvoices(invoicesData.data);
      if (settingsData.message === 'success' && settingsData.data) {
        setSettings(prev => ({ ...prev, ...settingsData.data }));
      }
      setLoading(false);
    });
  };

  useEffect(() => { fetchInvoicesAndSettings(); }, []);

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const gstPercent = parseFloat(formData.gstRate) || 0;
    const baseAmt = parseFloat(formData.amount) || 0;
    const totalWithGST = baseAmt + (baseAmt * (gstPercent / 100));
    const newInvoice = {
      id: `INV-50${Math.floor(Math.random() * 100)}`,
      customer: formData.customer,
      contact: formData.contact,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      total: totalWithGST.toFixed(2),
      status: formData.status
    };
    fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice)
    }).then(() => {
      setIsModalOpen(false);
      setFormData({ customer: '', contact: '', amount: 0, gstRate: '18', status: 'Due' });
      fetchInvoicesAndSettings();
    });
  };

  const handleMarkPaid = (id) => {
    fetch(`/api/invoices/${id}/pay`, { method: 'PUT' })
      .then(res => res.json())
      .then(data => { if (data.message === 'success') fetchInvoicesAndSettings(); });
  };

  const gstOptions = settings.gst_options ? settings.gst_options.split(',') : ['0', '5', '12', '18', '28'];
  const currentBase = parseFloat(formData.amount || 0);
  const currentGstRate = parseFloat(formData.gstRate || 0);
  const currentGstAmount = currentBase * (currentGstRate / 100);
  const currentTotal = currentBase + currentGstAmount;

  // Parse date string like "27 Apr 2026" → Date object for filtering
  const parseInvDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  };

  const filteredInvoices = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = (
      (inv.id || '').toLowerCase().includes(q) ||
      (inv.customer || '').toLowerCase().includes(q) ||
      (inv.contact || '').toLowerCase().includes(q) ||
      (inv.status || '').toLowerCase().includes(q)
    );
    const invDate = parseInvDate(inv.date);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    const matchFrom = !from || !invDate || invDate >= from;
    const matchTo = !to || !invDate || invDate <= to;
    return matchSearch && matchFrom && matchTo;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer Invoicing (Billing)</h1>
        <button className="btn-primary" style={{ backgroundColor: '#1e3a8a' }} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New GST Invoice
        </button>
      </div>

      <FilterBar search={search} setSearch={setSearch} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} />

      <div className="box">
        <div className="box-header">Recent Invoices <span style={{ fontSize: '13px', color: '#888', fontWeight: 'normal' }}>({filteredInvoices.length})</span></div>
        <div className="box-body">
          {loading ? <p>Loading Invoices...</p> : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Customer Name</th>
                    <th>Contact No</th>
                    <th>Date</th>
                    <th>Total (inc. GST)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td><b>{inv.id}</b></td>
                      <td>{inv.customer}</td>
                      <td>{inv.contact || '-'}</td>
                      <td>{inv.date}</td>
                      <td>₹ {parseFloat(inv.total).toLocaleString()}</td>
                      <td><span className={`badge ${inv.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{inv.status}</span></td>
                      <td>
                        {inv.status !== 'Paid' && (
                          <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => handleMarkPaid(inv.id)}>
                            <CheckCircle size={14} /> Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No invoices found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              Generate GST Invoice
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Customer Name</label>
                    <input type="text" className="form-control" required value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ flex: 1.5 }}>
                    <label>Contact No.</label>
                    <input type="text" className="form-control" placeholder="10-digit number" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Status</label>
                    <select className="form-control" required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Paid">Paid</option>
                      <option value="Due">Due</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Base Amount (₹)</label>
                    <input type="number" className="form-control" required min="0" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>GST Rate (%)</label>
                    <select className="form-control" required value={formData.gstRate} onChange={e => setFormData({ ...formData, gstRate: e.target.value })}>
                      {gstOptions.map(rate => (<option key={rate} value={rate.trim()}>{rate.trim()}%</option>))}
                    </select>
                  </div>
                </div>
                <div className="alert-panel" style={{ marginTop: '15px' }}>
                  <div className="alert-desc" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Base Amount:</span> <span>₹ {currentBase.toFixed(2)}</span></div>
                  <div className="alert-desc" style={{ display: 'flex', justifyContent: 'space-between' }}><span>GST ({currentGstRate}%):</span> <span>₹ {currentGstAmount.toFixed(2)}</span></div>
                  <hr style={{ margin: '5px 0', borderColor: '#ea580c' }} />
                  <div className="alert-title" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Amount:</span> <span>₹ {currentTotal.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-ai">Print &amp; Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
