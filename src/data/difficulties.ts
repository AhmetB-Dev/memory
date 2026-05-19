import type { Difficulty } from "../models/difficulty.model";

export const DIFFICULTIES: Difficulty[] = [
  {
    id: "easy",
    label: "Easy",
    rows: 2,
    columns: 4,
    pairs: 4,
  },
  {
    id: "medium",
    label: "Medium",
    rows: 4,
    columns: 4,
    pairs: 8,
  },
  {
    id: "hard",
    label: "Hard",
    rows: 4,
    columns: 6,
    pairs: 12,
  },
];
