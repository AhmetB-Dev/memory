/** Theme ids that can be used by the theme configuration. */
export type ThemeId = "coding" | "gaming" | "da-projects" | "foods";

/**
 * Static configuration for one visual game theme.
 *
 * The game uses this data to render the setup preview, card backs, card fronts,
 * and theme-specific CSS classes.
 */
export interface GameTheme {
  id: ThemeId;
  name: string;
  className: string;
  previewImage: string;
  cardBackImage: string;
  cardImages: string[];
}
