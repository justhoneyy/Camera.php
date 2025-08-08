# Camera Consent + YouTube opener + Telegram upload

This static site requests front-camera access (with user consent), captures one snapshot, displays it locally, and can upload snapshots to a Telegram bot via a small Express server.

Files
- package.json
- vite.config.js
- README.md
- server/index.js
- public/index.html
- src/main.js
- src/main.css

Quick start (local)
1. Install dependencies:
   npm install

2. Build:
   npm run build

3. Start server:
   npm run start

4. Open http://localhost:3000 in your browser.

Environment variables (recommended)
- TELEGRAM_BOT_TOKEN — your bot token (optional; defaults are embedded in server for convenience)
- TELEGRAM_CHAT_ID — chat id where photos will be sent (optional; defaults embedded)

On Render
- Deploy as a Web Service (Node).
- Build Command: npm run build
- Start Command: npm run start
- Set the environment variables TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Render for security (recommended).

Security note
- Your bot token is sensitive. Do not expose it in a public repository. Prefer setting environment variables in your deployment environment instead of storing tokens in code.
- Do not upload images without explicit user consent.
- 
