import { Coordinate, Court, OpenGame, Player, RecentGame, Squad } from './types';

// Downtown Toronto; used for court search when location permission is denied or unavailable.
export const defaultLocation: Coordinate = { latitude: 43.6578, longitude: -79.4128 };

export const currentPlayer: Player = {
  id: 'me',
  name: 'Marcus Reed',
  handle: '@marcusgetsuckets',
  initials: 'MR',
  rating: 84,
  ratedGames: 50,
  reliability: 96,
  record: '38–12',
  wins: 38,
  accent: '#FF5A1F',
  online: true,
};

const players: Player[] = [
  { id: 'p1', name: 'Jay Thompson', handle: '@jayt', initials: 'JT', rating: 92, ratedGames: 72, reliability: 98, record: '64–8', wins: 64, accent: '#705CFF', online: true },
  { id: 'p2', name: 'Andre Lewis', handle: '@drelew', initials: 'AL', rating: 89, ratedGames: 66, reliability: 91, record: '51–15', wins: 51, accent: '#2489FF', online: true },
  { id: 'p3', name: 'Noah Williams', handle: '@noahw', initials: 'NW', rating: 87, ratedGames: 64, reliability: 94, record: '46–18', wins: 46, accent: '#26A36B' },
  { id: 'p4', name: 'Darius King', handle: '@dking', initials: 'DK', rating: 86, ratedGames: 62, reliability: 88, record: '43–19', wins: 43, accent: '#E848A1', online: true },
  { id: 'p5', name: 'Eli Brooks', handle: '@elib', initials: 'EB', rating: 82, ratedGames: 54, reliability: 90, record: '33–21', wins: 33, accent: '#C17B31' },
  // Still provisional: fewer than PROVISIONAL_GAMES confirmed games.
  { id: 'p6', name: 'Sam Patel', handle: '@samp', initials: 'SP', rating: 80, ratedGames: 7, reliability: 100, record: '5–2', wins: 5, accent: '#4B9A8B', online: true },
];

// Marcus's latest confirmed games, newest first. Each shows how much it moved his rating.
export const recentGames: RecentGame[] = [
  { id: 'r1', mode: '1v1', court: 'Christie Pits', result: 'W', score: '21–17', ratingChange: 2 },
  { id: 'r2', mode: '3v3', court: 'Christie Pits', result: 'W', score: '21–19', ratingChange: 1 },
  { id: 'r3', mode: '1v1', court: 'Stanley Park', result: 'L', score: '18–21', ratingChange: -1 },
  { id: 'r4', mode: '5v5', court: 'Trinity Bellwoods', result: 'W', score: '21–14', ratingChange: 3 },
  { id: 'r5', mode: '3v3', court: 'Stanley Park', result: 'L', score: '15–21', ratingChange: -2 },
];

export const friends = [players[1]!, players[2]!, players[3]!, players[5]!];

export const courts: Court[] = [
  {
    id: 'christie',
    name: 'Christie Pits Courts',
    neighborhood: 'Bloor & Christie',
    distance: '0.8 km',
    coordinate: { latitude: 43.6645, longitude: -79.4206 },
    currentPlayers: 18,
    courts: 3,
    activity: 'Hot',
    king: players[0]!,
    leaderboard: [players[0]!, players[1]!, currentPlayer, players[2]!, players[3]!],
  },
  {
    id: 'stanley',
    name: 'Stanley Park',
    neighborhood: 'King West',
    distance: '1.6 km',
    coordinate: { latitude: 43.6421, longitude: -79.4079 },
    currentPlayers: 9,
    courts: 2,
    activity: 'Active',
    king: players[1]!,
    leaderboard: [players[1]!, players[2]!, players[3]!, currentPlayer, players[4]!],
  },
  {
    id: 'trinity',
    name: 'Trinity Bellwoods',
    neighborhood: 'Queen West',
    distance: '2.1 km',
    coordinate: { latitude: 43.6474, longitude: -79.4138 },
    currentPlayers: 4,
    courts: 2,
    activity: 'Quiet',
    king: players[2]!,
    leaderboard: [players[2]!, players[0]!, players[4]!, players[3]!, currentPlayer],
  },
];

export const openGames: OpenGame[] = [
  { id: 'g1', host: players[3]!, mode: '3v3', court: 'Christie Pits', distance: '0.8 km', startsIn: '20 min', spots: 2, skillRange: '78–88 OVR', competitive: true },
  { id: 'g2', host: players[5]!, mode: '1v1', court: 'Stanley Park', distance: '1.6 km', startsIn: 'Now', spots: 1, skillRange: 'Any rating', competitive: false },
  { id: 'g3', host: players[1]!, mode: '5v5', court: 'Trinity Bellwoods', distance: '2.1 km', startsIn: '6:30 PM', spots: 3, skillRange: '82+ OVR', competitive: true },
];

export const squad: Squad = {
  id: 's1',
  name: 'Northside Five',
  mode: '3v3',
  wins: 12,
  losses: 4,
  members: [currentPlayer, players[2]!, players[5]!],
};
