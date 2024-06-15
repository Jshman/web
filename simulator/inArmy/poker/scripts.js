const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let communityCards = [];
let hasExchanged = false;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealHands() {
    playerHand = [];
    dealerHand = [];
    communityCards = [];
    for (let i = 0; i < 5; i++) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }
    for (let i = 0; i < 5; i++) {
        communityCards.push(deck.pop());
    }
    displayHands();
}

function displayHands() {
    const playerHandDiv = document.getElementById('player-hand');
    const dealerHandDiv = document.getElementById('dealer-hand');
    const communityCardsDiv = document.getElementById('community-cards');
    
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';
    communityCardsDiv.innerHTML = '';

    dealerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card hidden';
        dealerHandDiv.appendChild(cardDiv);
    });

    communityCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = `${card.value}${card.suit}`;
        communityCardsDiv.appendChild(cardDiv);
    });

    playerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = `${card.value}${card.suit}`;
        cardDiv.onclick = () => toggleSelect(cardDiv, index);
        playerHandDiv.appendChild(cardDiv);
    });
}

function toggleSelect(cardDiv, index) {
    if (!hasExchanged) {
        cardDiv.classList.toggle('selected');
        playerHand[index].selected = !playerHand[index].selected;
    }
}

function exchangeCards() {
    if (!hasExchanged) {
        playerHand = playerHand.map(card => {
            if (card.selected) {
                return deck.pop();
            } else {
                return card;
            }
        });
        hasExchanged = true;
        displayHands();
        document.getElementById('exchange-button').disabled = true;
    }
}

function getHandRank(hand) {
    const handValues = hand.map(card => values.indexOf(card.value)).sort((a, b) => a - b);
    const handSuits = hand.map(card => card.suit);
    
    const isFlush = handSuits.every(suit => suit === handSuits[0]);
    const isStraight = handValues.every((value, index) => index === 0 || value === handValues[index - 1] + 1);

    if (isFlush && isStraight) return { rank: 8, name: "스트레이트 플러쉬", highCard: handValues[4] }; // Straight flush
    if (isFlush) return { rank: 5, name: "플러쉬", highCard: handValues[4] }; // Flush
    if (isStraight) return { rank: 4, name: "스트레이트", highCard: handValues[4] }; // Straight

    const valueCounts = handValues.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
    const counts = Object.values(valueCounts).sort((a, b) => b - a);

    if (counts[0] === 4) return { rank: 7, name: "포카드", highCard: handValues[4] }; // Four of a kind
    if (counts[0] === 3 && counts[1] === 2) return { rank: 6, name: "풀 하우스", highCard: handValues[4] }; // Full house
    if (counts[0] === 3) return { rank: 3, name: "트리플", highCard: handValues[4] }; // Three of a kind
    if (counts[0] === 2 && counts[1] === 2) return { rank: 2, name: "투 페어", highCard: handValues[4] }; // Two pair
    if (counts[0] === 2) return { rank: 1, name: "원 페어", highCard: handValues[4] }; // One pair

    return { rank: 0, name: "하이 카드", highCard: handValues[4] }; // High card
}

function compareHands() {
    const playerRank = getHandRank(playerHand);
    const dealerRank = getHandRank(dealerHand);

    let resultMessage = '';

    if (playerRank.rank > dealerRank.rank) {
        resultMessage = '플레이어 승리!';
    } else if (playerRank.rank < dealerRank.rank) {
        resultMessage = '딜러 승리!';
    } else {
        if (playerRank.highCard > dealerRank.highCard) {
            resultMessage = '플레이어 승리!';
        } else if (playerRank.highCard < dealerRank.highCard) {
            resultMessage = '딜러 승리!';
        } else {
            resultMessage = '무승부!';
        }
    }

    const dealerHandDiv = document.getElementById('dealer-hand');
    dealerHandDiv.innerHTML = '';
    dealerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        if (index === 0) {
            cardDiv.classList.add('hidden');
        } else {
            cardDiv.classList.add('visible');
        }
        cardDiv.textContent = `${card.value}${card.suit}`;
        dealerHandDiv.appendChild(cardDiv);
    });

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `${resultMessage} (플레이어: ${playerRank.name}, 딜러: ${dealerRank.name})`;
}


function initGame() {
    createDeck();
    shuffle(deck);
    dealHands();
}

window.onload = initGame;
