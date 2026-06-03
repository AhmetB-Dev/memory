# Memory Game

A browser-based two-player memory card game built with **TypeScript**, **SCSS**, and a modular DOM structure.

This project was created as a learning project to practice important frontend development fundamentals. The focus is on TypeScript, DOM manipulation, typed state management, reusable helper functions, dynamic templates, and structured SCSS organization.

## Overview

The game starts with a home screen. After that, the user can choose different game options in the setup screen, such as the theme, the starting player, and the board size.

After the setup is completed, the game board is generated dynamically. Two players take turns trying to find matching card pairs. When all pairs have been found, the final result is displayed.

## Features

- Home screen with play button
- Setup screen with selectable options
- Four different themes:
  - Coding
  - Gaming
  - DA Projects
  - Foods

- Two-player mode
- Starting player selection
- Different board sizes:
  - 16 cards
  - 24 cards
  - 36 cards

- Dynamic card generation
- Randomly shuffled card pairs
- Score tracking for both players
- Player switching after non-matching cards
- Matching card detection
- Locked board while cards are being compared
- Exit confirmation during the game
- Result screen with winner or draw state
- Restart or return to home screen

## Technologies Used

| Technology     | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| TypeScript     | Game logic, types, state management, and DOM rendering |
| SCSS           | Styling, layouts, and theme-specific styles            |
| HTML Templates | Dynamic markup generation                              |
| Vite           | Development server and build tooling                   |

## Project Structure

```text
src/
├── data/
│   └── themes.ts              # Theme data and image paths
├── models/
│   ├── game.model.ts          # Types for game state, players, and cards
│   └── theme.model.ts         # Types and interfaces for themes
├── screens/
│   ├── home.screen.ts         # Home screen
│   ├── setup.screen.ts        # Setup logic
│   ├── setup.template.ts      # Setup template
│   ├── game.screen.ts         # Main game logic
│   ├── game.helpers.ts        # Reusable helper functions
│   ├── game.template.ts       # Game template
│   ├── result.screen.ts       # Result logic
│   └── result.template.ts     # Result template
├── styles/
│   ├── _base.scss             # Base styles
│   ├── _home.scss             # Home screen styles
│   ├── _setup.scss            # Setup screen styles
│   ├── _game.scss             # Game screen styles
│   ├── _result.scss           # Result screen styles
│   └── themes/                # Theme-specific styles
├── styles.scss                # Main SCSS file
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
Result Screen
```

## Getting Started

### Prerequisites

This project requires **Node.js** and **npm**.

Recommended:

- Node.js LTS version
- npm

### Installation

Install all dependencies first:

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

This command starts the local development server. The local URL will be shown in the terminal.

### Create Production Build

```bash
npm run build
```

This command creates an optimized production version of the project.

### Preview Production Build

```bash
npm run preview
```

This command previews the production build locally in the browser.

## Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm install`     | Installs all required dependencies    |
| `npm run dev`     | Starts the local development server   |
| `npm run build`   | Creates an optimized production build |
| `npm run preview` | Previews the production build locally |

> Note: These commands are based on the scripts defined in `package.json`. If the script names are changed, this section should be updated.

## Main Learning Goals

This project was used to practice the following topics:

- Structuring a TypeScript project into multiple modules
- Working with typed data structures
- Managing game state without a framework
- DOM manipulation with TypeScript
- Event handling
- Reusable helper functions
- Dynamic rendering of HTML templates
- Organizing SCSS files
- Building a simple two-player game flow
- Separating data, logic, templates, and styles

## Possible Improvements

The following features could be added or improved later:

- Sound effects for card flips, matches, and game over
- Animations for matched card pairs
- High score storage with Local Storage
- Single-player mode
- Timer or move counter
- Difficulty levels
- Better keyboard support
- Improved accessibility
- Tests for helper functions and game logic

## Limitations

This project intentionally focuses on frontend fundamentals. It currently does not include:

- Backend functionality
- User accounts
- Persistent game state storage
- Full keyboard support
- Automated tests

## Author

Created as a learning project to practice TypeScript, SCSS, DOM manipulation, and clean project structure.
