# Mini Sudoku Unlimited (6x6)

A responsive 6x6 Sudoku web application built with React, Vite, and TypeScript.

## Features
- **3 Difficulty Levels**: Easy, Medium, Hard.
- **Notes Mode**: Annotate possible candidates.
- **Auto-Check**: Real-time error highlighting (optional).
- **Undo/Redo**: Mistake forgiveness.
- **Visual Feedback**: Green flash on region completion.
- **Responsive**: Works on mobile and desktop.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

## Deployment

This repo includes a GitHub Action to deploy to GitHub Pages.
1. Push to GitHub.
2. Go to Settings > Pages > Source = "GitHub Actions".
3. The workflow will automatically build and deploy.
