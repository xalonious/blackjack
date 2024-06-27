const deck = [];
const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let dealerWins = 0;
let playerWins = 0;
let dealerHidden = true;

const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const dealerScoreDiv = document.getElementById('dealer-score');
const playerScoreDiv = document.getElementById('player-score');
const dealerWinsDiv = document.getElementById('dealer-wins');
const playerWinsDiv = document.getElementById('player-wins');
const resultDiv = document.getElementById('result');

document.getElementById('btn-hit').addEventListener('click', hit);
document.getElementById('btn-stand').addEventListener('click', stand);
document.getElementById('btn-replay').addEventListener('click', resetGame);

window.onload = () => {
    initializeGame();
};

function createDeck() {
    deck.length = 0;
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function initializeGame() {
    resetGameState();
    createDeck();
    shuffleDeck();
    dealInitialCards();
}

function resetGameState() {
    dealerCards = [];
    playerCards = [];
    dealerScore = 0;
    playerScore = 0;
    dealerHidden = true;
    resultDiv.textContent = '';
    dealerCardsDiv.innerHTML = '';
    playerCardsDiv.innerHTML = '';
    dealerScoreDiv.textContent = `Score: ${dealerScore}`;
    playerScoreDiv.textContent = `Score: ${playerScore}`;
    dealerWinsDiv.textContent = `Dealer Wins: ${dealerWins}`;
    playerWinsDiv.textContent = `Player Wins: ${playerWins}`;
    document.getElementById('btn-hit').style.display = 'inline-block';
    document.getElementById('btn-stand').style.display = 'inline-block';
    document.getElementById('btn-replay').style.display = 'none';
}

function dealInitialCards() {
    playerCards.push(drawCard());
    dealerCards.push(drawCard());
    playerCards.push(drawCard());
    dealerCards.push(drawCard());
    updateScores();
    updateDisplay();
    checkForBlackjack();
}

function hit() {
    playerCards.push(drawCard());
    updateScores();
    updateDisplay();
    if (playerScore > 21) {
        endGame('Dealer wins!');
    }
}c

function stand() {
    dealerHidden = false;
    while (dealerScore < 17) {
        dealerCards.push(drawCard());
        updateScores();
    }
    updateDisplay();
    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame('Player wins!');
    } else if (dealerScore > playerScore) {
        endGame('Dealer wins!');
    } else {
        endGame('It\'s a tie!');
    }
}

function drawCard() {
    if (deck.length === 0) {
        createDeck();
        shuffleDeck();
    }
    return deck.pop();
}

function updateScores() {
    dealerScore = calculateScore(dealerCards);
    playerScore = calculateScore(playerCards);
    dealerScoreDiv.textContent = `Score: ${dealerHidden ? '?' : dealerScore}`;
    playerScoreDiv.textContent = `Score: ${playerScore}`;
}

function calculateScore(cards) {
    let score = 0;
    let hasAce = false;
    for (let card of cards) {
        if (!card) continue;
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            score += 10;
        } else if (card.value === 'A') {
            hasAce = true;
            score += 11;
        } else {
            score += parseInt(card.value);
        }
    }
    if (hasAce && score > 21) {
        score -= 10;
    }
    return score;
}

function updateDisplay() {
    dealerCardsDiv.innerHTML = '';
    playerCardsDiv.innerHTML = '';
    dealerCards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        if (dealerHidden && index === 1) {
            cardDiv.textContent = '🂠';
        } else {
            cardDiv.textContent = `${card.value}${card.suit}`;
        }
        dealerCardsDiv.appendChild(cardDiv);
    });
    playerCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.textContent = `${card.value}${card.suit}`;
        cardDiv.classList.add('card');
        playerCardsDiv.appendChild(cardDiv);
    });
}

function checkForBlackjack() {
    if (playerScore === 21) {
        endGame('Blackjack! Player wins!');
    } else if (dealerScore === 21) {
        endGame('Blackjack! Dealer wins!');
    }
}

function endGame(message) {
    dealerHidden = false;
    updateScores();
    updateDisplay();
    resultDiv.textContent = message;
    document.getElementById('btn-hit').style.display = 'none';
    document.getElementById('btn-stand').style.display = 'none';
    document.getElementById('btn-replay').style.display = 'inline-block';
    
    if (message.includes('Player wins')) {
        playerWins++;
        playerWinsDiv.textContent = `Player Wins: ${playerWins}`;
    } else if (message.includes('Dealer wins')) {
        dealerWins++;
        dealerWinsDiv.textContent = `Dealer Wins: ${dealerWins}`;
    }
}

function resetGame() {
    initializeGame();
}
