# King of the Court — portfolio case study

## Project summary

King of the Court is a mobile product concept for coordinating local pickup basketball. It helps players find opponents, organize 2v2–5v5 squads, discover active courts, and build a reputation through verified results and court-specific rankings.

**Role:** Product concept, requirements, UX direction, and mobile prototype implementation  
**Platform:** iOS and Android through Expo/React Native  
**Technology:** React Native, TypeScript, Expo  
**Current stage:** Interactive front-end prototype

## The problem

Pickup basketball coordination is fragmented across group chats, social media, and chance encounters. Even when interested players exist nearby, four questions remain difficult to answer:

1. Who is ready to play?
2. Which court is active?
3. Is the matchup reasonably balanced?
4. Will the players and reported outcome be trustworthy?

The product opportunity is not simply a directory of courts. It is a trusted coordination layer connecting player identity, availability, teams, places, and competitive history.

## Product goals

- Reduce the effort required to find an appropriate game.
- Support both individual 1v1 competition and team formats.
- Make court activity useful without exposing precise continuous location.
- Create local identity through court rankings and crown challenges.
- Make competitive ratings understandable and difficult to manipulate.

## Experience design

The prototype is organized around five questions a player naturally asks:

- **Home:** What is happening around me?
- **Play:** Where can I find my next game?
- **Courts:** Which nearby courts are active, and who leads them?
- **Squad:** Who is on my team, and what format are we playing?
- **Profile:** What is my record, rating, and playing identity?

The visual system uses a dark court-inspired palette, high-contrast orange actions, compact competitive statistics, and repeated player-rating components to make the application feel energetic without sacrificing readability.

## Key product mechanics

### Geographic matchmaking

Games are filtered by format, distance, start time, available spots, and rating range. A production version would query indexed court locations rather than exposing player coordinates.

### Player ratings

The proposed rating system combines opponent-adjusted results with verified performance statistics. New players begin provisionally, repeat opponents produce diminishing rating effects, and every change appears in match history.

### Court presence

Presence is designed as an opt-in, expiring court check-in. Other users see an aggregated player count instead of an exact live map of individual people.

### The crown

Each court has a top-player leaderboard, but its King is a distinct title. The crown transfers only when a challenger defeats the incumbent in a match declared as a crown challenge before play begins.

## Technical approach

The prototype uses a small layered structure:

```text
App shell
├── Feature screens
├── Shared presentation components
├── Theme and design tokens
├── Typed domain models
└── Replaceable prototype data
```

Keeping `Player`, `Court`, `OpenGame`, and `Squad` models independent from their screens makes it possible to replace static fixtures with a backend service without redesigning the entire interface.

## Important trade-offs

### Custom navigation versus production routing

The initial prototype uses lightweight state-driven tab navigation to keep iteration fast. A production version would use Expo Router for deep links, nested flows, authentication guards, and reliable navigation history.

### Mock data versus premature backend work

Representative Toronto court data made it possible to validate the experience before committing to a database schema. The next prototype milestone is persistent local state, followed by authentication and a Postgres/PostGIS backend.

### Competitive depth versus trust

Detailed ratings are engaging, but unverified self-reported statistics are easy to manipulate. The product therefore prioritizes mutual confirmation, disputes, audit history, and bounded rating changes before advanced analytics.

## Current result

The result is a working interactive prototype covering the core discovery, squad, court, leaderboard, challenge, and player-profile experiences. It demonstrates the product direction and technical foundation but intentionally does not claim production authentication, live users, or real location data.

## What I learned

- Location products need privacy mechanics at the product-design stage, not as a later compliance task.
- A local marketplace depends on concentrated court-level participation more than total registrations.
- Competitive ratings are trust infrastructure as much as they are engagement features.
- Separating domain models from prototype fixtures makes UI experimentation faster without creating a dead-end codebase.
- Showing planned versus implemented functionality clearly makes a prototype more credible.

## Next steps

1. Add persistent local state and complete creation/result workflows.
2. Test the experience with basketball players around three to five Toronto courts.
3. Connect authentication, PostGIS court queries, and realtime presence.
4. Add reporting, blocking, result disputes, and privacy controls.
5. Distribute a focused TestFlight beta and measure repeat games, completion, and no-shows.
