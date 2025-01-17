// // Please implement exercise logic here

// Global variables
// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let secondCardElement;
let deck;

// default the user can click anywhere to flip cards
let canClick = true;

//Timer button
let timerDisplay = document.createElement("div");
timerDisplay.classList.add("display");
document.body.appendChild(timerDisplay);

//Time duration set for 3 mins
let totalTime = 180000;

// timerDisplay.innerHTML =
//   "Time Left: " + minute + ":" + ("0" + seconds).slice(-2);

const timeInterval = setInterval(() => {
  let minute = Math.floor((totalTime / 1000 / 60) % 60);
  let seconds = Math.floor((totalTime / 1000) % 60);

  totalTime -= 1000;

  if (totalTime >= 0 && totalTime <= 10000) {
    //display that game is ending soon at the last 10s
    timerDisplay.classList.add("red");
    timerDisplay.innerHTML =
      "ENDING SOON!! " + minute + ":" + ("0" + seconds).slice(-2);

    // restart timer
  } else if (totalTime < 0) {
    clearInterval(timeInterval);
    resetGame();
  }

  timerDisplay.innerHTML =
    "Time Left: " + minute + ":" + ("0" + seconds).slice(-2);
}, 1000);

//Score board for matches
let matchScoreContainer = document.createElement("div");
matchScoreContainer.classList.add("display");
matchScoreContainer.classList.add("left");
document.body.appendChild(matchScoreContainer);

let matchScore = 0;
matchScoreContainer.innerHTML = "Matches: " + matchScore;

//Score board for misses
let missScoreContainer = document.createElement("div");
missScoreContainer.classList.add("display");
missScoreContainer.classList.add("right");
document.body.appendChild(missScoreContainer);

let missScore = 0;
missScoreContainer.innerHTML = "Misses: " + missScore;

// message display container
let displayContainer = document.createElement("div");
displayContainer.classList.add("display");
document.body.appendChild(displayContainer);
displayContainer.innerHTML = "Click any boxes below";

//Gameplay logic
const squareClick = (cardElement, row, column) => {
  console.log(cardElement);
  console.log("FIRST CARD DOM ELEMENT", firstCard);
  console.log("BOARD CLICKED CARD", board[row][column]);

  const clickedCard = board[row][column];

  // the user already clicked on this square
  if (cardElement.innerText !== "") {
    return;
  }

  // if the user has not clicked any cards previously
  if (canClick === true) {
    console.log(canClick);

    // first turn
    if (firstCard === null) {
      console.log("first turn");
      firstCard = clickedCard;

      // turn this card over
      const cardDisplay = drawCard(firstCard);
      cardElement.append(cardDisplay);

      // hold onto this for later when it may not match
      firstCardElement = cardElement;

      // second turn
    } else {
      console.log("second turn");

      // if there is a match for 2 cards
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        console.log("match");

        // turn this card over
        const cardDisplay = drawCard(clickedCard);
        cardElement.append(cardDisplay);

        //display matching message
        const message = displayMessage("match");

        //display message disappears after 3s
        setTimeout(() => {
          displayContainer.innerHTML = "Click any boxes below";
        }, 3000);

        //Adding score
        matchScore += 1;
        matchScoreContainer.innerHTML = "Matches: " + matchScore;

        // if there is no match
      } else {
        console.log("NOT a match");
        secondCardElement = cardElement;
        const secondCardDisplay = drawCard(clickedCard);
        cardElement.append(secondCardDisplay);

        // freeze the entire game for 1 second (user would not be able to click to flip any cards)
        canClick = false;
        console.log(canClick);

        //adding miss scores
        missScore += 1;
        missScoreContainer.innerHTML = "Misses: " + missScore;

        //display not matching message
        const message = displayMessage("nomatch");

        //Not matching message disappears after 3s
        setTimeout(() => {
          displayContainer.innerHTML = "Click any boxes below";
        }, 3000);

        // turn both cards over after 1 sec
        setTimeout(() => {
          console.log("counting down...");
          firstCardElement.innerHTML = "";

          // only can click again after they both disappear after 1s
          canClick = true;
          secondCardElement.innerHTML = "";
        }, 1000);
      }
      // reset the first card
      firstCard = null;
    }
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement("div");

  // give it a class for CSS purposes
  boardElement.classList.add("board");

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement("div");

      // set a class for CSS purposes
      square.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// card shuffling
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

//New make deck
const makeDeck = (cardAmount) => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === "1") {
        cardName = "A";
      } else if (cardName === "11") {
        cardName = "J";
      } else if (cardName === "12") {
        cardName = "Q";
      } else if (cardName === "13") {
        cardName = "K";
      }

      //Setting display symbol and color of each card
      let displaySymbol;
      let cardColor;

      if (currentSuit === "diamonds") {
        displaySymbol = "♦";
        cardColor = "red";
      } else if (currentSuit === "hearts") {
        displaySymbol = "♥";
        cardColor = "red";
      } else if (currentSuit === "clubs") {
        displaySymbol = "♣";
        cardColor = "black";
      } else if (currentSuit === "spades") {
        displaySymbol = "&#9824";
        cardColor = "black";
      }

      // make a single card object variable
      const card = {
        name: cardName,
        symbol: displaySymbol,
        color: cardColor,
        suit: currentSuit,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card);
      // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// display message
function displayMessage(status) {
  if (status === "match") {
    displayContainer.innerHTML = "It's a match! Awesome!";
  } else {
    displayContainer.innerHTML = "Not matching :( Try again!";
  }
}

//Game init
const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);
  document.body.appendChild(boardEl);
  // timer();
};

//drawing cards
function drawCard(currentCard) {
  const suit = document.createElement("div");
  suit.classList.add("suit");
  suit.innerHTML = currentCard.symbol;

  const name = document.createElement("div");
  name.classList.add("name", currentCard.color);
  name.innerHTML = currentCard.name;

  const card = document.createElement("div");
  card.classList.add("card");

  card.appendChild(name);
  card.appendChild(suit);

  return card;
}

// //resetting game
// const resetGame = () => {
//   document.body.innerHTML = "";
//   totalTime = 180000;
//   missScore = 0;
//   matchScore = 0;

//   initGame();
//   kickStartTimer();
// };

initGame();
