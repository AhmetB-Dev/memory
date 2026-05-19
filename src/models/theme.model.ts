export type ThemeId = "coding" | "gaming" | "da-projects" | "foods";

export interface GameTheme {
  id: ThemeId;
  name: string;
  className: string;
  previewImage: string;
  cardBackImage: string;
  cardImages: string[];
}
