import "./style.scss";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App element not found");
}

app.innerHTML = `
  <main class="app">
    <h1>Memory Game</h1>
    <p>Vite + TypeScript läuft.</p>
    <button id="start-game-button">Spiel starten</button>
  </main>
`;

const startButton = document.querySelector<HTMLButtonElement>("#start-game-button");

startButton?.addEventListener("click", () => {
  console.log("Spiel wird später gestartet");
});
