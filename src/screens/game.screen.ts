import { GAME_THEMES } from "../data/themes";
import { renderResultScreen } from "./result.screen";

export type ThemeKey = "coding" | "gaming" | "da-projects" | "foods";
export type PlayerKey = "blue" | "orange";
export type BoardSize = 16 | 24 | 36;

export type GameSetup = {
  theme: ThemeKey;
  player: PlayerKey;
  boardSize: BoardSize;
};

type MemoryCard = {
  id: number;
  pairId: number;
  image: string;
  backImage: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Player = {
  id: PlayerKey;
  name: string;
  score: number;
};

export function renderGameScreen(app: HTMLDivElement, setup: GameSetup) {
  const TURN_TIME_SECONDS = 20;

  const cards = createMemoryCards(setup);
  const players = createPlayers(setup.player);

  let currentPlayerIndex = 0;
  let openCards: MemoryCard[] = [];
  let isBoardLocked = false;
  let timeLeft = TURN_TIME_SECONDS;
  let timerId: number | undefined;

  app.innerHTML = `
    <section class="game-screen">
      <header class="game-screen__header">
        <div>
          <p class="game-screen__subtitle">Memory Game</p>
          <h1 class="game-screen__title">Find all pairs</h1>
        </div>

        <button class="game-screen__exit-button" type="button" id="exit-game-button">
          Exit
        </button>
      </header>

      <div class="game-screen__info">
        <div class="game-screen__info-item">
          <span>Current player</span>
          <strong id="current-player">${getCurrentPlayer().name}</strong>
        </div>

        <div class="game-screen__info-item">
          <span>Time</span>
          <strong id="turn-timer">${TURN_TIME_SECONDS}</strong>
        </div>

        <div class="game-screen__info-item">
          <span>Blue score</span>
          <strong id="blue-score">0</strong>
        </div>

        <div class="game-screen__info-item">
          <span>Orange score</span>
          <strong id="orange-score">0</strong>
        </div>

        <div class="game-screen__info-item">
          <span>Board size</span>
          <strong>${setup.boardSize} cards</strong>
        </div>
      </div>

      <div class="game-screen__board">
        ${cards
          .map((card) => {
            return `
              <button class="memory-card" type="button" data-card-id="${card.id}">
                <img
                  src="${card.backImage}"
                  alt="Memory card back"
                  class="memory-card__image"
                />
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;

  const exitButton = app.querySelector<HTMLButtonElement>("#exit-game-button");
  const cardButtons = app.querySelectorAll<HTMLButtonElement>(".memory-card");

  if (!exitButton) {
    throw new Error("Exit game button not found");
  }

  exitButton.addEventListener("click", () => {
    stopTimer();
    console.log("Exit game clicked");
  });

  cardButtons.forEach((cardButton) => {
    cardButton.addEventListener("click", () => {
      const cardId = Number(cardButton.dataset.cardId);
      handleCardClick(cardId);
    });
  });

  startTimer();

  function handleCardClick(cardId: number) {
    if (isBoardLocked) {
      return;
    }

    const clickedCard = cards.find((card) => {
      return card.id === cardId;
    });

    if (!clickedCard) {
      throw new Error("Clicked card not found");
    }

    if (clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    flipCard(clickedCard);
    openCards.push(clickedCard);

    if (openCards.length === 2) {
      checkOpenCards();
    }
  }

  function flipCard(card: MemoryCard) {
    card.isFlipped = true;

    const cardButton = getCardButton(card.id);
    const image = cardButton.querySelector<HTMLImageElement>(".memory-card__image");

    if (!image) {
      throw new Error("Card image not found");
    }

    image.src = card.image;
    image.alt = "Memory card front";
  }

  function closeCard(card: MemoryCard) {
    card.isFlipped = false;

    const cardButton = getCardButton(card.id);
    const image = cardButton.querySelector<HTMLImageElement>(".memory-card__image");

    if (!image) {
      throw new Error("Card image not found");
    }

    image.src = card.backImage;
    image.alt = "Memory card back";
  }

  function checkOpenCards() {
    isBoardLocked = true;
    stopTimer();

    const [firstCard, secondCard] = openCards;

    if (firstCard.pairId === secondCard.pairId) {
      handleMatch(firstCard, secondCard);
      return;
    }

    handleNoMatch(firstCard, secondCard);
  }

  function handleMatch(firstCard: MemoryCard, secondCard: MemoryCard) {
    firstCard.isMatched = true;
    secondCard.isMatched = true;

    getCurrentPlayer().score += 1;

    disableMatchedCard(firstCard);
    disableMatchedCard(secondCard);

    openCards = [];
    isBoardLocked = false;

    updateScoreBoard();

    const isGameFinished = checkGameEnd();

    if (!isGameFinished) {
      resetTimer();
    }

    console.log("Match found. Current player stays:", getCurrentPlayer());
  }

  function handleNoMatch(firstCard: MemoryCard, secondCard: MemoryCard) {
    console.log("No match. Player will change.");

    setTimeout(() => {
      closeCard(firstCard);
      closeCard(secondCard);

      openCards = [];
      switchPlayer();
      updateScoreBoard();

      isBoardLocked = false;
      resetTimer();
    }, 1000);
  }

  function startTimer() {
    stopTimer();

    timerId = window.setInterval(() => {
      timeLeft -= 1;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        handleTimeExpired();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId === undefined) {
      return;
    }

    clearInterval(timerId);
    timerId = undefined;
  }

  function resetTimer() {
    stopTimer();
    timeLeft = TURN_TIME_SECONDS;
    updateTimerDisplay();
    startTimer();
  }

  function updateTimerDisplay() {
    const timerElement = app.querySelector<HTMLElement>("#turn-timer");

    if (!timerElement) {
      throw new Error("Timer element not found");
    }

    timerElement.textContent = String(timeLeft);
  }

  function handleTimeExpired() {
    stopTimer();

    if (isBoardLocked) {
      return;
    }

    isBoardLocked = true;

    if (openCards.length === 1) {
      closeCard(openCards[0]);
    }

    openCards = [];

    switchPlayer();
    updateScoreBoard();

    isBoardLocked = false;
    resetTimer();

    console.log("Time expired. Player changed:", getCurrentPlayer());
  }

  function switchPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function getCurrentPlayer() {
    return players[currentPlayerIndex];
  }

  function updateScoreBoard() {
    const currentPlayerElement = app.querySelector<HTMLElement>("#current-player");
    const blueScoreElement = app.querySelector<HTMLElement>("#blue-score");
    const orangeScoreElement = app.querySelector<HTMLElement>("#orange-score");

    if (!currentPlayerElement || !blueScoreElement || !orangeScoreElement) {
      throw new Error("Score board elements not found");
    }

    const bluePlayer = players.find((player) => {
      return player.id === "blue";
    });

    const orangePlayer = players.find((player) => {
      return player.id === "orange";
    });

    if (!bluePlayer || !orangePlayer) {
      throw new Error("Players not found");
    }

    currentPlayerElement.textContent = getCurrentPlayer().name;
    blueScoreElement.textContent = String(bluePlayer.score);
    orangeScoreElement.textContent = String(orangePlayer.score);
  }

  function checkGameEnd(): boolean {
    const allCardsMatched = cards.every((card) => {
      return card.isMatched;
    });

    if (!allCardsMatched) {
      return false;
    }

    stopTimer();

    const highestScore = Math.max(
      ...players.map((player) => {
        return player.score;
      }),
    );

    const winners = players.filter((player) => {
      return player.score === highestScore;
    });

    renderResultScreen(
      app,
      {
        players,
        winners,
        isTie: winners.length > 1,
      },
      {
        onRestart: () => {
          renderGameScreen(app, setup);
        },
      },
    );

    return true;
  }

  function disableMatchedCard(card: MemoryCard) {
    const cardButton = getCardButton(card.id);

    cardButton.disabled = true;
    cardButton.classList.add("is-matched");
  }

  function getCardButton(cardId: number) {
    const cardButton = app.querySelector<HTMLButtonElement>(`.memory-card[data-card-id="${cardId}"]`);

    if (!cardButton) {
      throw new Error(`Card button not found: ${cardId}`);
    }

    return cardButton;
  }
}

function createPlayers(startPlayer: PlayerKey): Player[] {
  const bluePlayer: Player = {
    id: "blue",
    name: "Blue",
    score: 0,
  };

  const orangePlayer: Player = {
    id: "orange",
    name: "Orange",
    score: 0,
  };

  if (startPlayer === "blue") {
    return [bluePlayer, orangePlayer];
  }

  return [orangePlayer, bluePlayer];
}

function createMemoryCards(setup: GameSetup): MemoryCard[] {
  const selectedTheme = GAME_THEMES.find((theme) => {
    return theme.id === setup.theme;
  });

  if (!selectedTheme) {
    throw new Error(`Theme not found: ${setup.theme}`);
  }

  const neededPairs = setup.boardSize / 2;

  if (selectedTheme.cardImages.length < neededPairs) {
    throw new Error(
      `Not enough card images for ${setup.boardSize} cards. Needed: ${neededPairs}, available: ${selectedTheme.cardImages.length}`,
    );
  }

  const selectedImages = selectedTheme.cardImages.slice(0, neededPairs);

  const cards: MemoryCard[] = selectedImages.flatMap((image, index) => {
    const pairId = index + 1;

    return [
      {
        id: pairId * 2 - 1,
        pairId,
        image,
        backImage: selectedTheme.cardBackImage,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: pairId * 2,
        pairId,
        image,
        backImage: selectedTheme.cardBackImage,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return shuffleCards(cards);
}

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort(() => {
    return Math.random() - 0.5;
  });
}
