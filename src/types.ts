export type GameMode = '1v1' | '2v2' | '3v3' | '4v4' | '5v5';

export interface Player {
  id: string;
  name: string;
  handle: string;
  initials: string;
  rating: number;
  archetype: string;
  record: string;
  wins: number;
  accent: string;
  online?: boolean;
}

export interface Court {
  id: string;
  name: string;
  neighborhood: string;
  distance: string;
  currentPlayers: number;
  courts: number;
  activity: 'Quiet' | 'Active' | 'Hot';
  king: Player;
  leaderboard: Player[];
}

export interface OpenGame {
  id: string;
  host: Player;
  mode: GameMode;
  court: string;
  distance: string;
  startsIn: string;
  spots: number;
  skillRange: string;
  competitive: boolean;
}

export interface Squad {
  id: string;
  name: string;
  mode: GameMode;
  wins: number;
  losses: number;
  members: Player[];
}
