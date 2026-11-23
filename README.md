# P Music

**Find your next feeling.**

P Music is a full-stack music discovery and streaming web app that makes discovering tracks, listening to music, and organising personal playlists simple and seamless. It combines a responsive, custom-designed interface with real-time music content and authenticated, database-backed libraries.

**Tech:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Audius API · Clerk · PostgreSQL (Neon) · Prisma 7

**Project status:** Core MVP features are implemented. Final testing, documentation, and production deployment are in progress.

## Features

- **Discover music:** Browse trending tracks and featured recommendations powered by the Audius API.
- **Search:** Find songs and artists and play tracks directly from search results.
- **Music player:** Play or pause, skip tracks, seek within a song, adjust volume, shuffle a queue, and choose repeat modes.
- **Continuous playback:** Keep the player and playback queue available while navigating between pages.
- **Personal library:** Save favourite tracks to your account and revisit them later.
- **Playlist management:** Create, rename, and delete playlists; add or remove songs; and play or shuffle a playlist.
- **Secure sign-in:** Authenticate with Clerk to access personal library features.
- **Responsive experience:** Dedicated layouts and controls for desktop and mobile, based on a custom Figma design.

## Screenshots

### Desktop Experience

#### Discover
![P Music Desktop Discover](docs/screenshots/desktop/discover.png)

#### Now Playing
![P Music Desktop Now Playing](docs/screenshots/desktop/now-playing.png)

#### Your Library
![P Music Desktop Library](docs/screenshots/desktop/library.png)

### Mobile Experience


### Mobile Experience

<div align="center">
  <table>
    <tr>
      <th align="center">Discover</th>
      <th align="center">Now Playing</th>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/screenshots/mobile/discover.png" width="260" alt="Mobile Discover"/>
      </td>
      <td align="center">
        <img src="docs/screenshots/mobile/now-playing.png" width="260" alt="Mobile Now Playing"/>
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th align="center">Your Library</th>
      <th align="center">Playlist Details</th>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/screenshots/mobile/library.png" width="260" alt="Mobile Library"/>
      </td>
      <td align="center">
        <img src="docs/screenshots/mobile/playlist.png" width="260" alt="Mobile Playlist"/>
      </td>
    </tr>
  </table>
</div>

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript | Pages, components, and application logic |
| Styling | Tailwind CSS 4 | Responsive layouts and reusable design styles |
| Music | Audius API | Trending tracks, search, track details, and audio streams |
| Authentication | Clerk | User authentication and identity |
| Database | Neon PostgreSQL | Persistent user, favourite, and playlist data |
| Data access | Prisma 7 + Neon adapter | Database models, migrations, and queries |
| Design | Figma | Interface design and responsive layouts |

## How It Works

P Music separates music delivery from personal user data:

1. **Audius** provides track information and audio streams for discovery, search, and playback.
2. **Clerk** authenticates users before they access saved library features.
3. **Next.js Server Actions** handle changes to favourites and playlists.
4. **Prisma and Neon PostgreSQL** store user records, saved tracks, playlists, and playlist membership.
5. **React context providers** coordinate the active track, playback queue, and audio controls across the app.

Music is streamed from Audius; P Music does not host the audio files.

## Getting Started

### Prerequisites

- Node.js compatible with Next.js 16 (Node.js 20.9 or later)
- npm
- A [Clerk](https://clerk.com/) application
- A [Neon](https://neon.tech/) PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/Sukhdeep-Singh-Panesar/p-music-app.git
cd p-music-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

Get the database connection string from Neon and the authentication keys from your Clerk dashboard. Replace the placeholders with your own values. **Never commit real credentials or your `.env` file.**

### 4. Apply database migrations

This project uses a custom Prisma CLI configuration named `prisma7.config.ts`:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
app/
├── actions/               # Server Actions for favourites and playlists
├── components/            # Player, navigation, track cards, and reusable UI
├── library/               # Saved tracks and playlists
├── now-playing/           # Current track experience
├── playlist/[playlistId]/ # Individual playlist pages
├── search/                # Music search
└── page.tsx               # Discover page
lib/                       # Authentication-aware database operations
prisma/                    # Schema and migrations
public/artwork/            # Music and playlist illustrations
public/icons/              # Interface and branding icons
docs/                      # Project notes and roadmap
```

## Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Current Status

The main discovery, playback, authentication, favourites, playlist management, and responsive UI flows are implemented. Before the production release, the remaining focus is on end-to-end checks, deployment configuration, and documentation. Automated tests and CI are potential future improvements.

## Notes

- Track availability and streaming behaviour depend on the Audius API.
- Personal library features require sign-in and a working PostgreSQL connection.
- The repository does not yet include a verified live demo link or application screenshots; these can be added after deployment and capture.

## Author

Built by [Sukhdeep Singh Panesar](https://github.com/Sukhdeep-Singh-Panesar) - Full-Stack Web Developer.
