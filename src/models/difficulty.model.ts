export type DifficultyId = "easy" | "medium" | "hard";

export interface Difficulty {
  id: DifficultyId;
  label: string;
  rows: number;
  columns: number;
  pairs: number;
}
