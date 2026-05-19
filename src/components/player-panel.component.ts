import type { Player } from "../models/player.model";

interface RenderPlayerPanelOptions {
  players: Player[];
  currentPlayerIndex: number;
}

export function renderPlayerPanelComponent(options: RenderPlayerPanelOptions): string {
  return `
    <section class="player-panel">
      ${options.players
        .map((player, index) => {
          const isActive = index === options.currentPlayerIndex;

          return `
            <article class="player-card ${isActive ? "player-card--active" : ""}">
              <strong>${player.name}</strong>
              <span>${player.score} Points</span>
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}
