# versteckis.ch

A playful browser-based hide and seek interaction - adding a fun, hacker-themed twist to an otherwise empty webpage.

## Project Overview

The project turns a blank webpage into an interactive experience with a retro-tech aesthetic. Visitors engage with a hidden button that reveals itself based on cursor proximity, accompanied by Matrix-inspired visuals and hacker-themed messages. It's not a game in the traditional sense, but rather an engaging way to make an empty page more interesting.

### Key Features

- Matrix-inspired visual effects
- Proximity-based interaction
- Dynamic visual feedback with colors and glitch effects
- Retro-tech themed messages
- Responsive design for both desktop and mobile

## Project Structure

```
src/
├── app/                    # Next.js App Router and global styles
├── components/            
│   └── HideAndSeek/       # Main game components
│       ├── index.tsx      # Main game logic
│       ├── ClientContent.tsx    # UI component for active game
│       ├── MessageItem.tsx      # Individual message display
│       ├── SplashScreen.tsx     # Start screen
│       └── StaticLayout.tsx     # Static layout for SSR
├── hooks/                 # Custom React Hooks
│   ├── useGameState.ts    # Game state and logic
│   ├── useMessages.ts     # Message management
│   └── usePosition.ts     # Button positioning
├── types/                 # TypeScript definitions
│   └── game.ts           
├── utils/                 # Helper functions
│   ├── matrix.ts          # Matrix effect generation
│   └── proximity.ts       # Proximity calculations
└── data/                  # Static data
    └── messages.ts        # Game messages
```

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- CSS Animations

## Development

1. Clone repository
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Architecture

The project follows a clear separation of concerns:

- **Components**: Pure UI components that receive and render props
- **Hooks**: State management and business logic
- **Utils**: Pure functions for calculations and transformations
- **Types**: Central TypeScript definitions
- **Data**: Static content

## Performance

- Lazy loading for matrix effects
- Optimized animations using CSS transforms
- Efficient state management through custom hooks
- SSR-compatible through client/server separation
