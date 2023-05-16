import { reactive } from "vue";

export const initData = {
  playing: -1,
  status: "まだ対戦開始していません",
  score: {
    red: [[], [], [], [], []],
    white: [[], [], [], [], []],
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
    draw: [false, false, false, false, false],
  },
  team: {
    red: "",
    white: "",
  },
  players: {
    red: [
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
    ],
    white: [
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
    ],
  },
};
const data = reactive(initData);

export default data;
