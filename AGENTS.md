# Project Context & Agent Guidelines

## 1. Project Overview

**Name**: WBNBD (`wbnbd`, Wo Bang Ni Baidu, Let Me Baidu That For You)

**Goal**: Create a modern, open-source recreation of "Let Me Google That For You" (LMGTFY).

**Core Value**: A passive-aggressive but helpful tool to teach people how to use search engines.

### User Flows / Modes

The application has two distinct modes based on the URL query parameters:

1. Creation Mode (Default)
    - **Trigger**: User visits root `/` with no parameters.
    - **UI**: A clean, search-engine-style interface (Logo + Input + Button).
    - **Action**: User types a query and clicks "Get Link".
    - **Output**: The app generates a shareable URL (e.g., `/?q=how+to+code`).
    - **Feature**:
        - "Copy to clipboard" button appears after generation.
        - User can specify which search engine to use by specifying the URL template, like `https://my-search-engine.tld/search?q=@QUERY@`. The macro `@QUERY@` will be replaced by the URL-encoded query string. If not specified, default to Baidu.

2. Playback Mode
    - **Trigger**: User visits via a link like `/?q=search+term`.
    - **UI**: Same interface, but the user cannot interact immediately.
    - **Sequence**:
        1. **Cursor Entry**: An animated mouse cursor enters from the bottom/side.
        2. **Targeting**: Cursor moves smoothly to the search input.
        3. **Typing**: The query is typed out character-by-character (simulating human typing speed).
        4. **Click**: Cursor moves to the "Search" button and clicks.
        5. **Redirect**: The app redirects the user to the actual search engine results (Baidu/Custom).
    - **Captions**: Display step-by-step captions (e.g., "Step 1: Type your question...") during the sequence.

## 2. Tech Stack & Architecture

### Core Framework

- **Framework**: Next.js (App Router). Use `src/app` directory structure.
- **Language**: TypeScript (Strict mode enabled).
- **Styling**: Tailwind CSS for layout; Custom CSS modules or `framer-motion` for complex cursor animations.
- **Localization**: Use the packages in Next.js ecosystem.
- **Package Manager**: `pnpm`.

### Key Libraries (Recommended, not a strict requirement)

- `lucide-react`: For icons (clipboard, search icons).
- `nuqs`: For type-safe search query param management.

## 3. Coding Guidelines

### Principles

- KISS: This is a single-purpose app. Avoid over-engineering state management. React Context or local state is sufficient.
- Accessibility: The "Playback" mode must respect `prefers-reduced-motion`. If set, skip the animation and show the link immediately.
- SEO: Ensure proper Open Graph tags so the shared links look legit in Discord/Slack.

### Code Style

- Use Functional Components with named exports.
- Use `const` for definitions.
- No `any`. Define interfaces for all props and state.
- Use eslint and prettier for linting and formatting

## 4. Version Control (Jujutsu)

> [!CRITICAL]
> This repository uses **Jujutsu (jj)**, not standard Git commands.

- **DO NOT** use `git add`, `git commit`, or `git push`.
- **DO** use `jj` commands for all operations.

### Cheatsheet for Agents

- To snapshot work: Do nothing. (Jujutsu auto-snapshots).
- To save a distinct change: `jj commit -m 'Description of change'`
- To view history: `jj log -r ..`

> [!NOTE]
> If you (the Agent) need to run a shell command to save progress, prefer `jj commit`.

## 5. Implementation Roadmap

1. Scaffold: Setup project structure.
2. Creation Mode: Build the input form and URL generation logic.
3. Animation Engine: Create the `Cursor` component and the "Typing" effect hook.
4. Playback Mode: Wire up the query param to trigger the Animation Engine.
5. Redirect: Implement the final jump to the search engine.
6. Localization: Implement localization for at least English (`en`) and Chinese (`zh`).

> [!NOTE]
> There is a directory named `.agent/` at the project root for you (the Agent) to store temporary files. If you need persistent information across sessions of compactification, store them there and refer to them in follow-up prompts.
