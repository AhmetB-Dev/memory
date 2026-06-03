import { renderGameScreen } from "./game.screen";
import { renderHomeScreen } from "./home.screen";
import type { BoardSize, GameSetup, PlayerKey, ThemeKey } from "../models/game.model";
import { getRequiredElement } from "./game.helpers";
import { getThemeById } from "../data/themes";
import { COMPLETE_DIVIDER_IMAGE, DEFAULT_DIVIDER_IMAGE, createSetupScreenHtml } from "./setup.template";

/** Current setup choices before the game starts. */
type SetupState = {
  theme: ThemeKey;
  player?: PlayerKey;
  boardSize?: BoardSize;
};

/** DOM elements used by the setup screen. */
type SetupElements = {
  startButton: HTMLButtonElement;
  summaryTheme: HTMLElement;
  summaryPlayer: HTMLElement;
  summaryBoardSize: HTMLElement;
  themePreviewImage: HTMLImageElement;
  summaryDividers: NodeListOf<HTMLImageElement>;
  themeInputs: NodeListOf<HTMLInputElement>;
  themeOptions: NodeListOf<HTMLElement>;
  playerInputs: NodeListOf<HTMLInputElement>;
  boardSizeInputs: NodeListOf<HTMLInputElement>;
};

/** Full runtime context for the setup screen. */
type SetupContext = {
  app: HTMLDivElement;
  state: SetupState;
  elements: SetupElements;
};

/** The setup screen starts with the coding theme selected. */
const DEFAULT_THEME: ThemeKey = "coding";

/** User-facing labels for all available themes. */
const THEME_LABELS: Record<ThemeKey, string> = {
  coding: "Code vibes theme",
  gaming: "Gaming theme",
  "da-projects": "DA Projects theme",
  foods: "Foods theme",
};

/** User-facing labels for all available players. */
const PLAYER_LABELS: Record<PlayerKey, string> = {
  blue: "Blue",
  orange: "Orange",
};

/** Renders the setup screen and connects all input events. */
export function renderSetupScreen(app: HTMLDivElement) {
  app.innerHTML = createSetupScreenHtml(DEFAULT_THEME);

  const context = createSetupContext(app);

  bindSetupEvents(context);
}

/** Creates the initial setup context. */
function createSetupContext(app: HTMLDivElement): SetupContext {
  return {
    app,
    state: { theme: DEFAULT_THEME },
    elements: createSetupElements(app),
  };
}

/** Collects all required setup-screen elements from the DOM. */
function createSetupElements(app: HTMLDivElement): SetupElements {
  return {
    startButton: getRequiredElement<HTMLButtonElement>(app, "#start-button"),
    summaryTheme: getRequiredElement<HTMLElement>(app, "#summary-theme"),
    summaryPlayer: getRequiredElement<HTMLElement>(app, "#summary-player"),
    summaryBoardSize: getRequiredElement<HTMLElement>(app, "#summary-board-size"),
    themePreviewImage: getRequiredElement<HTMLImageElement>(app, "#theme-preview-image"),
    summaryDividers: app.querySelectorAll<HTMLImageElement>("[data-summary-divider]"),
    themeInputs: app.querySelectorAll<HTMLInputElement>('input[name="theme"]'),
    themeOptions: app.querySelectorAll<HTMLElement>("[data-theme-option]"),
    playerInputs: app.querySelectorAll<HTMLInputElement>('input[name="player"]'),
    boardSizeInputs: app.querySelectorAll<HTMLInputElement>('input[name="boardSize"]'),
  };
}

/** Registers all setup-screen event listeners. */
function bindSetupEvents(context: SetupContext) {
  bindThemeHoverEvents(context);
  bindThemeChangeEvents(context);
  bindPlayerChangeEvents(context);
  bindBoardSizeChangeEvents(context);
  bindStartButtonEvent(context);
}

/** Shows a temporary theme preview while the user hovers over a theme option. */
function bindThemeHoverEvents(context: SetupContext) {
  context.elements.themeOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => updateThemePreview(context, getThemeOption(option)));
    option.addEventListener("mouseleave", () => updateThemePreview(context, context.state.theme));
  });
}

/** Saves the selected theme when the user changes the theme radio input. */
function bindThemeChangeEvents(context: SetupContext) {
  context.elements.themeInputs.forEach((input) => {
    input.addEventListener("change", () => selectTheme(context, input.value as ThemeKey));
  });
}

/** Saves the selected starting player. */
function bindPlayerChangeEvents(context: SetupContext) {
  context.elements.playerInputs.forEach((input) => {
    input.addEventListener("change", () => selectPlayer(context, input.value as PlayerKey));
  });
}

/** Saves the selected board size. */
function bindBoardSizeChangeEvents(context: SetupContext) {
  context.elements.boardSizeInputs.forEach((input) => {
    input.addEventListener("change", () => selectBoardSize(context, Number(input.value) as BoardSize));
  });
}

/** Starts the game when the setup is complete and the start button is clicked. */
function bindStartButtonEvent(context: SetupContext) {
  context.elements.startButton.addEventListener("click", () => startGame(context));
}

/** Updates the selected theme and all dependent UI parts. */
function selectTheme(context: SetupContext, theme: ThemeKey) {
  context.state.theme = theme;
  updateSummary(context);
  updateThemePreview(context, theme);
  updateStartButtonState(context);
}

/** Updates the selected player and button state. */
function selectPlayer(context: SetupContext, player: PlayerKey) {
  context.state.player = player;
  updateSummary(context);
  updateStartButtonState(context);
}

/** Updates the selected board size and button state. */
function selectBoardSize(context: SetupContext, boardSize: BoardSize) {
  context.state.boardSize = boardSize;
  updateSummary(context);
  updateStartButtonState(context);
}

/** Writes the currently selected options into the summary box. */
function updateSummary(context: SetupContext) {
  context.elements.summaryTheme.textContent = THEME_LABELS[context.state.theme];
  context.elements.summaryPlayer.textContent = context.state.player ? PLAYER_LABELS[context.state.player] : "Player";
  context.elements.summaryBoardSize.textContent = context.state.boardSize ? `${context.state.boardSize} cards` : "Board size";
}

/** Updates the theme preview image and its alt text. */
function updateThemePreview(context: SetupContext, themeId: ThemeKey) {
  const selectedTheme = getThemeById(themeId);

  context.elements.themePreviewImage.src = selectedTheme.previewImage;
  context.elements.themePreviewImage.alt = `${selectedTheme.name} preview`;
}

/** Enables the start button only when all required setup choices are selected. */
function updateStartButtonState(context: SetupContext) {
  const isComplete = isSetupComplete(context.state);

  context.elements.startButton.disabled = !isComplete;
  updateDividerImages(context, isComplete);
}

/** Changes the summary divider image depending on whether the setup is complete. */
function updateDividerImages(context: SetupContext, isComplete: boolean) {
  context.elements.summaryDividers.forEach((divider) => {
    divider.src = isComplete ? COMPLETE_DIVIDER_IMAGE : DEFAULT_DIVIDER_IMAGE;
  });
}

/** Starts the game with the completed setup. */
function startGame(context: SetupContext) {
  const gameSetup = getCompleteSetup(context.state);

  if (!gameSetup) {
    return;
  }

  renderGameScreen(context.app, gameSetup, { onExit: () => renderHomeScreen(context.app) });
}

/** Returns a valid game setup only after all required setup choices are selected. */
function getCompleteSetup(state: SetupState): GameSetup | undefined {
  if (!state.player || !state.boardSize) {
    return undefined;
  }

  return { theme: state.theme, player: state.player, boardSize: state.boardSize };
}

/** Checks whether all required setup fields are selected. */
function isSetupComplete(state: SetupState) {
  return Boolean(state.player && state.boardSize);
}

/** Reads the theme id from a theme option element. */
function getThemeOption(option: HTMLElement) {
  return option.dataset.themeOption as ThemeKey;
}
