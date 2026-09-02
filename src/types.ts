export enum ScreenIndex {
  BOOT = 0,
  HERO = 1,
  STATS = 2,
  ANIME = 3,
  MEMORIES = 4,
  MINIGAME = 5,
  CAKE = 6,
  FINAL_MESSAGE = 7,
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  description: string;
  imageUrl?: string;
  tag?: string;
  glitchSecret?: string;
}

export interface FriendshipStat {
  label: string;
  value: number; // 0-100%
  displayValue: string;
  description: string;
  color?: 'cyan' | 'pink' | 'green' | 'amber';
}

export interface AnimeItem {
  id: string;
  title: string;
  japaneseTitle?: string;
  genre: string;
  rating: string;
  sharedFavoriteEpisode?: string;
  quote: string;
  imageUrl?: string;
}

export interface BirthdayConfig {
  recipientName: string;
  age?: number;
  birthdayDate: string;
  targetCallsign: string;
  friendshipLevel: string;
  friendSinceYear: string;
  totalMemoriesCount: number;
  questStatus: string;
  finalLetter: {
    senderName?: string;
    greeting?: string;
    bodyParagraphs?: string[];
    signOff?: string;
    fullMessage: string;
  };
}
