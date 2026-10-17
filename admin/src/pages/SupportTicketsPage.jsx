import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { LifeBuoy, CheckCircle2, Clock } from 'lucide-react';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTickets();
      if (res.success && res.tickets) setTickets(res.tickets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleResolve = async (id) => {
    try {
      await adminApi.updateTicketStatus(id, 'Resolved');
      loadTickets();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Customer Support & Grievance Tickets ({tickets.length})</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Respond to customer inquiries, delivery delays, and dispute resolution tickets</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Complaint / Message</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading tickets...</td></tr>
            ) : tickets.map((t) => (
              <tr key={t.id}>
                <td><strong style={{ fontFamily: 'monospace', color: '#2563eb' }}>{t.ticket_number}</strong></td>
                <td>{t.user_name}</td>
                <td><strong>{t.subject}</strong></td>
                <td style={{ maxWidth: '300px', fontSize: '12px' }}>{t.message}</td>
                <td>
                  <span className={`badge-status ${t.priority === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge-status ${t.status === 'Resolved' ? 'badge-success' : 'badge-info'}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  {t.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(t.id)}
                      style={{ backgroundColor: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
