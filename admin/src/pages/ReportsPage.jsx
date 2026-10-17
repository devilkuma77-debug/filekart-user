import React from 'react';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';

export default function ReportsPage() {
  const exportCSV = (type) => {
    const csvContent = "data:text/csv;charset=utf-8,Order ID,Customer,Total,Status\nOD101,Aarav Kumar,65999,Delivered\nOD102,Priya Sharma,26990,Shipped";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flipkart_${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Reports & Business Intelligence Analytics</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Download Excel/CSV reports for accounting, GST filings, and product performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FileSpreadsheet size={20} color="#16a34a" />
            <strong style={{ fontSize: '15px' }}>Sales & Revenue Report</strong>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>Gross merchandise value (GMV), net revenues, and payment gateway splits</p>
          <button className="btn-secondary" onClick={() => exportCSV('sales')} style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FileSpreadsheet size={20} color="#2563eb" />
            <strong style={{ fontSize: '15px' }}>GST & Tax Summary</strong>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>CGST, SGST, IGST calculations per product HSN code for monthly filing</p>
          <button className="btn-secondary" onClick={() => exportCSV('tax')} style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={14} /> Export Tax Sheet
          </button>
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FileSpreadsheet size={20} color="#d97706" />
            <strong style={{ fontSize: '15px' }}>Product Performance</strong>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>Top viewed, added to cart ratios, conversion rates, and return frequencies</p>
          <button className="btn-secondary" onClick={() => exportCSV('products')} style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={14} /> Export Catalog Stats
          </button>
        </div>
      </div>
    </div>
  );
}
