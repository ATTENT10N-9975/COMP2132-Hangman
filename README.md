# Hangman — COMP 2132 Final Project

A browser-based Hangman game featuring programming terms and hints. Guess the hidden word before making six incorrect guesses.

## How to play

- Read the hint and enter a letter in the input box, or select a letter on the on-screen keyboard.
- Correct guesses reveal every matching position. Incorrect guesses remove a part of the chalk figure and reduce the remaining chances.
- Each letter can be guessed once per round. Guess all letters to win, or lose after six incorrect guesses.
- Select **Play Again** to reset the game and choose another word.

The game loads words and hints from `data/words.json` using `fetch`. It uses seven SVG images for the stages of the drawing and a JavaScript animation to display the result.

## Branches and online testing

- `main` contains the published version of the project. Its GitHub Pages site is [Play Hangman](https://attent10n-9975.github.io/COMP2132-Hangman/).
- `test` is used to prepare and test changes before they are merged into `main`.

GitHub Pages serves the branch selected in the repository's **Settings → Pages**, currently `main`. To test `test` online without changing the published main site, use a separate preview deployment or run the branch locally as described below. Selecting `test` as the Pages source would replace the main site's content with that branch until the setting is changed back. Switching the branch dropdown on the GitHub code page alone does not change the Pages site.

## Run locally

Check out the branch you want to test, open its folder in VS Code, and start Live Server on `index.html`. Alternatively, run `python -m http.server 8000` in the project folder and visit `http://localhost:8000`. Use an HTTP server because opening the HTML directly may block the JSON request.

## Project files and styles

- `index.html` contains the game layout; `js/game.js` manages game state and interaction.
- `data/words.json` stores the words and hints; `images/` contains the hangman drawings.
- `scss/style.scss` is the Sass source and includes a mixin. The compiled stylesheet is `css/style.css`.

To rebuild the CSS after editing the SCSS, run `npm install` followed by `npm run build:css`. No npm packages are needed to play the game.
