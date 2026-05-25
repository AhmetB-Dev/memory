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

type GameScreenActions = {
  onExit: () => void;
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

export function renderGameScreen(app: HTMLDivElement, setup: GameSetup, actions: GameScreenActions) {
  const selectedTheme = getThemeById(setup.theme);
  const cards = createMemoryCards(setup);
  const players = createPlayers(setup.player);

  let currentPlayerIndex = 0;
  let openCards: MemoryCard[] = [];
  let isBoardLocked = false;

  app.innerHTML = `
 <section class="game-screen ${selectedTheme.className}">
  <header class="game-screen__dp">
    <div class="game-screen__header">
      <div class="game-screen__info-item">
        <div class="game-screen__player-score">
          <img src="public/assets/images/shared/chess_pawn_blue.svg" alt="" />
          <strong id="blue-score">0</strong>
        </div>

        <div class="game-screen__player-score">
          <img src="public/assets/images/shared/chess_pawn_orange.svg" alt="" />
          <strong id="orange-score">0</strong>
        </div>
      </div>

      <div class="game-screen__info-item">
        <span>Current player:</span>
        <img
          id="current-player-icon"
          class="game-screen__current-player-icon"
          src="${getPlayerIcon(getCurrentPlayer().id)}"
          alt="${getCurrentPlayer().name} player"
        />
      </div>

      <div class="game-screen__exit-content">
        <div>
          <img src="/assets/images/themes/gaming/exit.webp" alt="exit" />
        </div>
        <button class="game-screen__exit-button" type="button" id="exit-game-button">Exit game</button>
      </div>
    </div>
  </header>

  <div class="game-screen__board game-screen__board--${setup.boardSize}">
    ${cards
      .map((card) => {
        return `
    <button class="memory-card" type="button" data-card-id="${card.id}">
      <img src="${card.backImage}" alt="Memory card back" class="memory-card__image" />
    </button>
    `;
      })
      .join("")}
  </div>

  <div class="exit-modal" id="exit-modal" hidden>
    <div class="exit-modal__content">
      <h2>Exit game?</h2>

      <p>Your current game will be lost.</p>

      <div class="exit-modal__actions">
        <button class="exit-modal__button" type="button" id="back-to-game-button">Back to game</button>

        <button class="exit-modal__button exit-modal__button--danger" type="button" id="confirm-exit-button">
          Exit game
        </button>
      </div>
    </div>
  </div>
</section>


  `;

  const exitButton = app.querySelector<HTMLButtonElement>("#exit-game-button");
  const cardButtons = app.querySelectorAll<HTMLButtonElement>(".memory-card");

  const exitModal = app.querySelector<HTMLDivElement>("#exit-modal");
  const backToGameButton = app.querySelector<HTMLButtonElement>("#back-to-game-button");
  const confirmExitButton = app.querySelector<HTMLButtonElement>("#confirm-exit-button");

  if (!exitButton || !exitModal || !backToGameButton || !confirmExitButton) {
    throw new Error("Exit modal elements not found");
  }

  exitButton.addEventListener("click", () => {
    if (isBoardLocked) {
      return;
    }

    isBoardLocked = true;
    exitModal.hidden = false;
  });

  backToGameButton.addEventListener("click", () => {
    exitModal.hidden = true;
    isBoardLocked = false;
  });

  confirmExitButton.addEventListener("click", () => {
    actions.onExit();
  });

  cardButtons.forEach((cardButton) => {
    cardButton.addEventListener("click", () => {
      const cardId = Number(cardButton.dataset.cardId);
      handleCardClick(cardId);
    });
  });

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
    checkGameEnd();
  }

  function handleNoMatch(firstCard: MemoryCard, secondCard: MemoryCard) {
    setTimeout(() => {
      closeCard(firstCard);
      closeCard(secondCard);

      openCards = [];
      switchPlayer();
      updateScoreBoard();

      isBoardLocked = false;
    }, 1000);
  }

  function switchPlayer() {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  function getCurrentPlayer() {
    return players[currentPlayerIndex];
  }

  function updateScoreBoard() {
    const currentPlayerIcon = app.querySelector<HTMLImageElement>("#current-player-icon");
    const blueScoreElement = app.querySelector<HTMLElement>("#blue-score");
    const orangeScoreElement = app.querySelector<HTMLElement>("#orange-score");

    if (!currentPlayerIcon || !blueScoreElement || !orangeScoreElement) {
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

    currentPlayerIcon.src = getPlayerIcon(getCurrentPlayer().id);
    currentPlayerIcon.alt = `${getCurrentPlayer().name} player`;

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
        theme: setup.theme,
      },
      {
        onRestart: () => {
          renderGameScreen(app, setup, actions);
        },
        onHome: () => {
          actions.onExit();
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
  const selectedTheme = getThemeById(setup.theme);
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

function getThemeById(themeId: ThemeKey) {
  const selectedTheme = GAME_THEMES.find((theme) => {
    return theme.id === themeId;
  });

  if (!selectedTheme) {
    throw new Error(`Theme not found: ${themeId}`);
  }

  return selectedTheme;
}

function getPlayerIcon(playerId: PlayerKey): string {
  const playerIcons: Record<PlayerKey, string> = {
    blue: "/assets/images/shared/chess_pawn_blue.svg",
    orange: "/assets/images/shared/chess_pawn_orange.svg",
  };

  return playerIcons[playerId];
}

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort(() => {
    return Math.random() - 0.5;
  });
}
