
export interface Creator {
  name: string;
  handle: string;
  followers: number;
  imageUrl: string;
}

export interface LeaderboardEntry {
  alias: string;
  score: number;
  date: string;
}

export type Guess = 'higher' | 'lower';
export type GuessStatus = 'correct' | 'incorrect' | 'pending';
