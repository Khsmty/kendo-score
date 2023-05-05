<template>
  <v-row class="mt-8" justify="center" align-content="center">
    <v-col style="flex-grow: 0">
      <div ref="scoreboard" style="padding: 12px">
        <table class="scoreboard text-center">
          <tbody>
            <tr>
              <th class="header teamname">チーム名</th>
              <th class="header" colspan="2">先鋒</th>
              <th class="header" colspan="2">次鋒</th>
              <th class="header" colspan="2">中堅</th>
              <th class="header" colspan="2">副将</th>
              <th class="header" colspan="2">大将</th>
              <th class="katiten" rowspan="2">勝点</th>
              <th class="header" style="width: 80px">代表戦</th>
            </tr>
            <tr>
              <td class="teamname red-team" rowspan="3" style="height: 147px">
                {{ data.team.red }}
              </td>
              <td class="player red-team" colspan="2">
                {{ data.players.red[0].name }}
              </td>
              <td class="player red-team" colspan="2">
                {{ data.players.red[1].name }}
              </td>
              <td class="player red-team" colspan="2">
                {{ data.players.red[2].name }}
              </td>
              <td class="player red-team" colspan="2">
                {{ data.players.red[3].name }}
              </td>
              <td class="player red-team" colspan="2">
                {{ data.players.red[4].name }}
              </td>
              <td class="player red-team">-</td>
            </tr>
            <tr>
              <td class="score-cell">{{ data.score.red[0][0] }}</td>
              <td class="score-cell rb">{{ data.score.red[0][1] }}</td>
              <td class="score-cell">{{ data.score.red[1][0] }}</td>
              <td class="score-cell rb">{{ data.score.red[1][1] }}</td>
              <td class="score-cell">{{ data.score.red[2][0] }}</td>
              <td class="score-cell rb">{{ data.score.red[2][1] }}</td>
              <td class="score-cell">{{ data.score.red[3][0] }}</td>
              <td class="score-cell rb">{{ data.score.red[3][1] }}</td>
              <td class="score-cell">{{ data.score.red[4][0] }}</td>
              <td class="score-cell rb">{{ data.score.red[4][1] }}</td>
              <td class="katiten-cell" rowspan="2">
                <span>{{ data.result.ippons.red }}</span>
                <div class="katiten-bar" />
                <span>{{ data.result.wins.red }}</span>
              </td>
              <td class="score-cell-end">-</td>
            </tr>
            <tr>
              <td class="score-cell bb">{{ data.score.red[0][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.red[0][3] }}</td>
              <td class="score-cell bb">{{ data.score.red[1][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.red[1][3] }}</td>
              <td class="score-cell bb">{{ data.score.red[2][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.red[2][3] }}</td>
              <td class="score-cell bb">{{ data.score.red[3][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.red[3][3] }}</td>
              <td class="score-cell bb">{{ data.score.red[4][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.red[4][3] }}</td>
              <td class="score-cell-end bb"></td>
            </tr>
            <tr>
              <td class="teamname white-team" rowspan="3" style="height: 147px">
                {{ data.team.white }}
              </td>
              <td class="score-cell">{{ data.score.white[0][0] }}</td>
              <td class="score-cell rb">{{ data.score.white[0][1] }}</td>
              <td class="score-cell">{{ data.score.white[1][0] }}</td>
              <td class="score-cell rb">{{ data.score.white[1][1] }}</td>
              <td class="score-cell">{{ data.score.white[2][0] }}</td>
              <td class="score-cell rb">{{ data.score.white[2][1] }}</td>
              <td class="score-cell">{{ data.score.white[3][0] }}</td>
              <td class="score-cell rb">{{ data.score.white[3][1] }}</td>
              <td class="score-cell">{{ data.score.white[4][0] }}</td>
              <td class="score-cell rb">{{ data.score.white[4][1] }}</td>
              <td class="katiten-cell" rowspan="2">
                <span>{{ data.result.ippons.white }}</span>
                <div class="katiten-bar" />
                <span>{{ data.result.wins.white }}</span>
              </td>
              <td class="score-cell-end">-</td>
            </tr>
            <tr>
              <td class="score-cell bb">{{ data.score.white[0][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.white[0][3] }}</td>
              <td class="score-cell bb">{{ data.score.white[1][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.white[1][3] }}</td>
              <td class="score-cell bb">{{ data.score.white[2][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.white[2][3] }}</td>
              <td class="score-cell bb">{{ data.score.white[3][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.white[3][3] }}</td>
              <td class="score-cell bb">{{ data.score.white[4][2] }}</td>
              <td class="score-cell bb rb">{{ data.score.white[4][3] }}</td>
              <td class="score-cell-end"></td>
            </tr>
            <tr>
              <td class="player white-team" colspan="2">
                {{ data.players.white[0].name }}
              </td>
              <td class="player white-team" colspan="2">
                {{ data.players.white[1].name }}
              </td>
              <td class="player white-team" colspan="2">
                {{ data.players.white[2].name }}
              </td>
              <td class="player white-team" colspan="2">
                {{ data.players.white[3].name }}
              </td>
              <td class="player white-team" colspan="2">
                {{ data.players.white[4].name }}
              </td>
              <td></td>
              <td class="player white-team">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-col>
  </v-row>
  <v-row justify="center" align="center">
    <v-col cols="12" class="text-center mb-5">
      <v-btn class="mr-2" color="primary">選手名入力</v-btn>
      <v-btn class="mr-2" color="warning">リセット</v-btn>
      <v-btn color="info" @click="downloadImg">ダウンロード</v-btn>
    </v-col>
    <v-col cols="6" class="text-right">
      <v-btn class="mr-2" color="error" @click="ippon('コ', 'red')">コ</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('ツ', 'red')">ツ</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('ド', 'red')">ド</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('メ', 'red')">メ</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('▲', 'red')">▲</v-btn>
      <v-btn color="error" @click="revert('red')">取消</v-btn>
    </v-col>
    <v-col cols="6" class="text-left">
      <v-btn class="mr-2" color="grey" @click="ippon('コ', 'white')">コ</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('ツ', 'white')">ツ</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('ド', 'white')">ド</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('メ', 'white')">メ</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('▲', 'white')">▲</v-btn>
      <v-btn color="grey" @click="revert('white')">取消</v-btn>
    </v-col>
    <v-col cols="12" class="text-center">
      <v-btn class="mr-2" color="secondary" @click="changePlayer('prev')">
        前選手へ
      </v-btn>
      <v-btn color="secondary" @click="changePlayer('next')">次選手へ</v-btn>
    </v-col>
    <v-col class="text-center">
      <p>現在: {{ data.status }}</p>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { toJpeg } from "html-to-image";

const scoreboard = ref();

const data = reactive({
  playing: -1,
  status: "まだ対戦開始していません",
  score: {
    red: [[], [], [], [], []],
    white: [[], [], [], [], []],
  },
  result: {
    ippons: {
      red: 7,
      white: 0,
    },
    wins: {
      red: 4,
      white: 0,
    },
    hansoku: {
      red: 0,
      white: 0,
    },
    draw: {
      red: [false, false, false, false, false],
      white: [false, false, false, false, false],
    },
  },
  team: {
    red: "",
    white: "",
  },
  players: {
    red: [
      { name: "", first: false },
      { name: "", first: false },
      { name: "", first: false },
      { name: "", first: false },
      { name: "", first: false },
    ],
    white: [
      { name: "", first: false },
      { name: "", first: false },
      { name: "", first: false },
      { name: "", first: false },
      { name: "", first: false },
    ],
  },
});

function ippon(
  type: "コ" | "ツ" | "ド" | "メ" | "▲" | "反",
  team: "red" | "white"
) {
  if (data.playing === -1) {
    alert("対戦が開始されていません。[次選手へ] を押してください。");
    return;
  } else if (data.playing === 6) {
    alert("対戦が終了しています。[リセット] を押してください。");
  }

  if (type === "▲" && data.result.hansoku[team] === 1) {
    type = "反";
    data.result.hansoku[team] = 0;
  } else if (type === "▲") {
    data.result.hansoku[team] = 1;
  }

  data.score[team][data.playing].push(type as never);
}

function revert(team: "red" | "white") {
  if (data.playing === -1) {
    alert("対戦が開始されていません。[次選手へ] を押してください。");
    return;
  } else if (data.playing === 6) {
    alert("対戦が終了しています。[リセット] を押してください。");
  }

  data.score[team][data.playing].pop();
}

function changePlayer(type: "next" | "prev") {
  if (type === "next") {
    if (data.playing === 4) {
      data.playing = 6;
      data.status = "対戦が終了しました";
    } else {
      data.playing++;

      const shogo =
        data.playing === 0
          ? "先鋒"
          : data.playing === 1
          ? "次鋒"
          : data.playing === 2
          ? "中堅"
          : data.playing === 3
          ? "副将"
          : "大将";
      data.status = `${shogo} (${data.players.red[data.playing].name} vs ${
        data.players.white[data.playing].name
      })`;
    }
  } else {
    if (data.playing === 0) {
      data.playing = 4;
    } else {
      data.playing--;
    }
  }
}

function downloadImg() {
  toJpeg(scoreboard.value, { backgroundColor: "white" })
    .then((dataUrl) => {
      var link = document.createElement("a");
      link.download = "scoreboard.jpeg";
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.log(err);
      alert("エラーが発生しました。");
    });
}
</script>

<style>
* {
  font-family: "Noto Sans JP", sans-serif;
}

.scoreboard {
  width: 750px;
  height: 345px;
  background: white;
  font-size: 1.25rem;
  line-height: 1.75rem;
  table-layout: fixed;
  border-collapse: collapse;
}

td,
th {
  border: 1px solid #333;
}

.header {
  height: 51px;
}
.teamname {
  width: 170px;
}
.katiten,
.katiten-cell {
  width: 80px;
}
.katiten-cell {
  font-size: 1.7rem;
}
.katiten-bar {
  width: 70%;
  margin: 3px 15%;
  height: 2px;
  background-color: #333;
}
.player {
  height: 63px;
}

.red-team {
  background: #ffeded;
}
.white-team {
  background: #e9e9e9;
}

.score-cell {
  width: 42px;
  height: 42px;
  border: none;
  font-size: 1.7rem;
}
.rb {
  border-right: 1px solid #333;
}
.bb {
  border-bottom: 1px solid #333 !important;
}
.score-cell-end {
  width: 80px;
  height: 42px;
  border: none;
  border-right: 1px solid #333;
  font-size: 1.7rem;
}

.v-row {
  margin: 0 !important;
}
</style>
