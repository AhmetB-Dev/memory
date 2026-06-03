import { getRequiredElement } from "../shared/game.helpers";
import { renderSetupScreen } from "./setup.screen";

/**
 * Renders the first screen of the application.
 *
 * The home screen only contains the intro text and the play button.
 */
export function renderHomeScreen(app: HTMLDivElement) {
  app.innerHTML = HOME_SCREEN_TEMPLATE;
  bindPlayButton(app);
}

/** Opens the setup screen when the user clicks the play button. */
function bindPlayButton(app: HTMLDivElement) {
  getRequiredElement<HTMLButtonElement>(app, "#play-button").addEventListener("click", () => {
    renderSetupScreen(app);
  });
}

/** Static HTML for the home screen. */
const HOME_SCREEN_TEMPLATE = `
    <section class="home-screen">
      <div class="home-screen__content">
        <p class="home-screen__subtitle">It’s play time.</p> 
        <h1 class="home-screen__title">Ready to play?</h1>
      </div>

      <button class="home-screen__play-button" type="button" id="play-button">
        <img 
          src="assets/images/base/play-controller.svg" 
          alt="" 
          class="home-screen__play-icon"
        />
        <span>Play</span>
        <span class="home-screen__arrow-bg"></span>
      </button>
    </section>
  `;
