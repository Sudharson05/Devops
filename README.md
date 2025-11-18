Chrome Dino — Minimal

Files:
- `index.html` — the game page
- `style.css` — styles
- `script.js` — game logic

How to run:
- Option A: Open `f:\Devops\index.html` directly in a web browser.
- Option B: Serve the folder and open in browser (recommended):

PowerShell (from any location):

```powershell
Set-Location 'f:\Devops'
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Controls:
- Press `Space` or `Arrow Up` to jump.
- Click or tap to jump (also restarts when game over).

Notes:
- This is a minimal recreation for learning and local play.
- If you want sounds, sprite art, or more features (clouds, mobile-optimized HUD, speed scaling), tell me which features to add next.