import { DIFFICULTIES } from "../data/difficulties";
import { GAME_THEMES } from "../data/themes";
import type { MemoryCard } from "../models/card.model";
import type { DifficultyId } from "../models/difficulty.model";
import type { GameState } from "../models/game-state.model";
import type { Player } from "../models/player.model";
import type { ThemeId } from "../models/theme.model";
import { shuffleArray } from "../utils/shuffle";

export interface CreateGameStateOptions {
  players: Player[];
  selectedDifficultyId: DifficultyId;
  selectedThemeId: ThemeId;
}

export function createInitialGameState(options: CreateGameStateOptions): GameState {
  const difficulty = DIFFICULTIES.find((item) => item.id === options.selectedDifficultyId);

  const theme = GAME_THEMES.find((item) => item.id === options.selectedThemeId);

  if (!difficulty) {
    throw new Error(`Difficulty "${options.selectedDifficultyId}" not found.`);
  }

  if (!theme) {
    throw new Error(`Theme "${options.selectedThemeId}" not found.`);
  }

  if (theme.cardImages.length < difficulty.pairs) {
    throw new Error(`Theme "${theme.name}" needs at least ${difficulty.pairs} card images.`);
  }

  const selectedImages = theme.cardImages.slice(0, difficulty.pairs);

  const cardsBeforeShuffle: MemoryCard[] = selectedImages.flatMap((image, index) => {
    const pairId = index + 1;

    return [
      {
        id: pairId * 2 - 1,
        pairId,
        image,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: pairId * 2,
        pairId,
        image,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  const shuffledCards = shuffleArray(cardsBeforeShuffle);

  return {
    status: "running",
    players: options.players.map((player, index) => ({
      id: index + 1,
      name: player.name,
      score: 0,
    })),
    selectedDifficultyId: options.selectedDifficultyId,
    selectedThemeId: options.selectedThemeId,
    cards: shuffledCards,
    currentPlayerIndex: 0,
    flippedCardIds: [],
    isBoardLocked: false,
    turnCount: 0,
    timeLeft: 20,
  };
}
