import type { MemoryCard } from "./card.model";
import type { DifficultyId } from "./difficulty.model";
import type { Player } from "./player.model";
import type { ThemeId } from "./theme.model";

export type GameStatus = "running" | "finished";

export interface GameState {
  status: GameStatus;
  players: Player[];
  selectedThemeId: ThemeId;
  selectedDifficultyId: DifficultyId;
  cards: MemoryCard[];
  currentPlayerIndex: number;
  flippedCardIds: number[];
  isBoardLocked: boolean;
  turnCount: number;
  timeLeft: number;
}
