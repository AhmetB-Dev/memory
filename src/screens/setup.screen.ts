import { GAME_THEMES } from "../data/themes";
import { renderHomeScreen } from "./home.screen";
import { renderGameScreen, type BoardSize, type PlayerKey, type ThemeKey } from "./game.screen";

type SetupState = {
  theme: ThemeKey;
  player?: PlayerKey;
  boardSize?: BoardSize;
};

const DEFAULT_THEME: ThemeKey = "coding";

const DEFAULT_DIVIDER_IMAGE = "/assets/images/setting/summary-divider.svg";
const COMPLETE_DIVIDER_IMAGE = "/assets/images/setting/Line.svg";

export function renderSetupScreen(app: HTMLDivElement) {
  const setupState: SetupState = {
    theme: DEFAULT_THEME,
  };

  const defaultTheme = getThemeById(DEFAULT_THEME);

  app.innerHTML = `
    <section class="setup-screen">
      <div style="display: flex; justify-content: space-between; align-items: flex-end">
        <div class="setup-screen__layout">
          <div class="setup-screen__header">
            <h1 class="setup-screen__title">Settings</h1>
            <img src="/assets/images/shared/arrow-line-long.svg" alt="" />
          </div>

          <div class="setup-screen__options">
            <div class="setup-group">
              <div class="setup-group__icon">
                <img src="/assets/images/setting/palette.svg" alt="" />
              </div>

              <div class="setup-group__content">
                <h2>Game themes</h2>

                <label class="setup-option" data-theme-option="coding">
                  <input type="radio" name="theme" value="coding" checked />
                  <span>Code vibes theme</span>
                </label>

                <label class="setup-option" data-theme-option="gaming">
                  <input type="radio" name="theme" value="gaming" />
                  <span>Gaming theme</span>
                </label>

                <label class="setup-option" data-theme-option="da-projects">
                  <input type="radio" name="theme" value="da-projects" />
                  <span>DA Projects theme</span>
                </label>

                <label class="setup-option" data-theme-option="foods">
                  <input type="radio" name="theme" value="foods" />
                  <span>Foods theme</span>
                </label>
              </div>
            </div>

            <div class="setup-group">
              <div class="setup-group__icon">
                <img src="/assets/images/setting/chess_pawn.svg" alt="" />
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

            <div class="setup-group">
              <div class="setup-group__icon">
                <img src="/assets/images/setting/card.svg" alt="" />
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
        </div>

        <div class="setup-screen__dp-flex">
          <div class="setup-screen__theme-preview">
            <div class="setup-screen__theme-preview-card">
              <img
                id="theme-preview-image"
                class="setup-screen__theme-preview-image"
                src="${defaultTheme.previewImage}"
                alt="${defaultTheme.name} preview"
              />
            </div>
          </div>

          <div class="setup-screen__summary">
            <div>
              <div class="setup-screen__summary-content" id="summary-content">
                <div class="setup-screen__summary-item">
                  <strong id="summary-theme">Code vibes theme</strong>
                </div>

                <img
                  class="setup-screen__decoration-icon"
                  data-summary-divider
                  src="${DEFAULT_DIVIDER_IMAGE}"
                  alt=""
                />

                <div class="setup-screen__summary-item">
                  <strong id="summary-player">Player</strong>
                </div>

                <img
                  class="setup-screen__decoration-icon"
                  data-summary-divider
                  src="${DEFAULT_DIVIDER_IMAGE}"
                  alt=""
                />

                <div class="setup-screen__summary-item">
                  <strong id="summary-board-size">Board size</strong>
                </div>

                <button
                  class="setup-screen__start-button"
                  type="button"
                  id="start-button"
                  disabled
                >
                  <img
                    src="/assets/images/setting/start-icon.svg"
                    alt=""
                    class="setup-screen__start-icon"
                  />
                  <span>Start</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const startButton = getRequiredElement<HTMLButtonElement>(app, "#start-button");

  const summaryContent = getRequiredElement<HTMLElement>(app, "#summary-content");

  const summaryTheme = getRequiredElement<HTMLElement>(app, "#summary-theme");

  const summaryPlayer = getRequiredElement<HTMLElement>(app, "#summary-player");

  const summaryBoardSize = getRequiredElement<HTMLElement>(app, "#summary-board-size");

  const themePreviewImage = getRequiredElement<HTMLImageElement>(app, "#theme-preview-image");

  const summaryDividers = app.querySelectorAll<HTMLImageElement>("[data-summary-divider]");

  const themeInputs = app.querySelectorAll<HTMLInputElement>('input[name="theme"]');

  const themeOptions = app.querySelectorAll<HTMLElement>("[data-theme-option]");

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

    summaryTheme.textContent = themeLabels[setupState.theme];

    summaryPlayer.textContent = setupState.player ? playerLabels[setupState.player] : "Player";

    summaryBoardSize.textContent = setupState.boardSize ? `${setupState.boardSize} cards` : "Board size";
  }

  function updateThemePreview(themeId: ThemeKey) {
    const selectedTheme = getThemeById(themeId);

    themePreviewImage.src = selectedTheme.previewImage;
    themePreviewImage.alt = `${selectedTheme.name} preview`;
  }

  function isSetupComplete() {
    return Boolean(setupState.player && setupState.boardSize);
  }

  function updateDividerImages(isComplete: boolean) {
    summaryDividers.forEach((divider) => {
      divider.src = isComplete ? COMPLETE_DIVIDER_IMAGE : DEFAULT_DIVIDER_IMAGE;
    });
  }

  function updateStartButtonState() {
    const isComplete = isSetupComplete();

    startButton.disabled = !isComplete;

    summaryContent.classList.toggle("setup-screen__summary-content--complete", isComplete);

    updateDividerImages(isComplete);
  }

  themeOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
      const themeId = option.dataset.themeOption as ThemeKey;
      updateThemePreview(themeId);
    });

    option.addEventListener("mouseleave", () => {
      updateThemePreview(setupState.theme);
    });
  });

  themeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.theme = input.value as ThemeKey;

      updateSummary();
      updateThemePreview(setupState.theme);
      updateStartButtonState();
    });
  });

  playerInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.player = input.value as PlayerKey;

      updateSummary();
      updateStartButtonState();
    });
  });

  boardSizeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.boardSize = Number(input.value) as BoardSize;

      updateSummary();
      updateStartButtonState();
    });
  });

  startButton.addEventListener("click", () => {
    if (!isSetupComplete()) {
      return;
    }

    if (!setupState.player || !setupState.boardSize) {
      return;
    }

    renderGameScreen(
      app,
      {
        theme: setupState.theme,
        player: setupState.player,
        boardSize: setupState.boardSize,
      },
      {
        onExit: () => {
          renderHomeScreen(app);
        },
      },
    );
  });
}

function getRequiredElement<T extends HTMLElement>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
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
