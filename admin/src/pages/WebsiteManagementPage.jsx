import React, { useState } from 'react';
import { Globe, Save } from 'lucide-react';

export default function WebsiteManagementPage() {
  const [announcement, setAnnouncement] = useState('🔥 Big Billion Days Live: Up to 80% off on Mobiles & Electronics!');
  const [footerAbout, setFooterAbout] = useState('Flipkart Internet Private Limited, Buildings Alyssa, Begonia & Clove Embassy Tech Village, Outer Ring Road, Bengaluru 560103.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Website & App Management</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Customize site header announcements, footer address, and static information</p>
      </div>

      <form onSubmit={handleSave} className="admin-card" style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
            Top Announcement Bar Ticker
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
            Footer Corporate Address Text
          </label>
          <textarea
            rows={3}
            value={footerAbout}
            onChange={(e) => setFooterAbout(e.target.value)}
            style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px', fontSize: '13px' }}
          />
        </div>

        <div>
          <button type="submit" className="btn-primary">
            <Save size={15} /> Save Website Configurations
          </button>
          {saved && <span style={{ color: '#16a34a', fontSize: '13px', marginLeft: '12px', fontWeight: 600 }}>Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
