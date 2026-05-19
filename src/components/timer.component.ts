interface RenderTimerOptions {
  timeLeft: number;
  turnCount: number;
}

export function renderTimerComponent(options: RenderTimerOptions): string {
  return `
    <section class="game-info">
      <div>
        <span class="label">Timer</span>
        <strong>${options.timeLeft}s</strong>
      </div>

      <div>
        <span class="label">Turns</span>
        <strong>${options.turnCount}</strong>
      </div>
    </section>
  `;
}
