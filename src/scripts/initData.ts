type SettingsData = {
  playerCount: number;
  daihyo: boolean;
};

export const initSettingsData: SettingsData = {
  playerCount: 5,
  daihyo: true,
};

type PlayersData = {
  red: {
    name: string;
    players: { name: string; first: 0 }[];
  };
  white: {
    name: string;
    players: { name: string; first: 0 }[];
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
  result: {
    ippons: {
      red: number;
      white: number;
    };
    wins: {
      red: number;
      white: number;
    };
    hansoku: {
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
  result: {
    ippons: {
      red: 0,
      white: 0,
    },
    wins: {
      red: 0,
      white: 0,
    },
    hansoku: {
      red: 0,
      white: 0,
    },
    draw: [false, false, false, false, false, false],
    winner: '',
  },
};
