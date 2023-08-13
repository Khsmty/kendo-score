type SettingsData = {
  playerCount: number;
  playerTitles: string[];
  daihyo: boolean;
};

export const initSettingsData: SettingsData = {
  playerCount: 5,
  playerTitles: ['先鋒', '次鋒', '中堅', '副将', '大将'],
  daihyo: true,
};

type PlayersData = {
  red: {
    name: string;
    players: { name: string; first: boolean }[];
    daihyo: { name: string; first: boolean };
  };
  white: {
    name: string;
    players: { name: string; first: boolean }[];
    daihyo: { name: string; first: boolean };
  };
};

export const initPlayersData: PlayersData = {
  red: {
    name: '',
    players: [],
    daihyo: { name: '', first: false },
  },
  white: {
    name: '',
    players: [],
    daihyo: { name: '', first: false },
  },
};

type ScoreData = {
  playing: number;
  score: {
    red: string[][];
    white: string[][];
  };
  hansoku: {
    red: boolean[];
    white: boolean[];
  };
  daihyo: {
    score: {
      red: string;
      white: string;
    };
    hansoku: {
      red: boolean;
      white: boolean;
    };
  };
  ippons: {
    red: number;
    white: number;
  };
  wins: {
    red: number;
    white: number;
  };
  draw: boolean[];
  winner: 'red' | 'white' | '';
};

export const initScoreData: ScoreData = {
  playing: -1,
  score: {
    red: [],
    white: [],
  },
  hansoku: {
    red: [],
    white: [],
  },
  daihyo: {
    score: {
      red: '',
      white: '',
    },
    hansoku: {
      red: false,
      white: false,
    },
  },
  ippons: {
    red: 0,
    white: 0,
  },
  wins: {
    red: 0,
    white: 0,
  },
  draw: [],
  winner: '',
};
