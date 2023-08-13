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
    players: { name: string; first: number }[];
  };
  white: {
    name: string;
    players: { name: string; first: number }[];
  };
};

export const initPlayersData: PlayersData = {
  red: {
    name: '',
    players: [],
  },
  white: {
    name: '',
    players: [],
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
  result: {
    ippons: {
      red: number;
      white: number;
    };
    wins: {
      red: number;
      white: number;
    };

    draw: boolean[];
    winner: string;
  };
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
  result: {
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
  },
};
