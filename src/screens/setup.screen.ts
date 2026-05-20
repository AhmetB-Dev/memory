import { GAME_THEMES } from "../data/themes";
import { renderGameScreen, type BoardSize, type PlayerKey, type ThemeKey } from "./game.screen";

type SetupState = {
  theme?: ThemeKey;
  player?: PlayerKey;
  boardSize?: BoardSize;
};

const DECORATIVE_START_THEME: ThemeKey = "coding";

export function renderSetupScreen(app: HTMLDivElement) {
  const setupState: SetupState = {};

  const decorativeTheme = getThemeById(DECORATIVE_START_THEME);

  app.innerHTML = `
    <section class="setup-screen">
      <div class="setup-screen__header">
        <h1 class="setup-screen__title">Settings</h1>
        <img src="/assets/images/shared/arrow-line-long.svg" alt="" />
      </div>

      <div class="setup-screen__layout">
        <div class="setup-screen__options">
          <!-- Game themes -->
          <div class="setup-group">
            <div>
              <img src="/assets/images/shared/palette.svg" alt="" />
            </div>

            <div class="setup-group__content">
              <h2>Game themes</h2>

              <label class="setup-option">
                <input type="radio" name="theme" value="coding" />
                <span>Code vibes theme</span>
              </label>

              <label class="setup-option">
                <input type="radio" name="theme" value="gaming" />
                <span>Gaming theme</span>
              </label>

              <label class="setup-option">
                <input type="radio" name="theme" value="da-projects" />
                <span>DA Projects theme</span>
              </label>

              <label class="setup-option">
                <input type="radio" name="theme" value="foods" />
                <span>Foods theme</span>
              </label>
            </div>
          </div>

          <!-- Choose player -->
          <div class="setup-group">
            <div>
              <img src="/assets/images/shared/chess_pawn.svg" alt="" />
            </div>

            <div class="setup-group__content">
              <h2>Choose player</h2>

              <label class="setup-option">
                <input type="radio" name="player" value="blue" />
                <span>Blue</span>
              </label>

              <label class="setup-option">
                <input type="radio" name="player" value="orange" />
                <span>Orange</span>
              </label>
            </div>
          </div>

          <!-- Board size -->
          <div class="setup-group">
            <div>
              <img src="/assets/images/shared/card.svg" alt="" />
            </div>

            <div class="setup-group__content">
              <h2>Board size</h2>

              <label class="setup-option">
                <input type="radio" name="boardSize" value="16" />
                <span>16 cards</span>
              </label>

              <label class="setup-option">
                <input type="radio" name="boardSize" value="24" />
                <span>24 cards</span>
              </label>

              <label class="setup-option">
                <input type="radio" name="boardSize" value="36" />
                <span>36 cards</span>
              </label>
            </div>
          </div>
        </div>

        <div class="setup-screen__theme-preview">
          <div class="setup-screen__theme-preview-card">
            <img
              id="theme-preview-image"
              class="setup-screen__theme-preview-image"
              src="${decorativeTheme.previewImage}"
              alt=""
            />
          </div>
        </div>
      </div>

      <div class="setup-screen__summary">
        <div class="setup-screen__summary-item">
          <strong id="summary-theme">Game theme</strong>
        </div>

        <img src="/assets/images/shared/summary-divider.svg" alt="" />

        <div class="setup-screen__summary-item">
          <strong id="summary-player">Player</strong>
        </div>

        <img class="setup-screen__bg-color-decor" src="/assets/images/shared/summary-divider.svg" alt="" />

        <div class="setup-screen__summary-item">
          <strong id="summary-board-size">Board size</strong>
        </div>

        <button class="setup-screen__start-button" type="button" id="start-button">
          <img src="/assets/images/shared/start-icon.svg" alt="" class="setup-screen__start-icon" />
          <span>Start</span>
        </button>
      </div>
    </section>
  `;

  function getRequiredElement<T extends HTMLElement>(selector: string): T {
    const element = app.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    return element;
  }

  const startButton = getRequiredElement<HTMLButtonElement>("#start-button");

  const summaryTheme = getRequiredElement<HTMLElement>("#summary-theme");
  const summaryPlayer = getRequiredElement<HTMLElement>("#summary-player");
  const summaryBoardSize = getRequiredElement<HTMLElement>("#summary-board-size");

  const themePreviewImage = getRequiredElement<HTMLImageElement>("#theme-preview-image");

  const themeInputs = app.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const playerInputs = app.querySelectorAll<HTMLInputElement>('input[name="player"]');
  const boardSizeInputs = app.querySelectorAll<HTMLInputElement>('input[name="boardSize"]');

  function updateSummary() {
    const themeLabels: Record<ThemeKey, string> = {
      coding: "Code vibes theme",
      gaming: "Gaming theme",
      "da-projects": "DA Projects theme",
      foods: "Foods theme",
    };

    const playerLabels: Record<PlayerKey, string> = {
      blue: "Blue",
      orange: "Orange",
    };

    summaryTheme.textContent = setupState.theme ? themeLabels[setupState.theme] : "Game theme";

    summaryPlayer.textContent = setupState.player ? playerLabels[setupState.player] : "Player";

    summaryBoardSize.textContent = setupState.boardSize ? `${setupState.boardSize} cards` : "Board size";
  }

  function updateThemePreview() {
    if (!setupState.theme) {
      return;
    }

    const selectedTheme = getThemeById(setupState.theme);

    themePreviewImage.src = selectedTheme.previewImage;
    themePreviewImage.alt = `${selectedTheme.name} preview`;
  }

  themeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.theme = input.value as ThemeKey;

      updateSummary();
      updateThemePreview();

      console.log("Selected theme:", setupState.theme);
    });
  });

  playerInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.player = input.value as PlayerKey;

      updateSummary();

      console.log("Selected player:", setupState.player);
    });
  });

  boardSizeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.boardSize = Number(input.value) as BoardSize;

      updateSummary();

      console.log("Selected board size:", setupState.boardSize);
    });
  });

  startButton.addEventListener("click", () => {
    if (!setupState.theme || !setupState.player || !setupState.boardSize) {
      console.log("Please select theme, player and board size first.");
      return;
    }

    renderGameScreen(app, {
      theme: setupState.theme,
      player: setupState.player,
      boardSize: setupState.boardSize,
    });
  });
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
