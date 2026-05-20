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
};

export function renderResultScreen(
  app: HTMLDivElement,
  result: ResultScreenData,
  actions: ResultScreenActions,
) {
  const title = result.isTie ? "It's a tie!" : `${result.winners[0].name} wins!`;

  app.innerHTML = `
    <section class="result-screen">
      <p class="result-screen__subtitle">Game over</p>
      <h1 class="result-screen__title">${title}</h1>

      <div class="result-screen__scores">
        ${result.players
          .map((player) => {
            return `
              <div class="result-screen__score-card result-screen__score-card--${player.id}">
                <span>${player.name}</span>
                <strong>${player.score} Points</strong>
              </div>
            `;
          })
          .join("")}
      </div>

      <button class="result-screen__restart-button" type="button" id="restart-button">
        Restart
      </button>
    </section>
  `;

  const restartButton = app.querySelector<HTMLButtonElement>("#restart-button");

  if (!restartButton) {
    throw new Error("Restart button not found");
  }

  restartButton.addEventListener("click", () => {
    actions.onRestart();
  });
}
