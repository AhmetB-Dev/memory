import { renderCardComponent } from "./card.component";
import type { MemoryCard } from "../models/card.model";
import type { GameTheme } from "../models/theme.model";

interface RenderBoardOptions {
  cards: MemoryCard[];
  theme: GameTheme;
  columns: number;
  isBoardLocked: boolean;
}

export function renderBoardComponent(options: RenderBoardOptions): string {
  return `
    <section
      class="memory-board"
      style="grid-template-columns: repeat(${options.columns}, minmax(60px, 1fr));"
    >
      ${options.cards
        .map((card) =>
          renderCardComponent({
            card,
            theme: options.theme,
            isBoardLocked: options.isBoardLocked,
          }),
        )
        .join("")}
    </section>
  `;
}
