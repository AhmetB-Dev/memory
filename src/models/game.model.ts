/** Theme ids that are allowed inside the game setup. */
export type ThemeKey = "coding" | "gaming" | "da-projects" | "foods";

/** The game currently supports two players. */
export type PlayerKey = "blue" | "orange";

/** Allowed board sizes. The value represents the total amount of cards. */
export type BoardSize = 16 | 24 | 36;

/** Selected settings that are required before a game can start. */
export type GameSetup = {
  theme: ThemeKey;
  player: PlayerKey;
  boardSize: BoardSize;
};

/** Callback actions that the game screen can trigger outside of its own module. */
export type GameScreenActions = {
  onExit: () => void;
};

/** Runtime state for one memory card on the board. */
export type MemoryCard = {
  id: number;
  pairId: number;
  image: string;
  backImage: string;
  isFlipped: boolean;
  isMatched: boolean;
};

/** Runtime score state for one player. */
export type Player = {
  id: PlayerKey;
  name: string;
  score: number;
};
