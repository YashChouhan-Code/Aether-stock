import React from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function Reports() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Predictive AI Reports</h1>
      </div>

      <div className="stats-row">
        <div className="info-box">
          <span className="info-box-icon bg-blue"><TrendingUp size={32} /></span>
          <div className="info-box-content">
            <span className="info-box-text">Demand Forecast</span>
            <span className="info-box-number">High (Next 30 Days)</span>
          </div>
        </div>
        <div className="info-box">
          <span className="info-box-icon bg-orange"><DollarSign size={32} /></span>
          <div className="info-box-content">
            <span className="info-box-text">Capital Optimized</span>
            <span className="info-box-number">₹ 2,45,000</span>
          </div>
        </div>
      </div>

      <div className="box box-ai">
        <div className="box-header">Sales vs Procurement Timeline (GenAI Insights)</div>
        <div className="box-body" style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <BarChart3 size={64} color="#ccc" />
          <p style={{color: '#777', marginTop: '15px'}}>AI Predictive chart rendering module initialized. (Data sync in progress...)</p>
          <p style={{color: 'var(--accent-orange)', fontWeight: 'bold', fontSize: '14px'}}>System Note: Overstocking reduced by 22% compared to last quarter.</p>
        </div>
      </div>
    </div>
  );
}
