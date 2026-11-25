# Word Lab — Hangman

A browser-based Hangman game for COMP 2132. Guess the hidden programming word before making six incorrect guesses.

## Run locally

Open the project folder in VS Code and use Live Server on `index.html`, or run `python -m http.server 8000` from the project folder and visit `http://localhost:8000`. Opening the HTML directly as a file may block the JSON fetch.

## Styles

The SCSS source is `scss/style.scss`. The included CSS is its expanded equivalent. To compile with the official Sass compiler, run `npm install` and then `npm run build:css` in the project folder. No npm packages are required to play the game.

## Customize

- Change the page title, heading, footer and introduction in `index.html`.
- Add or change words and hints in `data/words.json` (single English words only).
- Change colors in `scss/style.scss`, then compile CSS.
- Seven original SVG images represent zero through six incorrect guesses.

## Publish

Create a public GitHub repository, upload the project contents, and optionally enable GitHub Pages from the main branch root for a playable website. Email the repository URL to the instructor from your BCIT email and upload the project ZIP to the Project Dropbox. Do not include `node_modules`.
