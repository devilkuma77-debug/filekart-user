const { query, getIsConnected, memoryStore } = require('../config/db');

exports.getSettings = async (req, res) => {
  try {
    if (getIsConnected()) {
      const rows = await query('SELECT setting_key, setting_value FROM settings');
      const settings = {};
      rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
      return res.json({ success: true, settings: { ...memoryStore.settings, ...settings } });
    } else {
      return res.json({ success: true, settings: memoryStore.settings });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const newSettings = req.body;
    if (getIsConnected()) {
      for (const [key, val] of Object.entries(newSettings)) {
        await query(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, String(val), String(val)]
        );
      }
    }
    Object.assign(memoryStore.settings, newSettings);
    return res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
