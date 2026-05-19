import { renderHomeScreen } from "./home.screen";
import { renderGameScreen, type BoardSize, type PlayerKey, type ThemeKey } from "./game.screen";

type SetupState = {
  theme?: ThemeKey;
  player?: PlayerKey;
  boardSize?: BoardSize;
};

export function renderSetupScreen(app: HTMLDivElement) {
  const setupState: SetupState = {};

  app.innerHTML = `
    <section class="setup-screen">
      <button class="setup-screen__back-button" type="button" id="back-button">
        Back
      </button>

      <div class="setup-screen__layout">
        <div class="setup-screen__options">

          <div class="setup-group">
            <h2 class="setup-group__title">Game themes</h2>

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

          <div class="setup-group">
            <h2 class="setup-group__title">Choose player</h2>

            <label class="setup-option">
              <input type="radio" name="player" value="blue" />
              <span>Blue</span>
            </label>

            <label class="setup-option">
              <input type="radio" name="player" value="orange" />
              <span>Orange</span>
            </label>
          </div>

          <div class="setup-group">
            <h2 class="setup-group__title">Board size</h2>

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

        <div class="setup-screen__preview">
          <div class="setup-screen__preview-box">
            <p>Preview kommt später hier rein</p>
          </div>
        </div>
      </div>

      <div class="setup-screen__summary">
        <div class="setup-screen__summary-item">
          <strong id="summary-theme">Game theme</strong>
        </div>

        <img src="/assets/images/shared/Line 6.svg" alt="" />

        <div class="setup-screen__summary-item">
          <strong id="summary-player">Player</strong>
        </div>

        <img src="/assets/images/shared/Line 6.svg" alt="" />

        <div class="setup-screen__summary-item">
          <strong id="summary-board-size">Board size</strong>
        </div>

        <button class="setup-screen__start-button" type="button" id="start-button">
          <img 
            src="/assets/images/shared/smart_display.svg" 
            alt="" 
            class="setup-screen__start-icon" 
          />
          <span>Start</span>
        </button>
      </div>
    </section>
  `;

  const backButton = app.querySelector<HTMLButtonElement>("#back-button");
  const startButton = app.querySelector<HTMLButtonElement>("#start-button");

  const summaryTheme = app.querySelector<HTMLElement>("#summary-theme");
  const summaryPlayer = app.querySelector<HTMLElement>("#summary-player");
  const summaryBoardSize = app.querySelector<HTMLElement>("#summary-board-size");

  const themeInputs = app.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const playerInputs = app.querySelectorAll<HTMLInputElement>('input[name="player"]');
  const boardSizeInputs = app.querySelectorAll<HTMLInputElement>('input[name="boardSize"]');

  if (!backButton) {
    throw new Error("Back button not found");
  }

  if (!startButton) {
    throw new Error("Start button not found");
  }

  if (!summaryTheme || !summaryPlayer || !summaryBoardSize) {
    throw new Error("Summary elements not found");
  }

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

  backButton.addEventListener("click", () => {
    renderHomeScreen(app);
  });

  themeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setupState.theme = input.value as ThemeKey;
      updateSummary();

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
