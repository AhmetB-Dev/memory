import type { Player, ThemeKey } from "../models/game.model";
import { getPlayerById, getRequiredElement } from "./game.helpers";
import { createDrawHtml, createGameOverHtml, createWinnerHtml } from "./result.template";

/** Public player type used by the result screen. */
export type ResultPlayer = Player;

/** Final result data passed from the game screen to the result screen. */
type ResultScreenData = {
  players: Player[];
  winners: Player[];
  isTie: boolean;
  theme: ThemeKey;
};

/** Actions that can be triggered from the result screen buttons. */
type ResultScreenActions = {
  onRestart: () => void;
  onHome: () => void;
};

/** Runtime context for the result-screen flow. */
type ResultContext = {
  app: HTMLDivElement;
  result: ResultScreenData;
  actions: ResultScreenActions;
  bluePlayer: Player;
  orangePlayer: Player;
  timeoutId?: number;
};

/** How long the temporary GAME OVER screen stays visible before the final result appears. */
const GAME_OVER_DURATION_IN_MS = 2500;

/**
 * Renders the result flow.
 *
 * First, the game-over screen is shown. After a delay, the final winner or draw screen is displayed.
 */
export function renderResultScreen(app: HTMLDivElement, result: ResultScreenData, actions: ResultScreenActions) {
  const context = createResultContext(app, result, actions);

  renderGameOverScreen(context);
  context.timeoutId = window.setTimeout(() => renderFinalResultScreen(context), GAME_OVER_DURATION_IN_MS);
}

/** Creates the result context and extracts both player scores. */
function createResultContext(app: HTMLDivElement, result: ResultScreenData, actions: ResultScreenActions): ResultContext {
  return {
    app,
    result,
    actions,
    bluePlayer: getPlayerById(result.players, "blue"),
    orangePlayer: getPlayerById(result.players, "orange"),
  };
}

/** Renders the temporary game-over screen and allows the user to skip the delay by clicking. */
function renderGameOverScreen(context: ResultContext) {
  context.app.innerHTML = createGameOverHtml(context.result.theme, context.bluePlayer, context.orangePlayer);

  getRequiredElement<HTMLElement>(context.app, "#game-over-screen").addEventListener("click", () => {
    clearResultTimeout(context);
    renderFinalResultScreen(context);
  });
}

/** Decides whether the final screen should show a winner or a draw. */
function renderFinalResultScreen(context: ResultContext) {
  clearResultTimeout(context);

  if (context.result.isTie) {
    renderDrawScreen(context);
    return;
  }

  renderWinnerScreen(context, context.result.winners[0]);
}

/** Renders the winner screen and connects its buttons. */
function renderWinnerScreen(context: ResultContext, winner: Player) {
  context.app.innerHTML = createWinnerHtml(context.result.theme, winner);
  bindResultButtons(context);
}

/** Renders the draw screen and connects its buttons. */
function renderDrawScreen(context: ResultContext) {
  context.app.innerHTML = createDrawHtml(context.result.theme);
  bindResultButtons(context);
}

/** Connects the restart and home buttons. */
function bindResultButtons(context: ResultContext) {
  getRequiredElement<HTMLButtonElement>(context.app, "#restart-button").addEventListener("click", () =>
    context.actions.onRestart(),
  );
  getRequiredElement<HTMLButtonElement>(context.app, "#home-button").addEventListener("click", () =>
    context.actions.onHome(),
  );
}

/** Clears the pending game-over timeout when the final result is shown early. */
function clearResultTimeout(context: ResultContext) {
  if (context.timeoutId === undefined) {
    return;
  }

  clearTimeout(context.timeoutId);
  context.timeoutId = undefined;
}
