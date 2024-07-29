document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    showStartMenu();
});

const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const currentWordDisplay = document.getElementById('currentWord');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const startMenu = document.getElementById('startMenu');

let words = [
    {english: "Dog", hebrew: "כלב"},
    {english: "Cat", hebrew: "חתול"},
    {english: "Fish", hebrew: "דג"},
    {english: "Bird", hebrew: "ציפור"},
    {english: "Elephant", hebrew: "פיל"},
];

let currentWord;
let score = 0;
let playerSize = 40;
let gameActive = false;

function showStartMenu() {
    startMenu.style.display = 'flex';
    gameArea.style.display = 'none';
}

function startGame() {
    console.log("Starting game...");
    startMenu.style.display = 'none';
    gameArea.style.display = 'block';
    gameActive = true;
    score = 0;
    playerSize = 40;
    updateScore();
    player.style.width = playerSize + 'px';
    player.style.height = playerSize + 'px';
    player.style.left = (gameArea.clientWidth / 2 - playerSize / 2) + 'px';
    player.style.top = (gameArea.clientHeight / 2 - playerSize / 2) + 'px';
    createWords();
    nextWord();
    console.log("Game started");
}

function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    currentWordDisplay.textContent = currentWord.english;
    ensureCorrectWordOnScreen();
}

function createWords() {
    for (let i = 0; i < 10; i++) {
        createNewWord();
    }
}

function createNewWord() {
    const word = document.createElement('div');
    word.className = 'word';
    word.textContent = words[Math.floor(Math.random() * words.length)].hebrew;
    word.isColliding = false;
    positionWord(word);
    gameArea.appendChild(word);
    moveWord(word);
}

function ensureCorrectWordOnScreen() {
    const wordsOnScreen = Array.from(document.querySelectorAll('.word')).map(w => w.textContent);
    if (!wordsOnScreen.includes(currentWord.hebrew)) {
        const randomWord = document.querySelector('.word');
        randomWord.textContent = currentWord.hebrew;
    }
}

function positionWord(wordElement) {
    const maxX = gameArea.clientWidth - wordElement.offsetWidth;
    const maxY = gameArea.clientHeight - wordElement.offsetHeight;
    wordElement.style.left = Math.random() * maxX + 'px';
    wordElement.style.top = Math.random() * maxY + 'px';
}

function moveWord(wordElement) {
    let dx = (Math.random() - 0.5) * 2; // הקטנו את המהירות
    let dy = (Math.random() - 0.5) * 2; // הקטנו את המהירות

    function animate() {
        if (!gameActive) return;

        let rect = wordElement.getBoundingClientRect();
        let gameRect = gameArea.getBoundingClientRect();

        let newLeft = wordElement.offsetLeft + dx;
        let newTop = wordElement.offsetTop + dy;

        if (newLeft <= 0 || newLeft + rect.width >= gameRect.width) {
            dx = -dx;
            newLeft = Math.max(0, Math.min(newLeft, gameRect.width - rect.width));
        }
        if (newTop <= 0 || newTop + rect.height >= gameRect.height) {
            dy = -dy;
            newTop = Math.max(0, Math.min(newTop, gameRect.height - rect.height));
        }

        wordElement.style.left = newLeft + 'px';
        wordElement.style.top = newTop + 'px';

        dx += (Math.random() - 0.5) * 0.05; // הקטנו את השינוי האקראי
        dy += (Math.random() - 0.5) * 0.05; // הקטנו את השינוי האקראי

        const maxSpeed = 2.5; // הקטנו את המהירות המקסימלית
        dx = Math.max(-maxSpeed, Math.min(maxSpeed, dx));
        dy = Math.max(-maxSpeed, Math.min(maxSpeed, dy));

        requestAnimationFrame(animate);
    }

    animate();
}

function updateScore() {
    scoreDisplay.textContent = 'ניקוד: ' + score;
}

function checkCollision() {
    if (!gameActive) return;

    const playerRect = player.getBoundingClientRect();
    const words = document.querySelectorAll('.word');

    words.forEach(word => {
        if (!word.isColliding) {
            const wordRect = word.getBoundingClientRect();
            if (
                playerRect.left < wordRect.right &&
                playerRect.right > wordRect.left &&
                playerRect.top < wordRect.bottom &&
                playerRect.bottom > wordRect.top
            ) {
                if (word.textContent === currentWord.hebrew) {
                    word.isColliding = true;
                    score++;
                    playerSize += 5;
                    player.style.width = playerSize + 'px';
                    player.style.height = playerSize + 'px';
                    updateScore();
                    fadeOutWord(word);
                    setTimeout(() => {
                        if (word.parentNode === gameArea) {
                            gameArea.removeChild(word);
                        }
                        createNewWord();
                        nextWord();
                    }, 500);
                } else {
                    endGame();
                }
            }
        }
    });
}

function fadeOutWord(wordElement) {
    let opacity = 1;
    const fadeEffect = setInterval(() => {
        if (opacity > 0) {
            opacity -= 0.1;
            wordElement.style.opacity = opacity;
        } else {
            clearInterval(fadeEffect);
        }
    }, 50);
}

function endGame() {
    gameActive = false;
    gameOverScreen.style.display = 'flex';
    document.getElementById('finalScore').textContent = score;
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    const words = document.querySelectorAll('.word');
    words.forEach(word => word.remove());
    startGame();
}

function movePlayer(x, y) {
    if (!gameActive) return;

    const gameRect = gameArea.getBoundingClientRect();
    const maxX = gameRect.width - playerSize;
    const maxY = gameRect.height - playerSize;
    const newX = Math.max(0, Math.min(maxX, x - gameRect.left - playerSize / 2));
    const newY = Math.max(0, Math.min(maxY, y - gameRect.top - playerSize / 2));
    player.style.left = newX + 'px';
    player.style.top = newY + 'px';
    
    checkCollision();
}

gameArea.addEventListener('mousemove', function(e) {
    if (gameActive) {
        movePlayer(e.clientX, e.clientY);
    }
});

gameArea.addEventListener('touchmove', function(e) {
    if (gameActive) {
        e.preventDefault();
        const touch = e.touches[0];
        movePlayer(touch.clientX, touch.clientY);
    }
}, { passive: false });

function showCustomWordsForm() {
    startMenu.style.display = 'none';
    gameArea.style.display = 'none';
    document.getElementById('customWordsForm').style.display = 'flex';
    document.getElementById('wordPairs').innerHTML = '';
    addWordPairInputs();
}

function showStartMenu() {
    document.getElementById('customWordsForm').style.display = 'none';
    startMenu.style.display = 'flex';
}

function addWordPairInputs() {
    const wordPairDiv = document.createElement('div');
    wordPairDiv.className = 'word-pair';
    wordPairDiv.innerHTML = `
        <input type="text" placeholder="מילה באנגלית" class="english-word">
        <input type="text" placeholder="תרגום לעברית" class="hebrew-word">
    `;
    document.getElementById('wordPairs').appendChild(wordPairDiv);
    wordPairDiv.classList.add('bounce');
}

function submitCustomWordsAndStart() {
    const wordPairs = document.querySelectorAll('.word-pair');
    const customWords = Array.from(wordPairs).map(pair => {
        const englishWord = pair.querySelector('.english-word').value.trim();
        const hebrewWord = pair.querySelector('.hebrew-word').value.trim();
        return { english: englishWord, hebrew: hebrewWord };
    }).filter(pair => pair.english && pair.hebrew);

    if (customWords.length > 0) {
        words = customWords;
        document.getElementById('customWordsForm').style.display = 'none';
        startGame();
    } else {
        alert('נא להזין לפחות זוג מילים אחד');
    }
}

function loadWordsFromFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const customWords = JSON.parse(e.target.result);
                if (Array.isArray(customWords) && customWords.length > 0 && 
                    customWords.every(word => word.english && word.hebrew)) {
                    words = customWords;
                    alert(`${customWords.length} מילים נטענו בהצלחה`);
                    showCustomWordsForm();
                    populateCustomWordsForm(customWords);
                } else {
                    throw new Error("הקובץ אינו מכיל מערך תקין של מילים");
                }
            } catch (error) {
                console.error("שגיאה בטעינת הקובץ:", error);
                alert(`שגיאה בטעינת הקובץ: ${error.message}`);
            }
        };
        reader.readAsText(file);
    }
}

function populateCustomWordsForm(customWords) {
    const wordPairsContainer = document.getElementById('wordPairs');
    wordPairsContainer.innerHTML = '';
    customWords.forEach(word => {
        const wordPairDiv = document.createElement('div');
        wordPairDiv.className = 'word-pair';
        wordPairDiv.innerHTML = `
            <input type="text" value="${word.english}" class="english-word">
            <input type="text" value="${word.hebrew}" class="hebrew-word">
        `;
        wordPairsContainer.appendChild(wordPairDiv);
    });
}

function saveWordsToFile() {
    const wordPairs = document.querySelectorAll('.word-pair');
    const customWords = Array.from(wordPairs).map(pair => {
        const englishWord = pair.querySelector('.english-word').value.trim();
        const hebrewWord = pair.querySelector('.hebrew-word').value.trim();
        return { english: englishWord, hebrew: hebrewWord };
    }).filter(pair => pair.english && pair.hebrew);

    if (customWords.length > 0) {
        const jsonStr = JSON.stringify(customWords, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom_words.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert('אין מילים לשמירה. אנא הזן לפחות זוג מילים אחד.');
    }
}

// הוספת מאזיני אירועים לכפתורים
document.getElementById('addWordPair').addEventListener('click', addWordPairInputs);
document.getElementById('submitCustomWords').addEventListener('click', submitCustomWordsAndStart);
document.getElementById('loadFile').addEventListener('change', loadWordsFromFile);
document.getElementById('saveToFile').addEventListener('click', saveWordsToFile);
