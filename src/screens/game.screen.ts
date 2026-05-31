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
      <div class="game-screen__info-item game-screen__bg-pd">
    <div class="game-screen__player-score">
     <div
      class="game-screen__player-score-icon game-screen__player-score-icon--blue"
     aria-hidden="true"
    ></div>

     <span class="game-screen__player-score-blue-txt"></span>

  <strong id="blue-score">0</strong>
</div>

<div class="game-screen__player-score">
    <div
    class="game-screen__player-score-icon game-screen__player-score-icon--orange"
    aria-hidden="true"
    ></div>

  <span class="game-screen__player-score-orange-txt"></span>

     <strong id="orange-score">0</strong>
    </div>
      </div>

      <div class="game-screen__info-item">
        <span>Current player:</span>

        <div
          id="current-player-icon-box"
          class="game-screen__current-player-icon-box game-screen__current-player-icon-box--${getCurrentPlayer().id}"
        >
          <img
            id="current-player-icon"
            class="game-screen__current-player-icon"
            src="${getCurrentPlayerIcon(setup.theme, getCurrentPlayer().id)}"
            alt="${getCurrentPlayer().name} player"
          />
        </div>
      </div>

      <div class="game-screen__exit-content">
        <div class="game-screen__exit-icon game-screen__exit-icon-size"></div>
        <button class="game-screen__exit-button" type="button" id="exit-game-button">Exit game</button>
      </div>
    </div>
  </header>

  <div class="game-screen__board game-screen__board--${setup.boardSize}">
    ${cards
      .map((card) => {
        return `
 <button
  class="memory-card"
  type="button"
  data-card-id="${card.id}"
>
  <span class="memory-card__inner">
    <img
      src="${card.backImage}"
      alt="Memory card back"
      class="memory-card__image memory-card__image--back"
    />

    <img
      src="${card.image}"
      alt="Memory card front"
      class="memory-card__image memory-card__image--front"
    />
  </span>
</button>
    `;
      })
      .join("")}
  </div>

  <div class="exit-modal" id="exit-modal" hidden>
    <div class="exit-modal__content">
      <h2>Are you sure you want to quit the game?</h2>

      <div class="exit-modal__actions">
        <button class="exit-modal__button" type="button" id="back-to-game-button">No, Back to game</button>

        <button class="exit-modal__button exit-modal__button--danger" type="button" id="confirm-exit-button">
          Yes, quit game
        </button>
      </div>
    </div>
  </div>
</section>
  `;

  const exitButton = getRequiredElement<HTMLButtonElement>(app, "#exit-game-button");

  const exitModal = getRequiredElement<HTMLDivElement>(app, "#exit-modal");

  const backToGameButton = getRequiredElement<HTMLButtonElement>(app, "#back-to-game-button");

  const confirmExitButton = getRequiredElement<HTMLButtonElement>(app, "#confirm-exit-button");

  const cardButtons = app.querySelectorAll<HTMLButtonElement>(".memory-card");

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
    renderGameResult();
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
    cardButton.classList.add("is-flipped");
  }
  function closeCard(card: MemoryCard) {
    card.isFlipped = false;

    const cardButton = getCardButton(card.id);
    cardButton.classList.remove("is-flipped");
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
    const currentPlayerIcon = getRequiredElement<HTMLImageElement>(app, "#current-player-icon");

    const currentPlayerIconBox = getRequiredElement<HTMLDivElement>(app, "#current-player-icon-box");

    const blueScoreElement = getRequiredElement<HTMLElement>(app, "#blue-score");

    const orangeScoreElement = getRequiredElement<HTMLElement>(app, "#orange-score");

    const bluePlayer = getPlayerById("blue");
    const orangePlayer = getPlayerById("orange");
    const currentPlayer = getCurrentPlayer();

    currentPlayerIcon.src = getCurrentPlayerIcon(setup.theme, currentPlayer.id);
    currentPlayerIcon.alt = `${currentPlayer.name} player`;

    currentPlayerIconBox.classList.remove(
      "game-screen__current-player-icon-box--blue",
      "game-screen__current-player-icon-box--orange",
    );

    currentPlayerIconBox.classList.add(`game-screen__current-player-icon-box--${currentPlayer.id}`);

    blueScoreElement.textContent = String(bluePlayer.score);
    orangeScoreElement.textContent = String(orangePlayer.score);
  }

  function checkGameEnd() {
    const allCardsMatched = cards.every((card) => {
      return card.isMatched;
    });

    if (!allCardsMatched) {
      return;
    }

    renderGameResult();
  }

  function renderGameResult() {
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
  }

  function disableMatchedCard(card: MemoryCard) {
    const cardButton = getCardButton(card.id);

    cardButton.disabled = true;
    cardButton.classList.add("is-matched");
  }

  function getPlayerById(playerId: PlayerKey) {
    const player = players.find((currentPlayer) => {
      return currentPlayer.id === playerId;
    });

    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }

    return player;
  }

  function getCardButton(cardId: number) {
    return getRequiredElement<HTMLButtonElement>(app, `.memory-card[data-card-id="${cardId}"]`);
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

function getCurrentPlayerIcon(themeId: ThemeKey, playerId: PlayerKey): string {
  if (themeId === "coding") {
    return getCodingCurrentPlayerIcon(playerId);
  }

  return "/assets/images/shared/chess_pawn_player.svg";
}

function getCodingCurrentPlayerIcon(playerId: PlayerKey): string {
  const playerIcons: Record<PlayerKey, string> = {
    blue: "/assets/images/themes/coding/label_blue.svg",
    orange: "/assets/images/themes/coding/label_orange.svg",
  };

  return playerIcons[playerId];
}

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort(() => {
    return Math.random() - 0.5;
  });
}

function getRequiredElement<T extends HTMLElement>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}
