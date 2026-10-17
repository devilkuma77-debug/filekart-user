const { query, getIsConnected, memoryStore } = require('../config/db');

// Support & Complaints Tickets
exports.getTickets = async (req, res) => {
  try {
    if (getIsConnected()) {
      const tickets = await query('SELECT * FROM support_tickets ORDER BY id DESC');
      return res.json({ success: true, tickets });
    } else {
      return res.json({ success: true, tickets: memoryStore.support_tickets });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { user_name, subject, message, priority = 'Medium' } = req.body;
    const ticketNumber = 'TIC-' + Math.floor(1000 + Math.random() * 9000);
    const userId = req.user ? req.user.id : null;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    if (getIsConnected()) {
      const result = await query(
        'INSERT INTO support_tickets (ticket_number, user_id, user_name, subject, message, priority) VALUES (?, ?, ?, ?, ?, ?)',
        [ticketNumber, userId, user_name || 'Customer', subject, message, priority]
      );
      return res.status(201).json({ success: true, message: 'Ticket submitted', ticketNumber, ticketId: result.insertId });
    } else {
      const t = { id: memoryStore.support_tickets.length + 1, ticket_number: ticketNumber, user_id: userId, user_name: user_name || 'Customer', subject, message, status: 'Open', priority, created_at: new Date() };
      memoryStore.support_tickets.push(t);
      return res.status(201).json({ success: true, message: 'Ticket submitted', ticketNumber, ticket: t });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (getIsConnected()) {
      await query('UPDATE support_tickets SET status = ? WHERE id = ?', [status, id]);
    } else {
      const t = memoryStore.support_tickets.find(item => item.id === parseInt(id));
      if (t) t.status = status;
    }
    return res.json({ success: true, message: `Ticket status updated to ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
