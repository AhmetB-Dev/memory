export type ResultPlayer = {
  id: "blue" | "orange";
  name: string;
  score: number;
};

type ResultScreenData = {
  players: ResultPlayer[];
  winners: ResultPlayer[];
  isTie: boolean;
};

type ResultScreenActions = {
  onRestart: () => void;
  onHome: () => void;
};

const GAME_OVER_DURATION_IN_MS = 2500;

export function renderResultScreen(
  app: HTMLDivElement,
  result: ResultScreenData,
  actions: ResultScreenActions,
) {
  const bluePlayer = getPlayerById(result.players, "blue");
  const orangePlayer = getPlayerById(result.players, "orange");

  let gameOverTimeoutId: number | undefined;

  renderGameOverScreen();

  gameOverTimeoutId = window.setTimeout(() => {
    renderFinalResultScreen();
  }, GAME_OVER_DURATION_IN_MS);

  function renderGameOverScreen() {
    app.innerHTML = `
      <section class="result-screen result-screen--game-over" id="game-over-screen">
        <h1 class="result-screen__title">GAME OVER</h1>

        <div class="result-screen__final-score">
          <p>Final score</p>

          <div class="result-screen__score-row">
            <span class="result-screen__score result-screen__score--blue">
              Blue ${bluePlayer.score}
            </span>

            <span class="result-screen__score result-screen__score--orange">
              Orange ${orangePlayer.score}
            </span>
          </div>
        </div>
      </section>
    `;

    const gameOverScreen = app.querySelector<HTMLElement>("#game-over-screen");

    if (!gameOverScreen) {
      throw new Error("Game over screen not found");
    }

    gameOverScreen.addEventListener("click", () => {
      if (gameOverTimeoutId !== undefined) {
        clearTimeout(gameOverTimeoutId);
        gameOverTimeoutId = undefined;
      }

      renderFinalResultScreen();
    });
  }

  function renderFinalResultScreen() {
    if (result.isTie) {
      renderDrawScreen();
      return;
    }

    renderWinnerScreen(result.winners[0]);
  }

  function renderWinnerScreen(winner: ResultPlayer) {
    app.innerHTML = `
      <section class="result-screen result-screen--winner result-screen--${winner.id}">
        <p class="result-screen__subtitle">The winner is</p>

        <h1 class="result-screen__title">
          ${winner.name} Player
        </h1>

        <div class="result-screen__winner-icon result-screen__winner-icon--${winner.id}">
          ${winner.id === "blue" ? "♟" : "♙"}
        </div>

        <div class="result-screen__actions">
          <button class="result-screen__restart-button" type="button" id="restart-button">
            Restart
          </button>

          <button class="result-screen__home-button" type="button" id="home-button">
            Home
          </button>
        </div>
      </section>
    `;

    bindResultButtons();
  }

  function renderDrawScreen() {
    app.innerHTML = `
      <section class="result-screen result-screen--draw">
        <p class="result-screen__subtitle">It's a</p>

        <h1 class="result-screen__title">
          DRAW
        </h1>

        <div class="result-screen__draw-icon">
          ⚖
        </div>

        <div class="result-screen__actions">
          <button class="result-screen__restart-button" type="button" id="restart-button">
            Restart
          </button>

          <button class="result-screen__home-button" type="button" id="home-button">
            Home
          </button>
        </div>
      </section>
    `;

    bindResultButtons();
  }

  function bindResultButtons() {
    const restartButton = app.querySelector<HTMLButtonElement>("#restart-button");
    const homeButton = app.querySelector<HTMLButtonElement>("#home-button");

    if (!restartButton || !homeButton) {
      throw new Error("Result buttons not found");
    }

    restartButton.addEventListener("click", () => {
      actions.onRestart();
    });

    homeButton.addEventListener("click", () => {
      actions.onHome();
    });
  }
}

function getPlayerById(players: ResultPlayer[], playerId: "blue" | "orange") {
  const player = players.find((currentPlayer) => {
    return currentPlayer.id === playerId;
  });

  if (!player) {
    throw new Error(`Player not found: ${playerId}`);
  }

  return player;
}
