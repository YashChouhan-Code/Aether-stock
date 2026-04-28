import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import FilterBar from '../components/FilterBar';

export default function ItemMaster() {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ low_stock_threshold: '100', gst_options: '0,5,12,18,28' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', category: '', stock: 0, unit: '', status: 'Active', gst: 0 });

  // Filter states
  const [search, setSearch] = useState('');

  const fetchItemsAndSettings = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/items').then(res => res.json()),
      fetch('http://localhost:5000/api/settings').then(res => res.json())
    ]).then(([itemsData, settingsData]) => {
      if (itemsData.message === 'success') setItems(itemsData.data);
      if (settingsData.message === 'success' && settingsData.data) {
        setSettings(prev => ({ ...prev, ...settingsData.data }));
      }
      setLoading(false);
    });
  };

  useEffect(() => { fetchItemsAndSettings(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'id' && !isEditMode) {
        const existingItem = items.find(item => item.id.toLowerCase() === value.toLowerCase());
        if (existingItem) return { ...existingItem };
      }
      return newData;
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const existingItem = items.find(item => item.id.toLowerCase() === formData.id.toLowerCase());
    const method = (isEditMode || existingItem) ? 'PUT' : 'POST';
    const url = (isEditMode || existingItem) ? `http://localhost:5000/api/items/${formData.id}` : 'http://localhost:5000/api/items';
    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      .then(res => res.json())
      .then(data => { if (data.message === 'success') { closeModal(); fetchItemsAndSettings(); } });
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => { if (data.message === 'success') fetchItemsAndSettings(); });
    }
  };

  const openEditModal = (item) => { setFormData(item); setIsEditMode(true); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setIsEditMode(false); setFormData({ id: '', name: '', category: '', stock: 0, unit: '', status: 'Active', gst: 0 }); };

  const getStatusDisplay = (item) => {
    if (item.status === 'Inactive') return { text: 'Inactive', color: 'badge-secondary' };
    const threshold = parseInt(settings.low_stock_threshold) || 100;
    if (item.stock === 0) return { text: 'Out of Stock', color: 'badge-danger' };
    if (item.stock < threshold) return { text: 'Low Stock', color: 'badge-warning' };
    return { text: 'In Stock', color: 'badge-success' };
  };

  // Filtered items
  const filteredItems = items.filter(item => {
    const q = search.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.unit || '').toLowerCase().includes(q) ||
      (item.status || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Item Master</h1>
        <button className="btn-primary" onClick={() => { setIsEditMode(false); setIsModalOpen(true); }}>
          <span>+</span> Add New Item
        </button>
      </div>

      <FilterBar search={search} setSearch={setSearch} showDateFilter={false} />

      <div className="box">
        <div className="box-header">Inventory List <span style={{ fontSize: '13px', color: '#888', fontWeight: 'normal' }}>({filteredItems.length} items)</span></div>
        <div className="box-body">
          {loading ? <p>Loading items...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Stock Level</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const statusInfo = getStatusDisplay(item);
                  return (
                    <tr key={item.id}>
                      <td><b>{item.id}</b></td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock}</td>
                      <td>{item.unit}</td>
                      <td><span className={`badge ${statusInfo.color}`}>{statusInfo.text}</span></td>
                      <td>
                        <button style={{ background: 'transparent', border: 'none', color: '#337ab7', marginRight: '10px', cursor: 'pointer' }} onClick={() => openEditModal(item)}><Edit size={16} /></button>
                        <button style={{ background: 'transparent', border: 'none', color: '#dd4b39', cursor: 'pointer' }} onClick={() => handleDeleteItem(item.id)}><Trash size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No items found.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              {isEditMode ? 'Edit Item' : 'Add New Item'}
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Item Code</label>
                  <input type="text" className="form-control" name="id" value={formData.id} onChange={handleInputChange} required disabled={isEditMode} placeholder="e.g. ITM-001" />
                  {!isEditMode && <small style={{ color: '#666' }}>Enter an existing code to auto-fill its details.</small>}
                </div>
                <div className="form-group">
                  <label>Item Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Category</label>
                    <select className="form-control" name="category" value={formData.category} onChange={handleInputChange} required>
                      <option value="">Select...</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Hygiene">Hygiene</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Stock</label>
                    <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Unit</label>
                    <select className="form-control" name="unit" value={formData.unit} onChange={handleInputChange} required>
                      <option value="">Select...</option>
                      <option value="Strips">Strips</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Bottles">Bottles</option>
                      <option value="Pieces">Pieces</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Status</label>
                    <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{isEditMode ? 'Update Item' : 'Save Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
