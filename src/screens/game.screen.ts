import { GAME_THEMES } from "../data/themes";

export type ThemeKey = "coding" | "gaming" | "da-projects" | "foods";
export type PlayerKey = "blue" | "orange";
export type BoardSize = 16 | 24 | 36;

export type GameSetup = {
  theme: ThemeKey;
  player: PlayerKey;
  boardSize: BoardSize;
};

type MemoryCard = {
  id: number;
  pairId: number;
  image: string;
  backImage: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export function renderGameScreen(app: HTMLDivElement, setup: GameSetup) {
  const cards = createMemoryCards(setup);

  app.innerHTML = `
    <section class="game-screen">
      <header class="game-screen__header">
        <div>
          <p class="game-screen__subtitle">Memory Game</p>
          <h1 class="game-screen__title">Find all pairs</h1>
        </div>

        <button class="game-screen__exit-button" type="button" id="exit-game-button">
          Exit
        </button>
      </header>

      <div class="game-screen__info">
        <div class="game-screen__info-item">
          <span>Theme</span>
          <strong>${setup.theme}</strong>
        </div>

        <div class="game-screen__info-item">
          <span>Player</span>
          <strong>${setup.player}</strong>
        </div>

        <div class="game-screen__info-item">
          <span>Board size</span>
          <strong>${setup.boardSize} cards</strong>
        </div>
      </div>

      <div class="game-screen__board">
        ${cards
          .map((card) => {
            return `
              <button class="memory-card" type="button" data-card-id="${card.id}">
                <img 
                  src="${card.backImage}" 
                  alt="Memory card back" 
                  class="memory-card__image"
                />
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;

  const exitButton = app.querySelector<HTMLButtonElement>("#exit-game-button");
  const cardButtons = app.querySelectorAll<HTMLButtonElement>(".memory-card");

  if (!exitButton) {
    throw new Error("Exit game button not found");
  }

  exitButton.addEventListener("click", () => {
    console.log("Exit game clicked");
  });

  cardButtons.forEach((cardButton) => {
    cardButton.addEventListener("click", () => {
      const cardId = Number(cardButton.dataset.cardId);

      const clickedCard = cards.find((card) => card.id === cardId);

      if (!clickedCard) {
        throw new Error("Clicked card not found");
      }

      clickedCard.isFlipped = true;

      const image = cardButton.querySelector<HTMLImageElement>(".memory-card__image");

      if (!image) {
        throw new Error("Card image not found");
      }

      image.src = clickedCard.image;

      console.log("Clicked card:", clickedCard);
    });
  });
}

function createMemoryCards(setup: GameSetup): MemoryCard[] {
  const selectedTheme = GAME_THEMES.find((theme) => theme.id === setup.theme);

  if (!selectedTheme) {
    throw new Error(`Theme not found: ${setup.theme}`);
  }

  const neededPairs = setup.boardSize / 2;

  if (selectedTheme.cardImages.length < neededPairs) {
    throw new Error(
      `Not enough card images for ${setup.boardSize} cards. Needed: ${neededPairs}, available: ${selectedTheme.cardImages.length}`,
    );
  }

  const selectedImages = selectedTheme.cardImages.slice(0, neededPairs);

  const cards: MemoryCard[] = selectedImages.flatMap((image, index) => {
    const pairId = index + 1;

    return [
      {
        id: pairId * 2 - 1,
        pairId,
        image,
        backImage: selectedTheme.cardBackImage,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: pairId * 2,
        pairId,
        image,
        backImage: selectedTheme.cardBackImage,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return shuffleCards(cards);
}

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort(() => Math.random() - 0.5);
}
