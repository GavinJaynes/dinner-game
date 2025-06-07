# 🍽️ Dinner Decision Game

A fun turn-based game to help couples/roommates decide what to eat! Built with TypeScript and Vite.

## 🚀 Quick Start

```bash
# Create the project
npm create vite@latest dinner-game -- --template vanilla-ts
cd dinner-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Then replace the default files with the TypeScript versions provided.

## 🎮 How to Play

1. **Both players select** a dinner option from their cards
2. **Selections are hidden** - you can't see what the other person picked!
3. **Hit "Reveal Cards"** for a dramatic countdown and reveal
4. **Match = Victory!** If you both picked the same thing, dinner is decided! 🎉
5. **No match?** Try again! (You can't pick the same card twice in a row)

## 🏗️ Project Structure

```
dinner-game/
├── index.html          # Main HTML page
├── main.ts            # Application entry point
├── style.css          # All game styles
├── game/
│   ├── types.ts       # TypeScript type definitions
│   ├── gameState.ts   # Game state management
│   ├── DinnerGame.ts  # Main game controller
│   └── animations.ts  # Dramatic reveal animations
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types without building

## ✨ Features

- **30+ Dinner Options** - From burgers to "cereal for dinner" 
- **Dramatic Reveals** - Countdown, animations, and celebration effects
- **Smart Rules** - Can't pick the same option twice in a row
- **Responsive Design** - Works great on phones and desktops
- **Type-Safe** - Full TypeScript support with strict mode
- **Clean Architecture** - Modular, maintainable code structure

## 🛠️ Tech Stack

- **TypeScript** - Type-safe JavaScript with excellent DX
- **Vite** - Lightning-fast build tool and dev server
- **Vanilla CSS** - Clean, modern styling with animations
- **ES6 Modules** - Clean imports/exports structure

## 🎯 Next Steps

Want to extend the game? The modular structure makes it easy to:

- Add new dinner categories or themed card packs
- Create different game modes (3+ players, timed rounds)
- Add sound effects and more animations
- Build multiplayer with WebSockets
- Add user accounts and game history
- Convert to a PWA for mobile installation

## 🤝 Contributing

The code is clean, well-typed, and ready for contributions! Each module has a single responsibility and clear interfaces.