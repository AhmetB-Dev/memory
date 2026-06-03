import type { BoardSize, MemoryCard, Player, ThemeKey } from "../models/game.model";
import { fillTemplate, getCurrentPlayerIcon } from "../shared/game.helpers";

/** Data required to render the active game screen. */
type GameTemplateData = {
  cards: MemoryCard[];
  currentPlayer: Player;
  boardSize: BoardSize;
  theme: ThemeKey;
  themeClassName: string;
};

/**
 * Creates the full HTML string for the game screen.
 *
 * The dynamic card HTML is generated separately and then inserted into the main screen template.
 */
export function createGameScreenHtml(data: GameTemplateData) {
  return fillTemplate(GAME_SCREEN_TEMPLATE, {
    themeClassName: data.themeClassName,
    currentPlayerId: data.currentPlayer.id,
    currentPlayerIcon: getCurrentPlayerIcon(data.theme, data.currentPlayer.id),
    currentPlayerName: data.currentPlayer.name,
    boardSize: data.boardSize,
    cardsHtml: data.cards.map(createCardHtml).join(""),
    exitModalHtml: EXIT_MODAL_TEMPLATE,
  });
}

/** Creates the HTML for one clickable memory card. */
function createCardHtml(card: MemoryCard) {
  return fillTemplate(CARD_TEMPLATE, {
    cardId: card.id,
    backImage: card.backImage,
    frontImage: card.image,
  });
}

/** Main layout for the active game screen. */
const GAME_SCREEN_TEMPLATE = `
 <section class="game-screen {{themeClassName}}">
  <header class="game-screen__dp">
    <div class="game-screen__header">
      <div class="game-screen__info-item game-screen__bg-pd">
    <div class="game-screen__player-score">
     <div
      class="game-screen__player-score-icon game-screen__player-score-icon--blue"
     aria-hidden="true"
    ></div>

     <span class="game-screen__player-score-blue-txt"></span>

  <strong id="blue-score">0</strong>
</div>

<div class="game-screen__player-score">
    <div
    class="game-screen__player-score-icon game-screen__player-score-icon--orange"
    aria-hidden="true"
    ></div>

  <span class="game-screen__player-score-orange-txt"></span>

     <strong id="orange-score">0</strong>
    </div>
      </div>

      <div class="game-screen__info-item">
        <span>Current player:</span>

        <div
          id="current-player-icon-box"
          class="game-screen__current-player-icon-box game-screen__current-player-icon-box--{{currentPlayerId}}"
        >
          <img
            id="current-player-icon"
            class="game-screen__current-player-icon"
            src="{{currentPlayerIcon}}"
            alt="{{currentPlayerName}} player"
          />
        </div>
      </div>

      <div class="game-screen__exit-content" id="exit-game-button">
        <div class="game-screen__exit-icon game-screen__exit-icon-size"></div>
        <button class="game-screen__exit-button" type="button" >Exit game</button>
      </div>
    </div>
  </header>

  <div class="game-screen__board game-screen__board--{{boardSize}}">
    {{cardsHtml}}
  </div>

  {{exitModalHtml}}
</section>
  `;

/** Template for one card with a front and back image. */
const CARD_TEMPLATE = `
 <button
  class="memory-card"
  type="button"
  data-card-id="{{cardId}}"
>
  <span class="memory-card__inner">
    <img
      src="{{backImage}}"
      alt="Memory card back"
      class="memory-card__image memory-card__image--back"
    />

    <img
      src="{{frontImage}}"
      alt="Memory card front"
      class="memory-card__image memory-card__image--front"
    />
  </span>
</button>
    `;

/** Confirmation modal that appears before the player leaves the current game. */
const EXIT_MODAL_TEMPLATE = `
  <div class="exit-modal" id="exit-modal" hidden>
    <div class="exit-modal__content">
      <h2>Are you sure you want to quit the game?</h2>

      <div class="exit-modal__actions">
        <button class="exit-modal__button" type="button" id="back-to-game-button">No, back to game</button>

        <button class="exit-modal__button exit-modal__button--danger" type="button" id="confirm-exit-button">
          Yes, quit game
        </button>
      </div>
    </div>
  </div>
  `;
