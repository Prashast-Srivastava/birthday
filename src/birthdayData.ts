import { BirthdayConfig, FriendshipStat, AnimeItem, MemoryItem } from './types';

export const birthdayConfig: BirthdayConfig = {
  recipientName: 'ANUSHKA',
  age: 22,
  birthdayDate: 'SEPTEMBER 15',
  targetCallsign: 'TARGET_ANUSHKA',
  friendshipLevel: 'MAX (OVERFLOW 9999+)',
  friendSinceYear: '2023',
  totalMemoriesCount: 8,
  questStatus: 'PROTOCOL ACTIVE // LEVEL UNLOCKED',
  finalLetter: {
    senderName: 'PRASHAST // SYSTEM OPERATOR',
    greeting: 'Heyyy birthday legend! 🎉',
    bodyParagraphs: [
      "Happy Birthday! Honestly, I'm really glad to have a friend like you. You're one of those people who can make everything feel a little more chill, even when life is being unnecessarily dramatic 😂.",
      "I hope this year brings you good vibes, good people, random adventures, lots of laughs, and absolutely zero unnecessary stress. You deserve all the happiness coming your way.",
      "Keep being your effortlessly cool, slightly chaotic, genuinely awesome self. Don't change too much—we like you this way 😌.",
      "Have an amazing birthday and enjoy your day to the fullest. Here's to another year of memories, inside jokes, and questionable decisions!",
      "Happy Birthday once again! 🥳❤️"
    ],
    signOff: 'Happy Birthday once again! 🥳❤️',
    fullMessage: `Heyyy birthday legend! 🎉

Happy Birthday! Honestly, I'm really glad to have a friend like you. You're one of those people who can make everything feel a little more chill, even when life is being unnecessarily dramatic 😂.

I hope this year brings you good vibes, good people, random adventures, lots of laughs, and absolutely zero unnecessary stress. You deserve all the happiness coming your way.

Keep being your effortlessly cool, slightly chaotic, genuinely awesome self. Don't change too much—we like you this way 😌.

Have an amazing birthday and enjoy your day to the fullest. Here's to another year of memories, inside jokes, and questionable decisions!

Happy Birthday once again! 🥳❤️`
  }
};

export const friendshipStats: FriendshipStat[] = [
  {
    label: 'CHAOS SYNCHRONIZATION',
    value: 98,
    displayValue: '98.7%',
    description: 'Shared braincell efficiency in multiplayer & life',
    color: 'amber'
  },
  {
    label: 'LATE NIGHT CO-OP HOURS',
    value: 95,
    displayValue: '1,420+ HRS',
    description: 'Discord calls past 3:00 AM talking about lore',
    color: 'pink'
  },
  {
    label: 'ANIME DEBATE INTENSITY',
    value: 88,
    displayValue: 'OVER 9000',
    description: 'Defending tier lists with mathematical precision',
    color: 'amber'
  },
  {
    label: 'LOYALTY & BACKUP HP',
    value: 100,
    displayValue: '100% (MAX)',
    description: 'Instant revive whenever a friend is in distress',
    color: 'green'
  }
];

export const animeArchiveData: AnimeItem[] = [
  {
    id: 'anime-slime',
    title: 'THAT TIME I GOT REINCARNATED AS A SLIME',
    japaneseTitle: '転生したらスライムだった件 (TENSEI SLIME)',
    genre: 'ISEKAI / CO-OP FANTASY',
    rating: 'S-TIER COMFORT MARATHON',
    quote: 'I am not a bad slime, slurp! Building our Tempest federation together.',
    imageUrl: ''
  },
  {
    id: 'anime-demon-slayer',
    title: 'DEMON SLAYER',
    japaneseTitle: '鬼滅の刃 (KIMETSU NO YAIBA)',
    genre: 'DARK FANTASY / UFOTABLE HYPE',
    rating: '10/10 GOD-TIER ANIMATION',
    quote: 'Set your heart ablaze! Never give up, no matter how tough the battle.',
    imageUrl: ''
  },
  {
    id: 'anime-dangers-heart',
    title: 'THE DANGERS IN MY HEART',
    japaneseTitle: '僕の心のヤバイやつ (BOKUYABA)',
    genre: 'PEAK ROMCOM / WHOLESOME SYNERGY',
    rating: 'S-TIER HEARTWARMING',
    quote: 'I want to protect this clumsy, precious bond at all costs.',
    imageUrl: ''
  },
  {
    id: 'anime-solo-leveling',
    title: 'SOLO LEVELING',
    japaneseTitle: '俺だけレベルアップな件 (ARISE)',
    genre: 'SYSTEM AWAKENING / ACTION',
    rating: 'SHADOW MONARCH LEVEL 22',
    quote: 'ARISE. Leveling up together through every raid and boss fight in life.',
    imageUrl: ''
  },
  {
    id: 'anime-aot',
    title: 'ATTACK ON TITAN',
    japaneseTitle: '進撃の巨人 (SHINGEKI NO KYOJIN)',
    genre: 'MASTERPIECE LORE / TACTICAL',
    rating: 'LEGENDARY PEAK FICTION',
    quote: 'Shinzo wo Sasageyo! Dedicating our hearts to another legendary year.',
    imageUrl: ''
  }
];

export const memoryDatabaseData: MemoryItem[] = [
  {
    id: 'mem-01',
    title: 'EPISODE_01',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_01'
  },
  {
    id: 'mem-02',
    title: 'EPISODE_02',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_02'
  },
  {
    id: 'mem-03',
    title: 'EPISODE_03',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_03'
  },
  {
    id: 'mem-04',
    title: 'EPISODE_04',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_04'
  },
  {
    id: 'mem-05',
    title: 'EPISODE_05',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_05'
  },
  {
    id: 'mem-06',
    title: 'EPISODE_06',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_06'
  },
  {
    id: 'mem-07',
    title: 'EPISODE_07',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_07'
  },
  {
    id: 'mem-08',
    title: 'EPISODE_08',
    date: 'YYYY.MM.DD',
    location: 'LOCATION_NAME',
    description: '',
    imageUrl: '',
    tag: 'SLOT_08'
  }
];

export const cyberpunkTelemetryQuotes: string[] = [
  'SYSTEM_STABLE: 98%',
  'CIPHER_KEY: 0x7F_ANUSHKA // SYNC_OK',
  'NEURAL_BRIDGE: DIVERGENCE 1.048596%',
  'MEM_BUFFER: OVERFLOW_PREVENTED',
  'GHOST_IN_SHELL: HEARTBEAT_DETECTED',
  'SYS_DAEMON: PURR_PROCESS_RUNNING',
  'QUANTUM_LORE: 404_ANOMALY_NOT_FOUND',
  'GRID_VOLTAGE: 1.21 GW // OPTIMAL',
  'SECTOR_07: FRIENDSHIP_PROTOCOL_ACTIVE',
  'DECRYPT_ROUTINE: BIRTHDAY_OVERRIDE_ENABLED',
  'NEKO_KERNEL: CAT_FOOD_CACHE_SECURED',
  'TIMELINE_ALPHA: PARTY_MODE_ENGAGED',
  'SYNAPSE_LINK: LATENCY 0.04ms // SYNERGY_MAX',
  'KERNEL_LOG: FRIENDSHIP_INTEGRITY_100%'
];

