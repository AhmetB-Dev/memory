# Memory Game

A browser-based memory card game built with **TypeScript** and **SCSS**.  
The project focuses on clean screen-based structure, reusable helpers, typed game state, dynamic templates, and theme-based styling.

## Overview

The game starts with a simple home screen. From there, the user can configure the game by choosing a visual theme, the starting player, and the board size. After the setup is complete, the memory board is generated dynamically and the two players take turns finding matching card pairs.

When all pairs are found, the game shows a temporary game-over screen and then displays the final result, including either the winner or a draw.

## Features

- Home screen with play button
- Setup screen with selectable game options
- Four visual themes:
  - Coding
  - Gaming
  - DA Projects
  - Foods
- Two-player mode with Blue and Orange player
- Selectable board sizes:
  - 16 cards
  - 24 cards
  - 36 cards
- Dynamic card generation based on the selected theme and board size
- Shuffled memory card pairs
- Turn-based player switching
- Score tracking for both players
- Match and no-match handling
- Board lock while cards are being compared
- Exit confirmation modal during the game
- Game-over transition screen
- Final result screen with winner or draw state
- Restart and home navigation from the result screen
- Modular TypeScript structure
- SCSS-based styling with separated screen and theme files

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Game logic, state handling, typed models, screen rendering |
| SCSS | Styling, layout, screen styles, theme styles |
| HTML Templates | Dynamic screen markup rendered through TypeScript |
| Vite or similar frontend tooling | Local development and project build |

## Project Structure

```text
src/
├── data/
│   └── themes.ts              # Theme configuration and image paths
├── models/
│   ├── game.model.ts          # Game-related TypeScript types
│   └── theme.model.ts         # Theme-related TypeScript interfaces
├── screens/
│   ├── home.screen.ts         # Home screen rendering and play button handling
│   ├── setup.screen.ts        # Game setup state and event handling
│   ├── setup.template.ts      # Setup screen HTML template
│   ├── game.screen.ts         # Main game logic and board interactions
│   ├── game.helpers.ts        # Reusable helper functions
│   ├── game.template.ts       # Game board HTML template
│   ├── result.screen.ts       # Result flow and button handling
│   └── result.template.ts     # Result screen HTML templates
├── styles/
│   ├── _base.scss             # Base styles
│   ├── _home.scss             # Home screen styles
│   ├── _setup.scss            # Setup screen styles
│   ├── _game.scss             # Game screen styles
│   ├── _result.scss           # Result screen styles
│   └── themes/                # Theme-specific SCSS files
├── styles.scss                # Main SCSS entry file
└── main.ts                    # Application entry point
```

## Game Flow

```text
Home Screen
    ↓
Setup Screen
    ↓
Game Screen
    ↓
Game Over Screen
    ↓
Result Screen
```

## How to Run the Project

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

> Note: The exact commands depend on the scripts defined in your `package.json`. The commands above are the common setup for a TypeScript frontend project using Vite or similar tooling.

## Main Implementation Details

### Typed game state

The game uses TypeScript types for the setup options, players, board sizes, memory cards, and screen actions. This keeps the game state predictable and reduces errors when passing data between screens.

### Dynamic theme system

All themes are configured in one central file. Each theme defines its name, CSS class, preview image, card-back image, and card-front images. This makes it easier to add new themes later without rewriting the game logic.

### Screen-based architecture

Each screen is separated into its own module. Rendering, event binding, and template generation are kept apart as much as possible, which makes the project easier to understand and maintain.

### Card matching logic

When a player selects two cards, the game checks whether both cards belong to the same pair. Matching pairs stay open and increase the current player's score. Non-matching cards are flipped back after a short delay, and the turn switches to the other player.

### Result handling

At the end of the game, the highest score is calculated. If both players have the same score, the result screen shows a draw. Otherwise, the player with the highest score is displayed as the winner.

## What I Learned

This project helped me practice important frontend development concepts, including:

- Structuring a TypeScript project into smaller modules
- Working with typed state and reusable helper functions
- Rendering dynamic HTML templates through TypeScript
- Handling user interaction with DOM events
- Managing game state without a framework
- Building a turn-based game flow
- Organizing SCSS by screens and themes
- Improving code readability through documentation and clear naming

## Possible Future Improvements

- Add sound effects for card flips, matches, and game-over state
- Add animations for matched cards
- Save high scores in local storage
- Add a single-player mode
- Add a timer or move counter
- Add difficulty levels
- Improve keyboard accessibility
- Add unit tests for helper functions and game logic

## Author

Created as a frontend learning project to practice TypeScript, SCSS, DOM manipulation, and clean project structure.
