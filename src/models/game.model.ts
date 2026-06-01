export type ThemeKey = "coding" | "gaming" | "da-projects" | "foods";
export type PlayerKey = "blue" | "orange";
export type BoardSize = 16 | 24 | 36;

export type GameSetup = {
  theme: ThemeKey;
  player: PlayerKey;
  boardSize: BoardSize;
};

export type GameScreenActions = {
  onExit: () => void;
};

export type MemoryCard = {
  id: number;
  pairId: number;
  image: string;
  backImage: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type Player = {
  id: PlayerKey;
  name: string;
  score: number;
};
