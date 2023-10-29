import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

interface SettingsAtom {
  playerCount: number;
  playerTitles: string[];
  daihyo: boolean;
}

export const settingsAtom = atomWithReset<SettingsAtom>({
  playerCount: 5,
  playerTitles: ['先鋒', '次鋒', '中堅', '副将', '大将'],
  daihyo: true,
});

interface PlayersAtom {
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
}

export const playersAtom = atomWithReset<PlayersAtom>({
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
});

interface ScoreAtom {
  // -1: 対戦開始前, 99: 代表戦, 100: 対戦終了
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
      red: string[];
      white: string[];
    };
    hansoku: {
      red: boolean;
      white: boolean;
    };
  };
  ipponCount: {
    red: number;
    white: number;
  };
  winCount: {
    red: number;
    white: number;
  };
  draw: boolean[];
  winner: 'red' | 'white' | 'draw' | '';
}

export const scoreAtom = atomWithReset<ScoreAtom>({
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
      red: [],
      white: [],
    },
    hansoku: {
      red: false,
      white: false,
    },
  },
  ipponCount: {
    red: 0,
    white: 0,
  },
  winCount: {
    red: 0,
    white: 0,
  },
  draw: [],
  winner: '',
});

interface StateAtom {
  isDownloading: boolean;
  messageDialog: {
    type: 'error' | 'info' | 'success';
    message: string;
  };
  toast: {
    show: boolean;
    message: string;
  };
}

export const stateAtom = atom<StateAtom>({
  isDownloading: false,
  messageDialog: {
    type: 'info',
    message: '',
  },
  toast: {
    show: false,
    message: '',
  },
});
