import type { GameSetup, MemoryCard, Player, PlayerKey, ThemeKey } from "../models/game.model";
import { getThemeById } from "../data/themes";

export function getRequiredElement<T extends HTMLElement>(parent: ParentNode, selector: string): T {
  const element = parent.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}

export function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((html, [key, value]) => html.split(`{{${key}}}`).join(String(value)), template);
}

export function createPlayers(startPlayer: PlayerKey): Player[] {
  const bluePlayer = createPlayer("blue", "Blue");
  const orangePlayer = createPlayer("orange", "Orange");

  return startPlayer === "blue" ? [bluePlayer, orangePlayer] : [orangePlayer, bluePlayer];
}

export function createMemoryCards(setup: GameSetup): MemoryCard[] {
  const selectedTheme = getThemeById(setup.theme);
  const selectedImages = selectedTheme.cardImages.slice(0, setup.boardSize / 2);

  validateCardImages(setup, selectedTheme.cardImages.length);

  return shuffleCards(createCardPairs(selectedImages, selectedTheme.cardBackImage));
}

export function getCurrentPlayerIcon(themeId: ThemeKey, playerId: PlayerKey): string {
  if (themeId === "coding") {
    return getCodingCurrentPlayerIcon(playerId);
  }

  return "assets/images/shared/chess_pawn_player.svg";
}

export function getPlayerById(players: Player[], playerId: PlayerKey) {
  const player = players.find((currentPlayer) => currentPlayer.id === playerId);

  if (!player) {
    throw new Error(`Player not found: ${playerId}`);
  }

  return player;
}

function createPlayer(id: PlayerKey, name: string): Player {
  return { id, name, score: 0 };
}

function validateCardImages(setup: GameSetup, availableCards: number) {
  const neededPairs = setup.boardSize / 2;

  if (availableCards < neededPairs) {
    throw new Error(`Not enough card images for ${setup.boardSize} cards.`);
  }
}

function createCardPairs(images: string[], backImage: string) {
  return images.flatMap((image, index) => {
    const pairId = index + 1;

    return [createMemoryCard(pairId * 2 - 1, pairId, image, backImage), createMemoryCard(pairId * 2, pairId, image, backImage)];
  });
}

function createMemoryCard(id: number, pairId: number, image: string, backImage: string): MemoryCard {
  return { id, pairId, image, backImage, isFlipped: false, isMatched: false };
}

function getCodingCurrentPlayerIcon(playerId: PlayerKey): string {
  const playerIcons: Record<PlayerKey, string> = {
    blue: "assets/images/themes/coding/label_blue.svg",
    orange: "assets/images/themes/coding/label_orange.svg",
  };

  return playerIcons[playerId];
}

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort(() => Math.random() - 0.5);
}
