import type { Player } from "../models/player.model";
import { renderHomeScreen } from "./home.screen";

interface ResultScreenOptions {
  winners: Player[];
}

export function renderResultScreen(app: HTMLDivElement, options: ResultScreenOptions): void {
  const isDraw = options.winners.length > 1;

  app.innerHTML = `
    <main class="screen result-screen">
      <section class="result-card">
        <p class="result-card__eyebrow">Game Over</p>

        ${isDraw ? `<h1>Draw</h1>` : `<h1>${options.winners[0].name} wins!</h1>`}

        <div class="result-score-list">
          ${options.winners
            .map((winner) => {
              return `
                <p>
                  <strong>${winner.name}</strong>
                  ${winner.score} Points
                </p>
              `;
            })
            .join("")}
        </div>

        <button class="button button--primary" id="back-home-button">
          Back Home
        </button>
      </section>
    </main>
  `;

  const backButton = document.querySelector<HTMLButtonElement>("#back-home-button");

  if (!backButton) {
    throw new Error("Back home button not found.");
  }

  backButton.addEventListener("click", () => {
    renderHomeScreen(app);
  });
}
