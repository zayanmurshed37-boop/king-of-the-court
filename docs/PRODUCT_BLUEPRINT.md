# King of the Court product blueprint

## Core loop

1. A player creates an account and receives a provisional overall rating.
2. They add friends or discover similarly rated players nearby.
3. They join a 1v1 game or create a 2–5 player squad.
4. Both sides agree on a court and start time.
5. One side enters the final score; the other side confirms it with one tap.
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

The UI exposes an NBA 2K-style overall rating (OVR), but it only measures what pickup basketball can actually record: who won, confirmed by both sides. There are no attributes, archetypes, or box-score stats, because nobody keeps stats at a pickup run and self-reported numbers are easy to inflate.

- **Results only.** OVR comes from confirmed wins and losses with an opponent-adjusted (Glicko-style) rating, shown on a 40–99 scale. Beating a stronger player gains more; losing to a weaker one costs more.
- **Team games.** Compare the two teams' average ratings; every player on the winning side gains and every player on the losing side drops.
- **Provisional start.** New players start at 70 and show "PROV" for their first 10 confirmed games, while the rating moves faster to settle. Inactivity widens the rating's uncertainty instead of lowering the number.
- **Reliability is separate.** Attendance and result confirmations produce a reliability %, shown on the profile. Low reliability can block ranked games, but it never changes OVR.
- **Team OVR** is the average of the members' ratings.
- **Activity level (XP)** rewards playing, not winning, and is labelled so it isn't confused with skill.

Rating changes should be bounded per game, protected against repeat-opponent farming, and listed in the player's recent games so every change is explainable.

## Backend domains

- `profiles`: identity, rating and rating uncertainty, reliability, privacy preferences
- `friendships`: requested, accepted, blocked states
- `courts`: coordinates, amenities, verification state
- `court_presence`: expiring court-level check-ins
- `squads` and `squad_members`: rosters and captain permissions
- `games` and `game_participants`: mode, court, time, ranked/casual state
- `game_results`: final score, submitter, confirmations, disputes, and resulting rating changes
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
