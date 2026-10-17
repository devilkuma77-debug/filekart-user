import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Flipkart Master Administrator', email: 'admin@flipkart.com', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Catalog Operations Lead', email: 'catalog@flipkart.com', role: 'Product Manager', status: 'Active' },
    { id: 3, name: 'Finance Lead', email: 'finance@flipkart.com', role: 'Finance Admin', status: 'Active' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Manager' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) return;
    setAdmins(prev => [...prev, { id: Date.now(), ...newAdmin, status: 'Active' }]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Admin Staff & Access Roles ({admins.length})</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Manage administrative permissions, role delegation, and security audit logs</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Staff User
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Security Status</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td>
                <td>{a.email}</td>
                <td>
                  <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>
                    {a.role}
                  </span>
                </td>
                <td><span className="badge-status badge-success">{a.status}</span></td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>Full CRUD on assigned modules</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff Member" maxWidth="460px">
        <form onSubmit={handleAdd}>
          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                required
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Corporate Email *</label>
              <input
                type="email"
                required
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Role</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px' }}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Finance Admin">Finance Admin</option>
                <option value="Support Agent">Support Agent</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add Member</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
