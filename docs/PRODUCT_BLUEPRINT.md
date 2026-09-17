# King of the Court product blueprint

## Core loop

1. A player creates an account and receives a provisional overall rating.
2. They add friends or discover similarly rated players nearby.
3. They join a 1v1 game or create a 2–5 player squad.
4. Both sides agree on a court and start time.
5. The game is confirmed by both captains; stats and the result are submitted.
6. The server updates player ratings, court standings, and any crown change.

## Important product rules

- Overall ratings are calculated on the server, never on the device.
- Competitive games require mutual result confirmation or a trusted scorekeeper.
- Location is opt-in and displayed as court-level presence, not exact player coordinates.
- Court presence expires automatically after a short period unless refreshed.
- A court's King is the highest eligible 1v1 player who has won a direct crown challenge.
- The crown does not transfer through ordinary games; the match must be marked as a crown challenge before tip-off.
- A minimum number of verified games should be required before a player enters a top-10 leaderboard.

## Rating framework

The UI exposes an NBA 2K-style overall rating, but the first production algorithm should stay legible:

- 55% verified win/loss performance, adjusted for opponent strength
- 25% efficiency statistics appropriate to game mode
- 10% teammate/opponent sportsmanship confirmation
- 10% activity and recency, with a conservative decay cap

Use different stat weights for 1v1 and team games. Rating changes should be bounded per game, protected against repeat-opponent farming, and auditable from a player's match history.

## Backend domains

- `profiles`: identity, rating, archetype, privacy preferences
- `friendships`: requested, accepted, blocked states
- `courts`: coordinates, amenities, verification state
- `court_presence`: expiring court-level check-ins
- `squads` and `squad_members`: rosters and captain permissions
- `games` and `game_participants`: mode, court, time, ranked/casual state
- `game_results` and `player_game_stats`: confirmation and rating inputs
- `court_rankings`: materialized leaderboard results
- `crown_challenges`: challenger, incumbent, scheduled game, outcome

## Trust and safety

Before public launch, add blocking/reporting, location privacy, age gates, moderation, injury disclaimers, no-show handling, result disputes, and rate limits. For minors, exact location and direct messaging need additional safeguards.

## Delivery phases

### Phase 1 — playable MVP

Authentication, profiles, friend requests, court directory, check-ins, open games, squads, and mutually confirmed results.

### Phase 2 — competitive layer

Server-side ratings, match history, top-10 court rankings, crown challenges, anti-abuse rules, and push notifications.

### Phase 3 — community layer

Court photos and details, organized events, seasonal ladders, badges, richer stats, and trusted scorekeepers.
