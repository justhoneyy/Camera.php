const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Keep your working token & chat ID
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '6047507658:AAGHC5tFppE2yqLpQi4KOrz7TwGeM0Mc-LI';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '5574741182';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built static files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Upload photo to Telegram
app.post('/api/upload-photo', async (req, res) => {
  try {
    const { dataUrl, caption } = req.body;
    if (!dataUrl?.startsWith('data:image/')) {
      return res.status(400).json({ ok: false, error: 'Invalid or missing dataUrl' });
    }
    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ ok: false, error: 'Invalid data URL format' });

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', buffer, { filename: 'snapshot.jpg', contentType: mime });
    if (caption) form.append('caption', caption);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
    const resp = await fetch(url, { method: 'POST', body: form });
    const json = await resp.json();

    if (!json.ok) {
      return res.status(500).json({ ok: false, error: 'Telegram API error', telegram: json });
    }

    res.json({ ok: true, result: json.result });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
