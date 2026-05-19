import "./styles.scss";
import { renderHomeScreen } from "./screens/home.screen";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

renderHomeScreen(app);
