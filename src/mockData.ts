import { Court, OpenGame, Player, Squad } from './types';

export const currentPlayer: Player = {
  id: 'me',
  name: 'Marcus Reed',
  handle: '@marcusgetsuckets',
  initials: 'MR',
  rating: 84,
  archetype: '2-Way Shot Creator',
  record: '38–12',
  wins: 38,
  accent: '#FF5A1F',
  online: true,
};

const players: Player[] = [
  { id: 'p1', name: 'Jay Thompson', handle: '@jayt', initials: 'JT', rating: 92, archetype: 'Floor General', record: '64–8', wins: 64, accent: '#705CFF', online: true },
  { id: 'p2', name: 'Andre Lewis', handle: '@drelew', initials: 'AL', rating: 89, archetype: '3-Level Scorer', record: '51–15', wins: 51, accent: '#2489FF', online: true },
  { id: 'p3', name: 'Noah Williams', handle: '@noahw', initials: 'NW', rating: 87, archetype: 'Lockdown Defender', record: '46–18', wins: 46, accent: '#26A36B' },
  { id: 'p4', name: 'Darius King', handle: '@dking', initials: 'DK', rating: 86, archetype: 'Inside-Out Threat', record: '43–19', wins: 43, accent: '#E848A1', online: true },
  { id: 'p5', name: 'Eli Brooks', handle: '@elib', initials: 'EB', rating: 82, archetype: 'Glass Cleaner', record: '33–21', wins: 33, accent: '#C17B31' },
  { id: 'p6', name: 'Sam Patel', handle: '@samp', initials: 'SP', rating: 80, archetype: 'Sharpshooter', record: '28–22', wins: 28, accent: '#4B9A8B', online: true },
];

export const friends = [players[1]!, players[2]!, players[3]!, players[5]!];

export const courts: Court[] = [
  {
    id: 'christie',
    name: 'Christie Pits Courts',
    neighborhood: 'Bloor & Christie',
    distance: '0.8 km',
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
    currentPlayers: 9,
    courts: 2,
    activity: 'Active',
    king: players[1]!,
    leaderboard: [players[1]!, players[2]!, players[3]!, currentPlayer, players[5]!],
  },
  {
    id: 'trinity',
    name: 'Trinity Bellwoods',
    neighborhood: 'Queen West',
    distance: '2.1 km',
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
