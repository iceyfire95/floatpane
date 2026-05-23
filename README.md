# Floaty

A minimal floating browser window that stays above your other apps — on both macOS and Windows.

## Features

- **Always on top** — floats above every other window, even when unfocused
- **Auto-hiding toolbar** — controls slide away when you're not using them; reappear when your cursor enters the window
- **URL bar** — type a URL or a search term and press Enter
- **Back / Forward / Reload** navigation
- **Pin toggle** — click the 📌 to turn always-on-top on or off at any time
- **Opacity slider** — make the window semi-transparent so you can see what's behind it
- **Frameless & resizable** — drag the toolbar to move, drag edges/corners to resize

## Quick start

You need [Node.js](https://nodejs.org) (v18 or newer) installed.

```bash
# 1 — install dependencies (downloads Electron once, ~150 MB)
npm install

# 2 — launch the app
npm start
```

## Building a distributable

Install [electron-builder](https://www.electron.build/):

```bash
npm install --save-dev electron-builder
```

Add a `build` script to `package.json`:

```json
"scripts": {
  "start": "electron .",
  "build": "electron-builder"
}
```

Then run:

```bash
npm run build
```

This produces a `.dmg` (macOS) or `.exe` installer (Windows) in the `dist/` folder.

## Keyboard shortcuts

| Action | Shortcut |
|---|---|
| Focus URL bar | Click it, or `Cmd/Ctrl+L` (planned) |
| Navigate | Enter in the URL bar |

## Notes

- `target="_blank"` links open inside the same webview rather than spawning a new OS window.
- The opacity slider minimum is 15 % so the window is never completely invisible.
- On macOS, `always-on-top` uses the `floating` level so Floaty stays above normal apps but system UI (e.g. Spotlight) still appears on top.
