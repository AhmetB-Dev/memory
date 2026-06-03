import type { GameSetup, MemoryCard, Player, PlayerKey, ThemeKey } from "../models/game.model";
import { getThemeById } from "../data/themes";

/**
 * Finds a required DOM element inside a parent node.
 *
 * This helper keeps the screen code clean and fails early when an expected element is missing.
 */
export function getRequiredElement<T extends HTMLElement>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}

/**
 * Replaces all template placeholders like {{name}} with their matching values.
 */
export function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((html, [key, value]) => html.split(`{{${key}}}`).join(String(value)), template);
}

/**
 * Creates both players and orders them by the selected starting player.
 */
export function createPlayers(startPlayer: PlayerKey): Player[] {
  const bluePlayer = createPlayer("blue", "Blue");
  const orangePlayer = createPlayer("orange", "Orange");

  return startPlayer === "blue" ? [bluePlayer, orangePlayer] : [orangePlayer, bluePlayer];
}

/**
 * Creates the shuffled memory card deck for the selected setup.
 */
export function createMemoryCards(setup: GameSetup): MemoryCard[] {
  const selectedTheme = getThemeById(setup.theme);
  const selectedImages = selectedTheme.cardImages.slice(0, setup.boardSize / 2);

  validateCardImages(setup, selectedTheme.cardImages.length);

  return shuffleCards(createCardPairs(selectedImages, selectedTheme.cardBackImage));
}

/**
 * Returns the correct current-player icon for the selected theme.
 */
export function getCurrentPlayerIcon(themeId: ThemeKey, playerId: PlayerKey): string {
  if (themeId === "coding") {
    return getCodingCurrentPlayerIcon(playerId);
  }

  return "assets/images/shared/chess_pawn_player.svg";
}

/**
 * Finds a player by id or throws an error when the player state is invalid.
 */
export function getPlayerById(players: Player[], playerId: PlayerKey) {
  const player = players.find((currentPlayer) => currentPlayer.id === playerId);

  if (!player) {
    throw new Error(`Player not found: ${playerId}`);
  }

  return player;
}

/** Creates a new player with an initial score of zero. */
function createPlayer(id: PlayerKey, name: string): Player {
  return { id, name, score: 0 };
}

/** Ensures the selected theme has enough card images for the selected board size. */
function validateCardImages(setup: GameSetup, availableCards: number) {
  const neededPairs = setup.boardSize / 2;

  if (availableCards < neededPairs) {
    throw new Error(`Not enough card images for ${setup.boardSize} cards.`);
  }
}

/** Converts a list of front images into matching memory-card pairs. */
function createCardPairs(images: string[], backImage: string) {
  return images.flatMap((image, index) => {
    const pairId = index + 1;

    return [createMemoryCard(pairId * 2 - 1, pairId, image, backImage), createMemoryCard(pairId * 2, pairId, image, backImage)];
  });
}

/** Creates the runtime state for one memory card. */
function createMemoryCard(id: number, pairId: number, image: string, backImage: string): MemoryCard {
  return { id, pairId, image, backImage, isFlipped: false, isMatched: false };
}

/** Returns the custom player label icon used by the coding theme. */
function getCodingCurrentPlayerIcon(playerId: PlayerKey): string {
  const playerIcons: Record<PlayerKey, string> = {
    blue: "assets/images/themes/coding/label_blue.svg",
    orange: "assets/images/themes/coding/label_orange.svg",
  };

  return playerIcons[playerId];
}

/** Randomizes the order of the generated cards. */
function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort(() => Math.random() - 0.5);
}
