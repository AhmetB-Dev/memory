import type { MemoryCard } from "../models/card.model";
import type { GameTheme } from "../models/theme.model";

interface RenderCardOptions {
  card: MemoryCard;
  theme: GameTheme;
  isBoardLocked: boolean;
}

export function renderCardComponent(options: RenderCardOptions): string {
  const { card, theme, isBoardLocked } = options;

  const isVisible = card.isFlipped || card.isMatched;
  const imageSource = isVisible ? card.image : theme.cardBackImage;

  const cssClasses = [
    "memory-card",
    isVisible ? "memory-card--flipped" : "",
    card.isMatched ? "memory-card--matched" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = isBoardLocked || card.isMatched || card.isFlipped;

  return `
    <button
      class="${cssClasses}"
      type="button"
      data-card-id="${card.id}"
      ${isDisabled ? "disabled" : ""}
    >
      <img
        class="memory-card__image"
        src="${imageSource}"
        alt="${isVisible ? "Open card" : "Card back"}"
      />
    </button>
  `;
}
