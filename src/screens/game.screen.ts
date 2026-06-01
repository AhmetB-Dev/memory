import type { GameScreenActions, GameSetup, MemoryCard, Player, PlayerKey } from "../models/game.model";
import { getThemeById } from "../data/themes";
import { createGameScreenHtml } from "./game.template";
import { createMemoryCards, createPlayers, getCurrentPlayerIcon, getPlayerById, getRequiredElement } from "./game.helpers";
import { renderResultScreen } from "./result.screen";

export type { BoardSize, GameSetup, PlayerKey, ThemeKey } from "../models/game.model";

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

export function renderGameScreen(app: HTMLDivElement, setup: GameSetup, actions: GameScreenActions) {
  const context = createGameContext(app, setup, actions);

  renderGameView(context);
  bindGameEvents(context);
}

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

function bindGameEvents(context: GameContext) {
  bindExitEvents(context);
  bindCardEvents(context);
}

function bindExitEvents(context: GameContext) {
  getRequiredElement<HTMLElement>(context.app, "#exit-game-button").addEventListener("click", () => openExitModal(context));
  getRequiredElement<HTMLButtonElement>(context.app, "#back-to-game-button").addEventListener("click", () => closeExitModal(context));
  getRequiredElement<HTMLButtonElement>(context.app, "#confirm-exit-button").addEventListener("click", () => renderGameResult(context));
}

function bindCardEvents(context: GameContext) {
  context.app.querySelectorAll<HTMLButtonElement>(".memory-card").forEach((cardButton) => {
    cardButton.addEventListener("click", () => handleCardClick(context, Number(cardButton.dataset.cardId)));
  });
}

function openExitModal(context: GameContext) {
  if (context.isBoardLocked) {
    return;
  }

  context.isBoardLocked = true;
  getExitModal(context).hidden = false;
}

function closeExitModal(context: GameContext) {
  getExitModal(context).hidden = true;
  context.isBoardLocked = false;
}

function handleCardClick(context: GameContext, cardId: number) {
  const clickedCard = getClickedCard(context, cardId);

  if (!canSelectCard(context, clickedCard)) {
    return;
  }

  flipCard(context, clickedCard);
  context.openCards.push(clickedCard);
  checkOpenCards(context);
}

function canSelectCard(context: GameContext, card: MemoryCard) {
  return !context.isBoardLocked && !card.isFlipped && !card.isMatched;
}

function flipCard(context: GameContext, card: MemoryCard) {
  card.isFlipped = true;
  getCardButton(context, card.id).classList.add("is-flipped");
}

function closeCard(context: GameContext, card: MemoryCard) {
  card.isFlipped = false;
  getCardButton(context, card.id).classList.remove("is-flipped");
}

function checkOpenCards(context: GameContext) {
  if (context.openCards.length !== 2) {
    return;
  }

  context.isBoardLocked = true;
  compareOpenCards(context);
}

function compareOpenCards(context: GameContext) {
  const [firstCard, secondCard] = context.openCards;

  if (firstCard.pairId === secondCard.pairId) {
    handleMatch(context, firstCard, secondCard);
    return;
  }

  handleNoMatch(context, firstCard, secondCard);
}

function handleMatch(context: GameContext, firstCard: MemoryCard, secondCard: MemoryCard) {
  markCardsAsMatched(context, firstCard, secondCard);
  getCurrentPlayer(context).score += 1;
  context.openCards = [];
  context.isBoardLocked = false;
  updateScoreBoard(context);
  checkGameEnd(context);
}

function markCardsAsMatched(context: GameContext, firstCard: MemoryCard, secondCard: MemoryCard) {
  firstCard.isMatched = true;
  secondCard.isMatched = true;
  disableMatchedCard(context, firstCard);
  disableMatchedCard(context, secondCard);
}

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

function switchPlayer(context: GameContext) {
  context.currentPlayerIndex = context.currentPlayerIndex === 0 ? 1 : 0;
}

function getCurrentPlayer(context: GameContext) {
  return context.players[context.currentPlayerIndex];
}

function updateScoreBoard(context: GameContext) {
  updateCurrentPlayerIcon(context);
  updateScoreTexts(context);
}

function updateCurrentPlayerIcon(context: GameContext) {
  const currentPlayer = getCurrentPlayer(context);
  const currentPlayerIcon = getRequiredElement<HTMLImageElement>(context.app, "#current-player-icon");

  currentPlayerIcon.src = getCurrentPlayerIcon(context.setup.theme, currentPlayer.id);
  currentPlayerIcon.alt = `${currentPlayer.name} player`;
  updateCurrentPlayerIconBox(context, currentPlayer.id);
}

function updateCurrentPlayerIconBox(context: GameContext, playerId: PlayerKey) {
  const iconBox = getRequiredElement<HTMLDivElement>(context.app, "#current-player-icon-box");

  iconBox.classList.remove("game-screen__current-player-icon-box--blue", "game-screen__current-player-icon-box--orange");
  iconBox.classList.add(`game-screen__current-player-icon-box--${playerId}`);
}

function updateScoreTexts(context: GameContext) {
  const bluePlayer = getPlayerById(context.players, "blue");
  const orangePlayer = getPlayerById(context.players, "orange");

  getRequiredElement<HTMLElement>(context.app, "#blue-score").textContent = String(bluePlayer.score);
  getRequiredElement<HTMLElement>(context.app, "#orange-score").textContent = String(orangePlayer.score);
}

function checkGameEnd(context: GameContext) {
  const allCardsMatched = context.cards.every((card) => card.isMatched);

  if (allCardsMatched) {
    renderGameResult(context);
  }
}

function renderGameResult(context: GameContext) {
  const highestScore = Math.max(...context.players.map((player) => player.score));
  const winners = context.players.filter((player) => player.score === highestScore);

  renderResultScreen(context.app, createResultData(context, winners), {
    onRestart: () => renderGameScreen(context.app, context.setup, context.actions),
    onHome: () => context.actions.onExit(),
  });
}

function createResultData(context: GameContext, winners: Player[]) {
  return {
    players: context.players,
    winners,
    isTie: winners.length > 1,
    theme: context.setup.theme,
  };
}

function disableMatchedCard(context: GameContext, card: MemoryCard) {
  const cardButton = getCardButton(context, card.id);

  cardButton.disabled = true;
  cardButton.classList.add("is-matched");
}

function getClickedCard(context: GameContext, cardId: number) {
  const clickedCard = context.cards.find((card) => card.id === cardId);

  if (!clickedCard) {
    throw new Error("Clicked card not found");
  }

  return clickedCard;
}

function getCardButton(context: GameContext, cardId: number) {
  return getRequiredElement<HTMLButtonElement>(context.app, `.memory-card[data-card-id="${cardId}"]`);
}

function getExitModal(context: GameContext) {
  return getRequiredElement<HTMLDivElement>(context.app, "#exit-modal");
}
