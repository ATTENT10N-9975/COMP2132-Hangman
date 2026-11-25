'use strict';

const MAX_MISTAKES = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// One object keeps all information about the current round together.
const game = {
    words: [],
    answer: '',
    guessedLetters: new Set(),
    mistakes: 0,
    active: false,
    previousIndex: -1
};

const elements = {
    image: document.querySelector('#hangman'),
    counter: document.querySelector('#counter'),
    chances: document.querySelector('#chances'),
    remaining: document.querySelector('#remaining'),
    hint: document.querySelector('#hint'),
    word: document.querySelector('#word'),
    form: document.querySelector('#guess-form'),
    input: document.querySelector('#letter'),
    guessButton: document.querySelector('#guess-button'),
    keyboard: document.querySelector('#keyboard'),
    feedback: document.querySelector('#feedback'),
    result: document.querySelector('#result'),
    resultTitle: document.querySelector('#result-title'),
    resultMessage: document.querySelector('#result-message'),
    restart: document.querySelector('#restart')
};

function createKeyboard() {
    for (const letter of ALPHABET) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = letter;
        button.dataset.letter = letter;
        button.disabled = true;
        button.addEventListener('click', () => guessLetter(letter));
        elements.keyboard.append(button);
    }
}

// Read the external JSON file over HTTP before starting the first game.
async function loadWords() {
    try {
        const response = await fetch('data/words.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const words = await response.json();
        if (!Array.isArray(words)) {
            throw new Error('Invalid word list');
        }
        game.words = words.filter(item => item && typeof item.word === 'string' &&
            /^[a-z]+$/i.test(item.word) && typeof item.hint === 'string' && item.hint.trim());
        if (game.words.length === 0) {
            throw new Error('No valid words found');
        }
        startGame();
    } catch (error) {
        elements.hint.textContent = 'Unable to load the word list.';
        elements.feedback.textContent = 'Open this project through a local web server, then retry.';
        elements.restart.textContent = 'Retry';
        elements.restart.hidden = false;
        console.error(error);
    }
}

function startGame() {
    let index = Math.floor(Math.random() * game.words.length);
    // Avoid repeating the same word immediately when another word is available.
    if (game.words.length > 1 && index === game.previousIndex) {
        index = (index + 1 + Math.floor(Math.random() * (game.words.length - 1))) % game.words.length;
    }
    game.previousIndex = index;
    game.answer = game.words[index].word.toUpperCase();
    game.guessedLetters.clear();
    game.mistakes = 0;
    game.active = true;
    elements.hint.textContent = game.words[index].hint;
    elements.feedback.textContent = 'Choose a letter to begin.';
    elements.result.hidden = true;
    elements.restart.hidden = true;
    elements.restart.textContent = 'Play Again';
    elements.input.value = '';
    renderGame();
    elements.input.focus();
}

function renderGame() {
    elements.word.replaceChildren();
    for (const letter of game.answer) {
        const tile = document.createElement('span');
        const revealed = game.guessedLetters.has(letter);
        tile.className = revealed ? 'tile revealed' : 'tile';
        tile.textContent = revealed ? letter : '_';
        elements.word.append(tile);
    }
    elements.image.src = `images/hangman-${game.mistakes}.svg`;
    elements.image.alt = `Hangman drawing: ${game.mistakes} of ${MAX_MISTAKES} mistakes`;
    elements.counter.textContent = `${game.mistakes} / ${MAX_MISTAKES} mistakes`;
    const remaining = MAX_MISTAKES - game.mistakes;
    elements.remaining.textContent = `${remaining} ${remaining === 1 ? 'chance' : 'chances'} remaining`;
    elements.chances.replaceChildren();
    for (let index = 0; index < MAX_MISTAKES; index++) {
        const mark = document.createElement('span');
        mark.className = index < game.mistakes ? 'used' : 'available';
        elements.chances.append(mark);
    }
    for (const button of elements.keyboard.children) {
        const letter = button.dataset.letter;
        const guessed = game.guessedLetters.has(letter);
        button.disabled = !game.active || guessed;
        button.classList.toggle('correct', guessed && game.answer.includes(letter));
        button.classList.toggle('incorrect', guessed && !game.answer.includes(letter));
    }
    elements.input.disabled = !game.active;
    elements.guessButton.disabled = !game.active;
}

function guessLetter(value) {
    if (!game.active) return;
    const letter = value.trim().toUpperCase();
    elements.input.value = '';
    if (!/^[A-Z]$/.test(letter)) {
        elements.feedback.textContent = 'Please enter one letter from A to Z.';
        return;
    }
    if (game.guessedLetters.has(letter)) {
        elements.feedback.textContent = `${letter} has already been guessed. Try another letter.`;
        return;
    }
    game.guessedLetters.add(letter);
    if (game.answer.includes(letter)) {
        elements.feedback.textContent = `Nice! ${letter} is in the word.`;
    } else {
        game.mistakes++;
        elements.feedback.textContent = `${letter} is not in the word.`;
    }
    const won = [...game.answer].every(character => game.guessedLetters.has(character));
    if (won || game.mistakes >= MAX_MISTAKES) {
        finishGame(won);
    }
    renderGame();
    if (game.active) elements.input.focus();
}

function finishGame(won) {
    game.active = false;
    elements.resultTitle.textContent = won ? 'You Won!' : 'You Lost!';
    elements.resultMessage.textContent = `The word was ${game.answer}.`;
    elements.result.className = won ? 'result win' : 'result loss';
    elements.result.hidden = false;
    elements.restart.hidden = false;
    elements.feedback.textContent = won ? 'Great work! You solved the word.' : 'No chances left. Try another word!';
    // JavaScript animation: fade and slide the result into view.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elements.result.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 350, easing: 'ease-out' });
    }
    elements.restart.focus();
}

elements.form.addEventListener('submit', event => {
    event.preventDefault();
    guessLetter(elements.input.value);
});
elements.restart.addEventListener('click', () => {
    if (game.words.length) {
        startGame();
    } else {
        elements.restart.hidden = true;
        loadWords();
    }
});
createKeyboard();
loadWords();
