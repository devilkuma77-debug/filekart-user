import React, { useState } from 'react';
import { Truck, MapPin, Hash, CheckCircle } from 'lucide-react';

export default function ShippingPage() {
  const [partners] = useState([
    { name: 'Ekart Logistics', code: 'EKART', activeShipments: 142, avgDeliveryDays: '1-2 Days', status: 'Operational' },
    { name: 'BlueDart Express', code: 'BLUEDART', activeShipments: 86, avgDeliveryDays: '2 Days', status: 'Operational' },
    { name: 'Delhivery Surface', code: 'DELHIVERY', activeShipments: 64, avgDeliveryDays: '3 Days', status: 'Operational' }
  ]);

  const [shipments] = useState([
    { awb: 'FKAWB948201948', partner: 'Ekart Logistics', destination: 'Bengaluru (560103)', orderNumber: 'OD1092837482', status: 'In Transit' },
    { awb: 'BLU83921094852', partner: 'BlueDart', destination: 'Mumbai (400001)', orderNumber: 'OD1092837483', status: 'Out for Delivery' },
    { awb: 'DEL93821048591', partner: 'Delhivery', destination: 'Delhi (110001)', orderNumber: 'OD1092837484', status: 'Delivered' }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Logistics & Delivery Operations</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Courier integrations, AWB generation, delivery partner performance, and pickup scheduling</p>
      </div>

      {/* Partners Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {partners.map((p, idx) => (
          <div key={idx} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#2874f0" />
                <strong style={{ fontSize: '15px' }}>{p.name}</strong>
              </div>
              <span className="badge-status badge-success">{p.status}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active Packages: <strong>{p.activeShipments}</strong></div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>SLA Commitment: <strong>{p.avgDeliveryDays}</strong></div>
          </div>
        ))}
      </div>

      {/* Active Shipments Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '14px' }}>
          Live Courier Shipments & Tracking
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>AWB Tracking No.</th>
              <th>Carrier</th>
              <th>Destination Pincode</th>
              <th>Flipkart Order</th>
              <th>Shipment Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s, idx) => (
              <tr key={idx}>
                <td><strong style={{ fontFamily: 'monospace', color: '#2563eb' }}>{s.awb}</strong></td>
                <td>{s.partner}</td>
                <td>{s.destination}</td>
                <td><strong>{s.orderNumber}</strong></td>
                <td>
                  <span className={`badge-status ${s.status === 'Delivered' ? 'badge-success' : 'badge-info'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
