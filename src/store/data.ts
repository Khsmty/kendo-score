import { reactive } from "vue";

const initData = {
  playing: -1,
  score: {
    red: [[], [], [], [], [], []],
    white: [[], [], [], [], [], []],
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
      { name: "" },
    ],
    white: [
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "", first: 0 },
      { name: "" },
    ],
  },
};
const data = reactive(initData);

export default data;
