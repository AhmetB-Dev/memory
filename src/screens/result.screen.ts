import type { Player, ThemeKey } from "../models/game.model";
import { getPlayerById, getRequiredElement } from "./game.helpers";
import { createDrawHtml, createGameOverHtml, createWinnerHtml } from "./result.template";

export type ResultPlayer = Player;

type ResultScreenData = {
  players: Player[];
  winners: Player[];
  isTie: boolean;
  theme: ThemeKey;
};

type ResultScreenActions = {
  onRestart: () => void;
  onHome: () => void;
};

type ResultContext = {
  app: HTMLDivElement;
  result: ResultScreenData;
  actions: ResultScreenActions;
  bluePlayer: Player;
  orangePlayer: Player;
  timeoutId?: number;
};

const GAME_OVER_DURATION_IN_MS = 2500;

export function renderResultScreen(app: HTMLDivElement, result: ResultScreenData, actions: ResultScreenActions) {
  const context = createResultContext(app, result, actions);

  renderGameOverScreen(context);
  context.timeoutId = window.setTimeout(() => renderFinalResultScreen(context), GAME_OVER_DURATION_IN_MS);
}

function createResultContext(app: HTMLDivElement, result: ResultScreenData, actions: ResultScreenActions): ResultContext {
  return {
    app,
    result,
    actions,
    bluePlayer: getPlayerById(result.players, "blue"),
    orangePlayer: getPlayerById(result.players, "orange"),
  };
}

function renderGameOverScreen(context: ResultContext) {
  context.app.innerHTML = createGameOverHtml(context.result.theme, context.bluePlayer, context.orangePlayer);

  getRequiredElement<HTMLElement>(context.app, "#game-over-screen").addEventListener("click", () => {
    clearResultTimeout(context);
    renderFinalResultScreen(context);
  });
}

function renderFinalResultScreen(context: ResultContext) {
  clearResultTimeout(context);

  if (context.result.isTie) {
    renderDrawScreen(context);
    return;
  }

  renderWinnerScreen(context, context.result.winners[0]);
}

function renderWinnerScreen(context: ResultContext, winner: Player) {
  context.app.innerHTML = createWinnerHtml(context.result.theme, winner);
  bindResultButtons(context);
}

function renderDrawScreen(context: ResultContext) {
  context.app.innerHTML = createDrawHtml(context.result.theme);
  bindResultButtons(context);
}

function bindResultButtons(context: ResultContext) {
  getRequiredElement<HTMLButtonElement>(context.app, "#restart-button").addEventListener("click", () => context.actions.onRestart());
  getRequiredElement<HTMLButtonElement>(context.app, "#home-button").addEventListener("click", () => context.actions.onHome());
}

function clearResultTimeout(context: ResultContext) {
  if (context.timeoutId === undefined) {
    return;
  }

  clearTimeout(context.timeoutId);
  context.timeoutId = undefined;
}
