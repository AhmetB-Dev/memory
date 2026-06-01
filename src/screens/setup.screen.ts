import { renderGameScreen } from "./game.screen";
import { renderHomeScreen } from "./home.screen";
import type { BoardSize, GameSetup, PlayerKey, ThemeKey } from "../models/game.model";
import { getRequiredElement } from "./game.helpers";
import { getThemeById } from "../data/themes";
import { COMPLETE_DIVIDER_IMAGE, DEFAULT_DIVIDER_IMAGE, createSetupScreenHtml } from "./setup.template";

type SetupState = {
  theme: ThemeKey;
  player?: PlayerKey;
  boardSize?: BoardSize;
};

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

type SetupContext = {
  app: HTMLDivElement;
  state: SetupState;
  elements: SetupElements;
};

const DEFAULT_THEME: ThemeKey = "coding";

const THEME_LABELS: Record<ThemeKey, string> = {
  coding: "Code vibes theme",
  gaming: "Gaming theme",
  "da-projects": "DA Projects theme",
  foods: "Foods theme",
};

const PLAYER_LABELS: Record<PlayerKey, string> = {
  blue: "Blue",
  orange: "Orange",
};

export function renderSetupScreen(app: HTMLDivElement) {
  app.innerHTML = createSetupScreenHtml(DEFAULT_THEME);

  const context = createSetupContext(app);

  bindSetupEvents(context);
}

function createSetupContext(app: HTMLDivElement): SetupContext {
  return {
    app,
    state: { theme: DEFAULT_THEME },
    elements: createSetupElements(app),
  };
}

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

function bindSetupEvents(context: SetupContext) {
  bindThemeHoverEvents(context);
  bindThemeChangeEvents(context);
  bindPlayerChangeEvents(context);
  bindBoardSizeChangeEvents(context);
  bindStartButtonEvent(context);
}

function bindThemeHoverEvents(context: SetupContext) {
  context.elements.themeOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => updateThemePreview(context, getThemeOption(option)));
    option.addEventListener("mouseleave", () => updateThemePreview(context, context.state.theme));
  });
}

function bindThemeChangeEvents(context: SetupContext) {
  context.elements.themeInputs.forEach((input) => {
    input.addEventListener("change", () => selectTheme(context, input.value as ThemeKey));
  });
}

function bindPlayerChangeEvents(context: SetupContext) {
  context.elements.playerInputs.forEach((input) => {
    input.addEventListener("change", () => selectPlayer(context, input.value as PlayerKey));
  });
}

function bindBoardSizeChangeEvents(context: SetupContext) {
  context.elements.boardSizeInputs.forEach((input) => {
    input.addEventListener("change", () => selectBoardSize(context, Number(input.value) as BoardSize));
  });
}

function bindStartButtonEvent(context: SetupContext) {
  context.elements.startButton.addEventListener("click", () => startGame(context));
}

function selectTheme(context: SetupContext, theme: ThemeKey) {
  context.state.theme = theme;
  updateSummary(context);
  updateThemePreview(context, theme);
  updateStartButtonState(context);
}

function selectPlayer(context: SetupContext, player: PlayerKey) {
  context.state.player = player;
  updateSummary(context);
  updateStartButtonState(context);
}

function selectBoardSize(context: SetupContext, boardSize: BoardSize) {
  context.state.boardSize = boardSize;
  updateSummary(context);
  updateStartButtonState(context);
}

function updateSummary(context: SetupContext) {
  context.elements.summaryTheme.textContent = THEME_LABELS[context.state.theme];
  context.elements.summaryPlayer.textContent = context.state.player ? PLAYER_LABELS[context.state.player] : "Player";
  context.elements.summaryBoardSize.textContent = context.state.boardSize ? `${context.state.boardSize} cards` : "Board size";
}

function updateThemePreview(context: SetupContext, themeId: ThemeKey) {
  const selectedTheme = getThemeById(themeId);

  context.elements.themePreviewImage.src = selectedTheme.previewImage;
  context.elements.themePreviewImage.alt = `${selectedTheme.name} preview`;
}

function updateStartButtonState(context: SetupContext) {
  const isComplete = isSetupComplete(context.state);

  context.elements.startButton.disabled = !isComplete;
  updateDividerImages(context, isComplete);
}

function updateDividerImages(context: SetupContext, isComplete: boolean) {
  context.elements.summaryDividers.forEach((divider) => {
    divider.src = isComplete ? COMPLETE_DIVIDER_IMAGE : DEFAULT_DIVIDER_IMAGE;
  });
}

function startGame(context: SetupContext) {
  const gameSetup = getCompleteSetup(context.state);

  if (!gameSetup) {
    return;
  }

  renderGameScreen(context.app, gameSetup, { onExit: () => renderHomeScreen(context.app) });
}

function getCompleteSetup(state: SetupState): GameSetup | undefined {
  if (!state.player || !state.boardSize) {
    return undefined;
  }

  return { theme: state.theme, player: state.player, boardSize: state.boardSize };
}

function isSetupComplete(state: SetupState) {
  return Boolean(state.player && state.boardSize);
}

function getThemeOption(option: HTMLElement) {
  return option.dataset.themeOption as ThemeKey;
}
