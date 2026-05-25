import { renderSetupScreen } from "./setup.screen";
export function renderHomeScreen(app: HTMLDivElement) {
  app.innerHTML = `
    <section class="home-screen">
      <div class="home-screen__content">
        <p class="home-screen__subtitle">It’s play time.</p> 
        <h1 class="home-screen__title">Ready to play?</h1>
      </div>

      <button class="home-screen__play-button" type="button" id="play-button">
        <img 
          src="/assets/images/base/play-controller.svg"" 
          alt="" 
          class="home-screen__play-icon"
        />
        <span>Play</span>
        <span class="home-screen__arrow-bg"></span>
      </button>
    </section>
  `;

  const playButton = document.querySelector<HTMLButtonElement>("#play-button");

  if (!playButton) {
    throw new Error("Play button not found");
  }

  playButton.addEventListener("click", () => {
    renderSetupScreen(app);
  });
}
