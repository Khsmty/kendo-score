<template>
  <v-row class="mt-8" justify="center" align-content="center">
    <v-col style="flex-grow: 0">
      <div ref="scoreboard" class="scoreboard-parent" style="padding: 12px">
        <table class="scoreboard text-center">
          <tbody>
            <tr>
              <th class="header teamname lb">チーム名</th>
              <th
                :class="'header ' + (data.playing === 0 ? 'nowplaying' : '')"
                colspan="2"
              >
                先鋒
              </th>
              <th
                :class="'header ' + (data.playing === 1 ? 'nowplaying' : '')"
                colspan="2"
              >
                次鋒
              </th>
              <th
                :class="'header ' + (data.playing === 2 ? 'nowplaying' : '')"
                colspan="2"
              >
                中堅
              </th>
              <th
                :class="'header ' + (data.playing === 3 ? 'nowplaying' : '')"
                colspan="2"
              >
                副将
              </th>
              <th
                :class="'header ' + (data.playing === 4 ? 'nowplaying' : '')"
                colspan="2"
              >
                大将
              </th>
              <th class="katiten" rowspan="2">勝点</th>
              <th
                :class="'header ' + (data.playing === 5 ? 'nowplaying' : '')"
                style="width: 80px"
              >
                代表戦
              </th>
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
              <td class="player red-team">{{ data.players.red[5].name }}</td>
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
              <td class="score-cell-end">{{ data.score.red[5][0] }}</td>
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
              <td class="score-cell-end bb">{{ data.score.red[5][1] }}</td>
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
              <td class="score-cell-end">{{ data.score.white[5][0] }}</td>
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
              <td class="score-cell-end" style="border-bottom: 1px solid #333">
                {{ data.score.white[5][1] }}
              </td>
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
              <td style="border-top: none; border-left: none"></td>
              <td class="player white-team">
                {{ data.players.white[5].name }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 1本目マーク -->
        <div v-for="i in 20" :class="'firstmark-' + i">
          <svg
            v-if="
              data.players.red.some((player) => player.first === i) ||
              data.players.white.some((player) => player.first === i)
            "
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            stroke="#000"
            stroke-width="1"
            fill="none"
          >
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>

        <!-- 引き分けマーク -->
        <div v-for="i in 5" :class="'drawmark-' + i">
          <svg
            v-if="data.result.draw[i - 1]"
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            stroke="#000"
            stroke-width="1"
            stroke-linecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
    </v-col>
  </v-row>

  <v-row justify="center" align="center">
    <v-col cols="12" class="text-center mb-5">
      <!-- 選手名入力 -->
      <v-dialog v-model="state.isPlayerNameDialogOpen" width="600">
        <template v-slot:activator="{ props }">
          <v-btn class="mr-2" color="primary" v-bind="props">選手名入力</v-btn>
        </template>

        <v-card>
          <v-card-text>
            <v-row align="center">
              <v-col cols="5">
                <v-text-field
                  v-model="data.team.red"
                  variant="outlined"
                  base-color="error"
                  color="error"
                  :hide-details="true"
                />
              </v-col>
              <v-col cols="2" class="text-center">
                <p>チーム名</p>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="data.team.white"
                  variant="outlined"
                  base-color="grey"
                  color="grey"
                  :hide-details="true"
                />
              </v-col>
            </v-row>

            <v-divider class="my-2" />

            <v-row v-for="i in 6" :key="i" align="center">
              <v-col cols="5">
                <v-text-field
                  v-model="data.players.red[i - 1].name"
                  variant="outlined"
                  base-color="error"
                  color="error"
                  :hide-details="true"
                />
              </v-col>
              <v-col cols="2" class="text-center">
                <p>{{ order[i - 1] }}</p>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="data.players.white[i - 1].name"
                  variant="outlined"
                  base-color="grey"
                  color="grey"
                  :hide-details="true"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="tonal"
              block
              @click="state.isPlayerNameDialogOpen = false"
            >
              閉じる
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 操作ボタン -->
      <v-btn class="mr-2" color="warning" @click="reset">リセット</v-btn>
      <v-btn color="info" @click="downloadImg">ダウンロード</v-btn>
    </v-col>

    <!-- 1本ボタン -->
    <v-col cols="6" class="text-right">
      <v-btn class="mr-2" color="error" @click="ippon('コ', 'red')">コ</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('ツ', 'red')">ツ</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('ド', 'red')">ド</v-btn>
      <v-btn class="mr-2" color="error" @click="ippon('メ', 'red')">メ</v-btn>
      <v-btn color="error" @click="ippon('▲', 'red')">▲</v-btn>
      <div class="d-block mt-2" />
      <v-btn class="mr-2" color="error" @click="ippon('○', 'red')">
        不戦勝
      </v-btn>
      <v-btn color="error" @click="revert('red')">取消</v-btn>
    </v-col>
    <v-col cols="6" class="text-left">
      <v-btn class="mr-2" color="grey" @click="ippon('コ', 'white')">コ</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('ツ', 'white')">ツ</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('ド', 'white')">ド</v-btn>
      <v-btn class="mr-2" color="grey" @click="ippon('メ', 'white')">メ</v-btn>
      <v-btn color="grey" @click="ippon('▲', 'white')">▲</v-btn>
      <div class="d-block mt-2" />
      <v-btn class="mr-2" color="grey" @click="ippon('○', 'white')">
        不戦勝
      </v-btn>
      <v-btn color="grey" @click="revert('white')">取消</v-btn>
    </v-col>

    <!-- 選手ボタン -->
    <v-col cols="12" class="text-center">
      <v-btn class="mr-2" color="secondary" @click="changePlayer('prev')">
        前選手へ
      </v-btn>
      <v-btn color="secondary" @click="changePlayer('next')">次選手へ</v-btn>
    </v-col>
    <v-col class="text-center">
      <p>
        現在:&nbsp;
        <span v-if="[0, 1, 2, 3, 4, 5].includes(data.playing)">
          {{ order[data.playing] }}&nbsp; ({{
            data.players.red[data.playing].name
          }}
          &nbsp;vs&nbsp;
          {{ data.players.white[data.playing].name }})
        </span>
        <span v-else-if="data.playing === -1">対戦が開始されていません</span>
        <span v-else-if="data.playing === 6">対戦が終了しました</span>
      </p>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import html2canvas from "html2canvas";

// reactive
import data from "./store/data";
import state from "./store/state";

const scoreboard = ref();

const order = ["先鋒", "次鋒", "中堅", "副将", "大将", "代表戦"];

function ippon(
  type: "コ" | "ツ" | "ド" | "メ" | "▲" | "反" | "○",
  team: "red" | "white"
) {
  if (data.playing === -1) {
    alert("対戦が開始されていません。[次選手へ] を押してください。");
    return;
  } else if (data.playing === 6) {
    alert("対戦が終了しています。[リセット] を押してください。");
    return;
  }

  if (data.score[team][data.playing].length >= 4) {
    alert("上限に達しました。[次選手へ] を押してください。");
    return;
  }

  if (type === "▲" && data.result.hansoku[team] === 1) {
    type = "反";
    data.result.hansoku[team] = 0;

    // 1本目が▲だった場合は、first を移動
    if (data.playing !== 5 && data.score[team][data.playing][0] === "▲" && data.players[team][data.playing].first !== 0) {
      data.players[team][data.playing].first! -= 2;
    }

    if (team === "red") {
      team = "white";

      data.score.red[data.playing].splice(
        data.score.red[data.playing].indexOf("▲" as never),
        1
      );
    } else {
      team = "red";

      data.score.white[data.playing].splice(
        data.score.white[data.playing].indexOf("▲" as never),
        1
      );
    }
  } else if (type === "▲") {
    data.result.hansoku[team] = 1;
  }

  if (
    data.playing !== 5 &&
    type !== "▲" &&
    type !== "○" &&
    (data.score.red[data.playing].length === 0 ||
      (data.score.red[data.playing].length === 1 &&
        data.score.red[data.playing].some((score) => score === "▲"))) &&
    (data.score.white[data.playing].length === 0 ||
      (data.score.white[data.playing].length === 1 &&
        data.score.white[data.playing].some((score) => score === "▲")))
  ) {
    const numbers = [
      [1, 3, 2, 4],
      [5, 7, 6, 8],
      [9, 11, 10, 12],
      [13, 15, 14, 16],
      [17, 19, 18, 20],
    ];
    let i = team === "red" ? 0 : 2;

    if (data.score[team][data.playing].length === 1) {
      i++;
    }

    data.players[team][data.playing].first = numbers[data.playing][i];
  }

  if (type === "○") {
    data.score[team][data.playing].push("○" as never);
  }

  data.score[team][data.playing].push(type as never);
  calcWinPoint();
}

function revert(team: "red" | "white") {
  if (data.playing === -1) {
    alert("対戦が開始されていません。[次選手へ] を押してください。");
    return;
  } else if (data.playing === 6) {
    alert("対戦が終了しています。[リセット] を押してください。");
  }

  const pop = data.score[team][data.playing].pop();
  if (pop === "▲") {
    data.result.hansoku[team] = 0;
  }

  /* 1本目を取り消した場合 */
  if (
    data.score[team][data.playing].length === 0 ||
    (data.score[team][data.playing].length === 1 &&
      data.score[team][data.playing].some((score) => score === "▲"))
  ) {
    data.players[team][data.playing].first = 0;
  }

  calcWinPoint();
}

function changePlayer(type: "next" | "prev") {
  if (
    type === "next" &&
    data.playing === 4 &&
    (data.result.wins.red !== data.result.wins.white ||
      (data.result.wins.red === data.result.wins.white &&
        data.result.ippons.red !== data.result.ippons.white))
  ) {
    data.playing = 6;
  } else if (type === "next" && data.playing === 5) {
    data.playing = 6;
  } else if (type === "prev" && data.playing === -1) {
    return;
  } else if (type === "next" && data.playing === 6) {
    return;
  } else if (
    type === "prev" &&
    data.playing === 6 &&
    data.score.red[5].length === 0 &&
    data.score.white[5].length === 0 &&
    (data.result.wins.red !== data.result.wins.white ||
      (data.result.wins.red === data.result.wins.white &&
        data.result.ippons.red !== data.result.ippons.white))
  ) {
    data.playing = 4;
  } else if (type === "prev" && data.playing === 0) {
    data.playing = -1;
  } else if (type === "next") {
    data.playing++;
  } else if (type === "prev") {
    data.playing--;
  }

  if ([0, 1, 2, 3, 4, 5].includes(data.playing)) {
    data.result.hansoku.red =
      data.score.red[data.playing].filter((r) => r === "▲").length % 2;
    data.result.hansoku.white =
      data.score.white[data.playing].filter((r) => r === "▲").length % 2;
  }

  calcWinPoint();
}

function calcWinPoint() {
  let ipponCount = {
    red: 0,
    white: 0,
  };
  let winCount = {
    red: 0,
    white: 0,
  };

  for (let i = 0; i <= 5; i++) {
    let red = 0;
    let white = 0;

    for (const team of ["red", "white"]) {
      const record = data.score[team as keyof (typeof data)["score"]][i];
      const filtered = record.filter((r) => r !== "▲");

      team === "red" ? (red = filtered.length) : (white = filtered.length);
    }

    ipponCount.red += red;
    ipponCount.white += white;

    if (red < white) {
      winCount.white++;
      data.result.draw[i] = false;
    } else if (red > white) {
      winCount.red++;
      data.result.draw[i] = false;
    } else if (i < data.playing) {
      data.result.draw[i] = true;
    } else {
      data.result.draw[i] = false;
    }

    data.result.ippons.red = ipponCount.red;
    data.result.ippons.white = ipponCount.white;
    data.result.wins.red = winCount.red;
    data.result.wins.white = winCount.white;
  }
}

function reset() {
  if (confirm("本当にリセットしますか？")) {
    location.reload();
  }
}

function downloadImg() {
  if (data.playing !== 6) {
    alert("試合が進行中です。[次選手へ] を押して終了させてください。");
    return;
  }

  html2canvas(scoreboard.value)
    .then((canvas) => {
      var link = document.createElement("a");
      link.download = "scoreboard.jpeg";
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    })
    .catch((err) => {
      console.log(err);
      alert("エラーが発生しました。");
    });
}
</script>
