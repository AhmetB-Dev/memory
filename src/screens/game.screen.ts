import type { GameScreenActions, GameSetup, MemoryCard, Player, PlayerKey } from "../models/game.model";
import { getThemeById } from "../data/themes";
import { createGameScreenHtml } from "./game.template";
import {
  createMemoryCards,
  createPlayers,
  getCurrentPlayerIcon,
  getPlayerById,
  getRequiredElement,
} from "../shared/game.helpers";
import { renderResultScreen } from "./result.screen";

export type { BoardSize, GameSetup, PlayerKey, ThemeKey } from "../models/game.model";

/**
 * Full runtime context of one active game.
 *
 * Keeping the state in one object makes it easier to pass the same data between event handlers.
 */
type GameContext = {
  app: HTMLDivElement;
  setup: GameSetup;
  actions: GameScreenActions;
  cards: MemoryCard[];
  players: Player[];
  currentPlayerIndex: number;
  openCards: MemoryCard[];
  isBoardLocked: boolean;
};

/**
 * Renders a new memory game and connects all required event listeners.
 */
export function renderGameScreen(app: HTMLDivElement, setup: GameSetup, actions: GameScreenActions) {
  const context = createGameContext(app, setup, actions);

  renderGameView(context);
  bindGameEvents(context);
}

/** Creates the initial runtime state for one game round. */
function createGameContext(app: HTMLDivElement, setup: GameSetup, actions: GameScreenActions): GameContext {
  return {
    app,
    setup,
    actions,
    cards: createMemoryCards(setup),
    players: createPlayers(setup.player),
    currentPlayerIndex: 0,
    openCards: [],
    isBoardLocked: false,
  };
}

/** Renders the game board and the current score UI. */
function renderGameView(context: GameContext) {
  const selectedTheme = getThemeById(context.setup.theme);

  context.app.innerHTML = createGameScreenHtml({
    cards: context.cards,
    currentPlayer: getCurrentPlayer(context),
    boardSize: context.setup.boardSize,
    theme: context.setup.theme,
    themeClassName: selectedTheme.className,
  });
}

/** Connects all user interactions for the game screen. */
function bindGameEvents(context: GameContext) {
  bindExitEvents(context);
  bindCardEvents(context);
}

/** Connects the exit modal buttons. */
function bindExitEvents(context: GameContext) {
  getRequiredElement<HTMLElement>(context.app, "#exit-game-button").addEventListener("click", () =>
    openExitModal(context),
  );
  getRequiredElement<HTMLButtonElement>(context.app, "#back-to-game-button").addEventListener("click", () =>
    closeExitModal(context),
  );
  getRequiredElement<HTMLButtonElement>(context.app, "#confirm-exit-button").addEventListener("click", () =>
    renderGameResult(context),
  );
}

/** Connects every card button to the card-click handler. */
function bindCardEvents(context: GameContext) {
  context.app.querySelectorAll<HTMLButtonElement>(".memory-card").forEach((cardButton) => {
    cardButton.addEventListener("click", () => handleCardClick(context, Number(cardButton.dataset.cardId)));
  });
}

/** Opens the exit modal and locks the board while the modal is visible. */
function openExitModal(context: GameContext) {
  if (context.isBoardLocked) {
    return;
  }

  context.isBoardLocked = true;
  getExitModal(context).hidden = false;
}

/** Closes the exit modal and unlocks the board again. */
function closeExitModal(context: GameContext) {
  getExitModal(context).hidden = true;
  context.isBoardLocked = false;
}

/** Handles one card selection by the current player. */
function handleCardClick(context: GameContext, cardId: number) {
  const clickedCard = getClickedCard(context, cardId);

  if (!canSelectCard(context, clickedCard)) {
    return;
  }

  flipCard(context, clickedCard);
  context.openCards.push(clickedCard);
  checkOpenCards(context);
}

/** Returns whether a card can currently be selected. */
function canSelectCard(context: GameContext, card: MemoryCard) {
  return !context.isBoardLocked && !card.isFlipped && !card.isMatched;
}

/** Flips a card in the state and updates the matching DOM class. */
function flipCard(context: GameContext, card: MemoryCard) {
  card.isFlipped = true;
  getCardButton(context, card.id).classList.add("is-flipped");
}

/** Flips a card back when the selected pair does not match. */
function closeCard(context: GameContext, card: MemoryCard) {
  card.isFlipped = false;
  getCardButton(context, card.id).classList.remove("is-flipped");
}

/** Starts the comparison as soon as two cards are open. */
function checkOpenCards(context: GameContext) {
  if (context.openCards.length !== 2) {
    return;
  }

  context.isBoardLocked = true;
  compareOpenCards(context);
}

/** Checks whether the two selected cards belong to the same pair. */
function compareOpenCards(context: GameContext) {
  const [firstCard, secondCard] = context.openCards;

  if (firstCard.pairId === secondCard.pairId) {
    handleMatch(context, firstCard, secondCard);
    return;
  }

  handleNoMatch(context, firstCard, secondCard);
}

/** Updates the game state after the current player finds a matching pair. */
function handleMatch(context: GameContext, firstCard: MemoryCard, secondCard: MemoryCard) {
  markCardsAsMatched(context, firstCard, secondCard);
  getCurrentPlayer(context).score += 1;
  context.openCards = [];
  context.isBoardLocked = false;
  updateScoreBoard(context);
  checkGameEnd(context);
}

/** Marks two cards as matched and disables their buttons. */
function markCardsAsMatched(context: GameContext, firstCard: MemoryCard, secondCard: MemoryCard) {
  firstCard.isMatched = true;
  secondCard.isMatched = true;
  disableMatchedCard(context, firstCard);
  disableMatchedCard(context, secondCard);
}

/** Handles a wrong pair, closes both cards after a short delay, and switches the player. */
function handleNoMatch(context: GameContext, firstCard: MemoryCard, secondCard: MemoryCard) {
  setTimeout(() => {
    closeCard(context, firstCard);
    closeCard(context, secondCard);
    context.openCards = [];
    switchPlayer(context);
    updateScoreBoard(context);
    context.isBoardLocked = false;
  }, 1000);
}

/** Switches the active player from blue to orange or from orange to blue. */
function switchPlayer(context: GameContext) {
  context.currentPlayerIndex = context.currentPlayerIndex === 0 ? 1 : 0;
}

/** Returns the player whose turn is currently active. */
function getCurrentPlayer(context: GameContext) {
  return context.players[context.currentPlayerIndex];
}

/** Updates all score-board UI parts that can change during the game. */
function updateScoreBoard(context: GameContext) {
  updateCurrentPlayerIcon(context);
  updateScoreTexts(context);
}

/** Updates the current-player icon and accessibility text. */
function updateCurrentPlayerIcon(context: GameContext) {
  const currentPlayer = getCurrentPlayer(context);
  const currentPlayerIcon = getRequiredElement<HTMLImageElement>(context.app, "#current-player-icon");

  currentPlayerIcon.src = getCurrentPlayerIcon(context.setup.theme, currentPlayer.id);
  currentPlayerIcon.alt = `${currentPlayer.name} player`;
  updateCurrentPlayerIconBox(context, currentPlayer.id);
}

/** Updates the CSS modifier on the current-player icon container. */
function updateCurrentPlayerIconBox(context: GameContext, playerId: PlayerKey) {
  const iconBox = getRequiredElement<HTMLDivElement>(context.app, "#current-player-icon-box");

  iconBox.classList.remove(
    "game-screen__current-player-icon-box--blue",
    "game-screen__current-player-icon-box--orange",
  );
  iconBox.classList.add(`game-screen__current-player-icon-box--${playerId}`);
}

/** Writes the latest player scores into the DOM. */
function updateScoreTexts(context: GameContext) {
  const bluePlayer = getPlayerById(context.players, "blue");
  const orangePlayer = getPlayerById(context.players, "orange");

  getRequiredElement<HTMLElement>(context.app, "#blue-score").textContent = String(bluePlayer.score);
  getRequiredElement<HTMLElement>(context.app, "#orange-score").textContent = String(orangePlayer.score);
}

/** Checks whether all cards are matched and then moves to the result screen. */
function checkGameEnd(context: GameContext) {
  const allCardsMatched = context.cards.every((card) => card.isMatched);

  if (!allCardsMatched) {
    return;
  }

  context.isBoardLocked = true;

  setTimeout(() => {
    renderGameResult(context);
  }, 1500);
}

/** Builds the result data and renders the result screen. */
function renderGameResult(context: GameContext) {
  const highestScore = Math.max(...context.players.map((player) => player.score));
  const winners = context.players.filter((player) => player.score === highestScore);

  renderResultScreen(context.app, createResultData(context, winners), {
    onRestart: () => renderGameScreen(context.app, context.setup, context.actions),
    onHome: () => context.actions.onExit(),
  });
}

/** Creates the result payload from the final game state. */
function createResultData(context: GameContext, winners: Player[]) {
  return {
    players: context.players,
    winners,
    isTie: winners.length > 1,
    theme: context.setup.theme,
  };
}

/** Disables a matched card so it cannot be clicked again. */
function disableMatchedCard(context: GameContext, card: MemoryCard) {
  const cardButton = getCardButton(context, card.id);

  cardButton.disabled = true;
  cardButton.classList.add("is-matched");
}

/** Finds the clicked card in the current card state. */
function getClickedCard(context: GameContext, cardId: number) {
  const clickedCard = context.cards.find((card) => card.id === cardId);

  if (!clickedCard) {
    throw new Error("Clicked card not found");
  }

  return clickedCard;
}

/** Finds the button element for a specific card id. */
function getCardButton(context: GameContext, cardId: number) {
  return getRequiredElement<HTMLButtonElement>(context.app, `.memory-card[data-card-id="${cardId}"]`);
}

/** Returns the exit modal element. */
function getExitModal(context: GameContext) {
  return getRequiredElement<HTMLDivElement>(context.app, "#exit-modal");
}
