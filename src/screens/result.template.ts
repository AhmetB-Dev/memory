import type { Player, ThemeKey } from "../models/game.model";
import { fillTemplate } from "../shared/game.helpers";

/** Creates the temporary game-over screen with the final scores. */
export function createGameOverHtml(theme: ThemeKey, bluePlayer: Player, orangePlayer: Player) {
  return fillTemplate(GAME_OVER_TEMPLATE, {
    theme,
    blueScore: bluePlayer.score,
    orangeScore: orangePlayer.score,
  });
}

/** Creates the final winner screen for the winning player. */
export function createWinnerHtml(theme: ThemeKey, winner: Player) {
  return fillTemplate(WINNER_TEMPLATE, {
    theme,
    winnerId: winner.id,
    winnerName: winner.name,
    confettiHtml: createConfettiHtml(theme),
    actionsHtml: RESULT_ACTIONS_TEMPLATE,
  });
}

/** Creates the final draw screen when both players have the same score. */
export function createDrawHtml(theme: ThemeKey) {
  return fillTemplate(DRAW_TEMPLATE, {
    theme,
    actionsHtml: RESULT_ACTIONS_TEMPLATE,
  });
}

/** Adds confetti only for the coding theme. */
function createConfettiHtml(theme: ThemeKey) {
  return theme === "coding" ? CONFETTI_TEMPLATE : "";
}

/** Temporary result screen shown before the final result. */
const GAME_OVER_TEMPLATE = `
    <section
      class="result-screen result-screen--{{theme}} result-screen--game-over"
      id="game-over-screen"
    >
      <h1 class="result-screen__title">GAME OVER</h1>

      <div class="result-screen__final-score">
        <p>Final score</p>

        <div class="result-screen__score-row">
          <span class="result-screen__score result-screen__score--blue">
            Blue {{blueScore}}
          </span>

          <span class="result-screen__score result-screen__score--orange">
            Orange {{orangeScore}}
          </span>
        </div>
      </div>
    </section>
  `;

/** Final result screen shown when one player wins. */
const WINNER_TEMPLATE = `
    <section class="result-screen result-screen--{{theme}} result-screen--winner result-screen--{{winnerId}}">
      {{confettiHtml}}

      <p class="result-screen__subtitle">The winner is</p>

      <h1 class="result-screen__title">
        {{winnerName}} Player
      </h1>

      <div
        class="result-screen__winner-image"
        role="img"
        aria-label="{{winnerName}} player"
      ></div>

      {{actionsHtml}}
    </section>
  `;

/** Final result screen shown when the game ends in a draw. */
const DRAW_TEMPLATE = `
    <section class="result-screen result-screen--{{theme}} result-screen--draw">
      <p class="result-screen__subtitle">It's a</p>

      <h1 class="result-screen__title">
        DRAW
      </h1>

      <div
        class="result-screen__draw-image"
        role="img"
        aria-label="Draw"
      ></div>

      {{actionsHtml}}
    </section>
  `;

/** Shared action buttons used by both final result screens. */
const RESULT_ACTIONS_TEMPLATE = `
    <div class="result-screen__actions">
      <button class="result-screen__button" type="button" id="restart-button">
        Restart
      </button>

      <button class="result-screen__button" type="button" id="home-button">
        Home
      </button>
    </div>
  `;

/** Decorative confetti image used by the coding theme winner screen. */
const CONFETTI_TEMPLATE = `
    <img
      class="result-screen__confetti"
      src="assets/images/themes/coding/Confetti.webp"
      alt=""
    />
  `;
