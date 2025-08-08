const openBtn = document.getElementById('openBtn');
const openNoCameraBtn = document.getElementById('openNoCameraBtn');
const uploadBtn = document.getElementById('uploadBtn');
const askCamera = document.getElementById('askCamera');
const videoEl = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const result = document.getElementById('result');
const status = document.getElementById('status');

// Replace this with the YouTube video URL you want to open
const youtubeURL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

let lastDataUrl = null;

async function captureAndOpen() {
  if (!askCamera.checked) {
    window.open(youtubeURL, '_blank');
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    status.textContent = 'Camera API not supported in this browser. Opening video without snapshot.';
    result.hidden = false;
    window.open(youtubeURL, '_blank');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });

    videoEl.srcObject = stream;

    await new Promise((resolve) => {
      videoEl.onloadedmetadata = () => {
        const p = videoEl.play();
        if (p && p.then) p.then(resolve).catch(resolve);
        else resolve();
      };
    });

    const w = videoEl.videoWidth || 320;
    const h = videoEl.videoHeight || 240;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, w, h);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    preview.src = dataUrl;
    result.hidden = false;
    status.textContent = 'Captured snapshot (local only).';

    // store last data URL for upload
    lastDataUrl = dataUrl;
    uploadBtn.disabled = false;

    // stop camera to release device
    stream.getTracks().forEach(t => t.stop());

    // open video in a new tab
    window.open(youtubeURL, '_blank');
  } catch (err) {
    console.warn('Camera access denied or error:', err);
    status.textContent = 'Camera was not accessible or permission denied. Opening video without snapshot.';
    result.hidden = false;
    window.open(youtubeURL, '_blank');
  }
}

async function uploadSnapshot() {
  if (!lastDataUrl) {
    alert('No snapshot available. Capture one first.');
    return;
  }

  uploadBtn.disabled = true;
  const originalText = uploadBtn.textContent;
  uploadBtn.textContent = 'Uploading...';

  try {
    const payload = {
      dataUrl: lastDataUrl,
      caption: 'Snapshot from web app'
    };

    const resp = await fetch('/api/upload-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await resp.json();
    if (!json.ok) {
      console.error('Upload failed:', json);
      status.textContent = 'Upload failed: ' + (json.error || 'unknown');
      alert('Upload failed: ' + (json.error || JSON.stringify(json)));
    } else {
      status.textContent = 'Uploaded to Telegram.';
      alert('Uploaded successfully to Telegram.');
    }
  } catch (err) {
    console.error('Upload error:', err);
    status.textContent = 'Upload error: ' + String(err);
    alert('Upload error: ' + String(err));
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = originalText;
  }
}

openBtn.addEventListener('click', captureAndOpen);
openNoCameraBtn.addEventListener('click', () => {
  window.open(youtubeURL, '_blank');
});
uploadBtn.addEventListener('click', uploadSnapshot);
