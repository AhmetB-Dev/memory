import type { ThemeKey } from "../models/game.model";
import { fillTemplate } from "../shared/game.helpers";
import { getThemeById } from "../data/themes";

/** Divider image used before the setup is complete. */
export const DEFAULT_DIVIDER_IMAGE = "assets/images/setting/summary-divider.svg";

/** Divider image used after all required setup options are selected. */
export const COMPLETE_DIVIDER_IMAGE = "assets/images/setting/Line.svg";

/**
 * Creates the complete setup-screen HTML.
 *
 * The default theme preview is inserted dynamically so the initial preview stays in sync with the selected default theme.
 */
export function createSetupScreenHtml(defaultThemeId: ThemeKey) {
  const defaultTheme = getThemeById(defaultThemeId);

  return fillTemplate(SETUP_SCREEN_TEMPLATE, {
    previewImage: defaultTheme.previewImage,
    previewAlt: `${defaultTheme.name} preview`,
    dividerImage: DEFAULT_DIVIDER_IMAGE,
  });
}

/** Static layout for the setup screen. */
const SETUP_SCREEN_TEMPLATE = `
    <section class="setup-screen">
      <div class="setup-screen__content">
        <div class="setup-screen__layout">
          <div class="setup-screen__header">
            <h1 class="setup-screen__title">Settings</h1>
            <img src="assets/images/setting/arrow-line-long.svg" alt="" />
          </div>

          <div class="setup-screen__options">
            <div class="setup-group">
              <div class="setup-group__icon">
                <img src="assets/images/setting/palette.svg" alt="" />
              </div>

              <div class="setup-group__content">
                <h2>Game themes</h2>

                <label class="setup-option" data-theme-option="coding">
                  <input type="radio" name="theme" value="coding" checked />
                  <span>Code vibes theme</span>
                </label>

                <label class="setup-option" data-theme-option="gaming">
                  <input type="radio" name="theme" value="gaming" />
                  <span>Gaming theme</span>
                </label>

                <label class="setup-option" data-theme-option="da-projects">
                  <input type="radio" name="theme" value="da-projects" />
                  <span>DA Projects theme</span>
                </label>

                <label class="setup-option" data-theme-option="foods">
                  <input type="radio" name="theme" value="foods" />
                  <span>Foods theme</span>
                </label>
              </div>
            </div>

            <div class="setup-group">
              <div class="setup-group__icon">
                <img src="assets/images/setting/chess_pawn.svg" alt="" />
              </div>

              <div class="setup-group__content">
                <h2>Choose player</h2>

                <label class="setup-option">
                  <input type="radio" name="player" value="blue" />
                  <span>Blue</span>
                </label>

                <label class="setup-option">
                  <input type="radio" name="player" value="orange" />
                  <span>Orange</span>
                </label>
              </div>
            </div>

            <div class="setup-group">
              <div class="setup-group__icon">
                <img src="assets/images/setting/card.svg" alt="" />
              </div>

              <div class="setup-group__content">
                <h2>Board size</h2>

                <label class="setup-option">
                  <input type="radio" name="boardSize" value="16" />
                  <span>16 cards</span>
                </label>

                <label class="setup-option">
                  <input type="radio" name="boardSize" value="24" />
                  <span>24 cards</span>
                </label>

                <label class="setup-option">
                  <input type="radio" name="boardSize" value="36" />
                  <span>36 cards</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="setup-screen__dp-flex">
          <div class="setup-screen__theme-preview">
            <div class="setup-screen__theme-preview-card">
              <img
                id="theme-preview-image"
                class="setup-screen__theme-preview-image"
                src="{{previewImage}}"
                alt="{{previewAlt}}"
              />
            </div>
          </div>

          <div class="setup-screen__summary">
            <div>
              <div class="setup-screen__summary-content" id="summary-content">
                <div class="setup-screen__summary-item">
                  <span id="summary-theme">Code vibes theme</span>
                </div>

                <img
                  class="setup-screen__decoration-icon"
                  data-summary-divider
                  src="{{dividerImage}}"
                  alt=""
                />

                <div class="setup-screen__summary-item">
                  <span id="summary-player">Player</span>
                </div>

                <img
                  class="setup-screen__decoration-icon"
                  data-summary-divider
                  src="{{dividerImage}}"
                  alt=""
                />

                <div class="setup-screen__summary-item">
                  <span id="summary-board-size">Board size</span>
                </div>

                <button
                  class="setup-screen__start-button"
                  type="button"
                  id="start-button"
                  disabled
                >
                  <img
                    src="assets/images/setting/start-icon.svg"
                    alt=""
                    class="setup-screen__start-icon"
                  />
                  <span>Start</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
