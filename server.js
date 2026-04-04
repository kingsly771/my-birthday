const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Helpers ────────────────────────────────────────────────────────────────

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { messages: [], likes: 0 };
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Admin Page ─────────────────────────────────────────────────────────────

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ─── Routes API ─────────────────────────────────────────────────────────────

// GET /api/messages
app.get('/api/messages', (req, res) => {
  const data = readData();
  res.json({ success: true, messages: data.messages });
});

// POST /api/messages
app.post('/api/messages', (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) {
    return res.status(400).json({ success: false, error: 'Nom et message requis.' });
  }
  const data = readData();
  const newMessage = {
    id: Date.now(),
    name: name.trim().substring(0, 50),
    text: text.trim().substring(0, 500),
    timestamp: new Date().toISOString()
  };
  data.messages.unshift(newMessage);
  writeData(data);
  res.json({ success: true, message: newMessage });
});

// DELETE /api/messages/:id
app.delete('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readData();
  const before = data.messages.length;
  data.messages = data.messages.filter(m => m.id !== id);
  if (data.messages.length === before) {
    return res.status(404).json({ success: false, error: 'Message non trouvé.' });
  }
  writeData(data);
  res.json({ success: true });
});

// POST /api/like
app.post('/api/like', (req, res) => {
  const data = readData();
  data.likes = (data.likes || 0) + 1;
  writeData(data);
  res.json({ success: true, likes: data.likes });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const data = readData();
  res.json({
    success: true,
    totalMessages: data.messages.length,
    likes: data.likes || 0
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', '╔══════════════════════════════════════╗');
  console.log('\x1b[36m%s\x1b[0m', '║   🎮  VALENHART BIRTHDAY SYSTEM      ║');
  console.log('\x1b[36m%s\x1b[0m', '║   Access granted — Welcome, Sultan   ║');
  console.log('\x1b[36m%s\x1b[0m', `║   Server running on port ${PORT}         ║`);
  console.log('\x1b[36m%s\x1b[0m', '╚══════════════════════════════════════╝');
});
