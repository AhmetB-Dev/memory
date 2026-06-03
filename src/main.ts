import "./styles.scss";
import { renderHomeScreen } from "./screens/home.screen";

/** Root element where all screens are rendered. */
const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

// Start the application on the home screen.
renderHomeScreen(app);
