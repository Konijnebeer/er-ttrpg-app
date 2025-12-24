# Ruins Sheet App - Planning Document

## Table of Contents
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Code Architecture](#code-architecture)
- [Feature Roadmap](#feature-roadmap)


## Tech Stack
- **Vite**: For fast development and build tooling.
- **Tanstack Router**: For routing and navigation.
- **React**: For building user interfaces.

- **Tailwind CSS**: For utility-first CSS styling.
- **ShadCN UI**: For UI components and styling.

- **TypeScript**: For type safety and modern JavaScript features.
- **Zod**: For schema validation and data parsing.
- **Prettier**: For code formatting.

- **IDB**: For IndexedDB interactions and local storage.
- **Zustand**: For state management.
- **Semver**: For version management and compatibility checks.
- **Tanstack Form**: For form handling and validation.
---

## File Structure

```
src/
├── components/
│   └── ui/                      # ShadCN components
├── lib/
│   ├── utils.ts                 # ShadCN helper utilities
│   ├── constants.ts             # Database constants
│   └── versioningHelper.ts      # Version parsing utilities
├── routes/
│   ├── sources/
│   │   ├── index.tsx            # Source list view
│   │   ├── $sourceId/
│   │   │   ├── 
│   │   ├── preview.tsx          # Source detail view
│   │   ├── edit.tsx             # Source editor
│   │   ├── new.tsx              # Create new source
│   │   ├── import.tsx           # Import source
│   │   └── export.tsx           # Export source
│   ├── character/
│   │   ├── index.tsx            # Character list view
│   │   ├── preview.tsx          # Character detail view
│   │   ├── edit.tsx             # Character editor
│   │   ├── new.tsx              # Create new character
│   │   ├── import.tsx           # Import character
│   │   └── export.tsx           # Export character
│   ├── __root.tsx               # Root layout
│   ├── tests/                   # Test routes
│   └── index.tsx                # Home/dashboard
├── store/
│   ├── characterStore.ts        # Character state management
│   └── sourceStore.ts           # Source state management
├── types/
│   ├── character.ts             # Character type definitions
│   └── source.ts                # Source type definitions
├── database/
│   ├── characterDB.ts           # Character database operations
│   └── sourceDB.ts              # Source database operations
├── main.tsx                     # App entry point
└── styles.css                   # Global styles
docs/
└── plan.md                      # This file
public/
└── sources/
    ├── manifest.json            # Source manifest
    └── alpha-handbook-0.0.1.json  # Core rules source
```

### Sources structure

/sources [Show all sources, in cards, multiple versions form a visual stack]
  - Entire card is clickable -> *preview*
/sources/source-id/preview [has a drop down to switch to diffrent versions]
  - See the highest version by default select a version from dropdown
/sources/source-id/preview/version [ Same file just optional *token* ]
/sources/new [ Create new source fill in Metadata + creator ]
/sources/source-key/edit
/sources/import [ Import from json or cop paste into text box, full validation, show what dependencies are needed, first ask to import those ]
/sources/source-key/export [ Export homebrew into Json `name-version.json` convention ]

---

## Code Architecture

## Roadmap