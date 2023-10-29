import React, { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import {
  UsersIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { useRegisterSW } from 'virtual:pwa-register/react';

import {
  initSettingsData,
  initPlayersData,
  initScoreData,
} from './scripts/initData.ts';
import { CircleSvg, SquareSvg, TriangleSvg } from './components/SvgIcons.tsx';

function App() {
  const [settingsData, setSettingsData] = useState(initSettingsData);
  const [playersData, setPlayersData] = useState(initPlayersData);
  const [scoreData, setScoreData] = useState(initScoreData);
  const [isDownloading, setIsDownloading] = useState(false);
  const [messageDialog, setMessageDialog] = useState({
    type: 'info' as 'error' | 'info' | 'success',
    message: '',
  });
  const [toast, setToast] = useState({
    show: false,
    message: '',
  });

  useRegisterSW({
    onOfflineReady() {
      showToast(
        'ページをキャッシュしました。次回以降はオフラインでもこのページを開けます。',
      );
    },
  });

  const scoreboardRef = useRef<HTMLDivElement>(null);

  function openMessageDialog(
    type: 'error' | 'info' | 'success',
    message: string,
  ) {
    setMessageDialog({
      type,
      message,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.message_dialog.showModal();
  }

  function showToast(message: string) {
    setToast({
      show: true,
      message,
    });
  }

  function ippon(
    type: 'コ' | 'ツ' | 'ド' | 'メ' | '▲' | '反' | '○',
    team: 'red' | 'white',
  ) {
    // 対戦中でなかった場合
    if (scoreData.playing === -1) {
      openMessageDialog(
        'error',
        '対戦が開始されていません。[次選手へ] を押してください。',
      );
      return;
    } else if (scoreData.playing === 100) {
      openMessageDialog(
        'error',
        '対戦が終了しています。[リセット] を押してください。',
      );
      return;
    }

    // 代表戦には不戦勝はない
    if (scoreData.playing === 99 && type === '○') {
      openMessageDialog('error', '代表戦に不戦勝はありません。');
      return;
    }

    // 既に勝敗が決まっている場合
    if (
      (scoreData.playing !== 99 &&
        scoreData.score[team][scoreData.playing].length >= 2) ||
      (scoreData.playing === 99 && scoreData.daihyo.score[team].length >= 1)
    ) {
      openMessageDialog(
        'error',
        '既に勝敗が決まっています。[次選手へ] を押してください。',
      );
      return;
    }

    // 反則の場合
    if (
      scoreData.playing !== 99 &&
      type === '▲' &&
      scoreData.hansoku[team][scoreData.playing]
    ) {
      type = '反';
      scoreData.hansoku[team][scoreData.playing] = false;

      if (team === 'red') {
        team = 'white';
      } else {
        team = 'red';
      }
    } else if (scoreData.playing === 99 && scoreData.daihyo.hansoku[team]) {
      type = '反';
      scoreData.daihyo.hansoku[team] = false;

      if (team === 'red') {
        team = 'white';
      } else {
        team = 'red';
      }
    } else if (type === '▲') {
      if (scoreData.playing !== 99) {
        scoreData.hansoku[team][scoreData.playing] = true;
      } else {
        scoreData.daihyo.hansoku[team] = true;
      }
      setScoreData({ ...scoreData });
      return;
    }

    // 1本目に first フラグを立てる
    if (
      scoreData.playing !== 99 &&
      type !== '○' &&
      scoreData.score.red[scoreData.playing].length === 0 &&
      scoreData.score.white[scoreData.playing].length === 0
    ) {
      playersData[team].players[scoreData.playing].first = true;
    } else if (
      scoreData.playing === 99 &&
      type !== '○' &&
      scoreData.daihyo.score.red.length === 0 &&
      scoreData.daihyo.score.white.length === 0
    ) {
      playersData[team].daihyo.first = true;
    }

    // 不戦勝は2本なので、もう1つ push する
    if (type === '○') {
      scoreData.score[team][scoreData.playing].push('○' as never);
    }

    // 結果を push する
    if (scoreData.playing !== 99) {
      scoreData.score[team][scoreData.playing].push(type as never);
    } else {
      scoreData.daihyo.score[team].push(type as never);
    }

    setScoreData({ ...scoreData });
    calcWinPoint();
  }

  function revert(team: 'red' | 'white') {
    // 対戦中でなかった場合
    if (scoreData.playing === -1) {
      openMessageDialog(
        'error',
        '対戦が開始されていません。[次選手へ] を押してください。',
      );
      return;
    } else if (scoreData.playing === 100) {
      openMessageDialog(
        'error',
        '対戦が終了しています。[リセット] を押してください。',
      );
      return;
    }

    // 結果を取り消す
    if (scoreData.playing !== 99) {
      scoreData.score[team][scoreData.playing].pop();
    } else {
      scoreData.daihyo.score[team].pop();
    }

    // 1本目を取り消した場合
    if (
      scoreData.playing !== 99 &&
      scoreData.score[team][scoreData.playing].length === 0
    ) {
      playersData[team].players[scoreData.playing].first = false;
    } else if (
      scoreData.playing === 99 &&
      scoreData.daihyo.score[team].length === 0
    ) {
      playersData[team].daihyo.first = false;
    }

    setScoreData({ ...scoreData });
    calcWinPoint();
  }

  function changePlayer(type: 'next' | 'prev') {
    // 勝数と一本数が同じときは、代表戦へ
    if (
      type === 'next' &&
      scoreData.playing === settingsData.playerCount - 1 &&
      (scoreData.winCount.red === scoreData.winCount.white ||
        (scoreData.winCount.red !== scoreData.winCount.white &&
          scoreData.ipponCount.red === scoreData.ipponCount.white)) &&
      settingsData.daihyo
    ) {
      scoreData.playing = 99;
    }
    // 代表戦の必要がないときは、終了
    else if (
      type === 'next' &&
      scoreData.playing === settingsData.playerCount - 1
    ) {
      scoreData.playing = 100;
    }
    // 終了後から戻るとき (代表戦あり)
    else if (
      type === 'prev' &&
      scoreData.playing === 100 &&
      (scoreData.daihyo.score.red.length !== 0 ||
        scoreData.daihyo.score.white.length !== 0 ||
        ((scoreData.winCount.red === scoreData.winCount.white ||
          (scoreData.winCount.red !== scoreData.winCount.white &&
            scoreData.ipponCount.red === scoreData.ipponCount.white)) &&
          settingsData.daihyo))
    ) {
      scoreData.playing = 99;
    }
    // 代表戦から戻るとき
    else if (type === 'prev' && scoreData.playing === 99) {
      scoreData.playing = settingsData.playerCount - 1;
    }
    // 終了後から戻るとき (代表戦なし)
    else if (type === 'prev' && scoreData.playing === 100) {
      scoreData.playing = settingsData.playerCount - 1;
    }
    // 終了後も進もうとしたとき
    else if (type === 'next' && scoreData.playing === 100) {
      openMessageDialog(
        'error',
        '対戦が終了しているため、進むことはできません。',
      );
      return;
    }
    // 開始前より前に戻ろうとしたとき
    else if (type === 'prev' && scoreData.playing === -1) {
      openMessageDialog(
        'error',
        '対戦が開始されていないため、戻ることはできません。',
      );
      return;
    }
    // 通常の進行
    else if (type === 'next') {
      scoreData.playing++;
    }
    // 通常の戻り
    else if (type === 'prev') {
      scoreData.playing--;
    }

    // scoreData.score, scoreData.hansoku がなければ作成
    if (![-1, 99, 100].includes(scoreData.playing)) {
      if (!scoreData.score.red[scoreData.playing]) {
        scoreData.score.red[scoreData.playing] = [];
      }
      if (!scoreData.score.white[scoreData.playing]) {
        scoreData.score.white[scoreData.playing] = [];
      }
      if (!scoreData.hansoku.red[scoreData.playing]) {
        scoreData.hansoku.red[scoreData.playing] = false;
      }
      if (!scoreData.hansoku.white[scoreData.playing]) {
        scoreData.hansoku.white[scoreData.playing] = false;
      }
    }

    // player が入力されていなければ作成
    if (![-1, 99, 100].includes(scoreData.playing)) {
      if (!playersData.red.players[scoreData.playing]) {
        playersData.red.players[scoreData.playing] = {
          name: '',
          first: false,
        };
      }
      if (!playersData.white.players[scoreData.playing]) {
        playersData.white.players[scoreData.playing] = {
          name: '',
          first: false,
        };
      }
    }

    setPlayersData({ ...playersData });
    setScoreData({ ...scoreData });
    calcWinPoint();
  }

  function calcWinPoint() {
    const ipponCount = {
      red: 0,
      white: 0,
    };
    const winCount = {
      red: 0,
      white: 0,
    };

    // 勝数と一本数を計算
    for (let i = 0; i <= settingsData.playerCount; i++) {
      const red = scoreData.score['red'][i]?.length || 0;
      const white = scoreData.score['white'][i]?.length || 0;

      ipponCount.red += red;
      ipponCount.white += white;

      if (red < white) {
        winCount.white++;
        scoreData.draw[i] = false;
      } else if (red > white) {
        winCount.red++;
        scoreData.draw[i] = false;
      } else {
        scoreData.draw[i] = i < scoreData.playing;
      }
    }

    // 代表戦の勝敗を計算
    const daihyoRed = scoreData.daihyo.score.red.length;
    const daihyoWhite = scoreData.daihyo.score.white.length;

    ipponCount.red += daihyoRed;
    ipponCount.white += daihyoWhite;

    if (daihyoRed < daihyoWhite) {
      winCount.white++;
    } else if (daihyoRed > daihyoWhite) {
      winCount.red++;
    }

    scoreData.ipponCount.red = ipponCount.red;
    scoreData.ipponCount.white = ipponCount.white;
    scoreData.winCount.red = winCount.red;
    scoreData.winCount.white = winCount.white;

    // 終了後なら勝敗を計算
    if (scoreData.playing === 100) {
      if (scoreData.winCount.red > scoreData.winCount.white) {
        scoreData.winner = 'red';
      } else if (scoreData.winCount.red < scoreData.winCount.white) {
        scoreData.winner = 'white';
      } else if (
        scoreData.winCount.red === scoreData.winCount.white &&
        scoreData.ipponCount.red > scoreData.ipponCount.white
      ) {
        scoreData.winner = 'red';
      } else if (
        scoreData.winCount.red === scoreData.winCount.white &&
        scoreData.ipponCount.red < scoreData.ipponCount.white
      ) {
        scoreData.winner = 'white';
      } else {
        scoreData.winner = 'draw';
      }
    } else {
      scoreData.winner = '';
    }

    setScoreData({ ...scoreData });
  }

  function updatePlayerName(
    team: 'red' | 'white',
    index: number,
    name: string,
  ) {
    if (index !== 99) {
      if (!playersData[team].players[index]) {
        playersData[team].players[index] = {
          name: '',
          first: false,
        };
      }

      playersData[team].players[index].name = name;
    } else {
      playersData[team].daihyo.name = name;
    }

    setPlayersData({ ...playersData });
  }

  function updatePlayerCount(
    type: 'increment' | 'decrement' | 'custom',
    value?: number,
  ) {
    value = value || 5;
    if (
      (type === 'increment' && settingsData.playerCount === 9) ||
      (type === 'decrement' && settingsData.playerCount === 3) ||
      (type === 'custom' && (value < 3 || value > 9))
    ) {
      openMessageDialog('error', '選手人数は3~9人の間で設定してください。');
      return;
    }

    if (type === 'increment') {
      settingsData.playerCount++;
    } else if (type === 'decrement') {
      settingsData.playerCount--;
    } else if (type === 'custom') {
      settingsData.playerCount = value || 5;
    }

    // playing を -1 にする
    scoreData.playing = -1;

    // タイトルを更新
    const titles: { [key: number]: string[] } = {
      3: ['先鋒', '中堅', '大将'],
      4: ['先鋒', '中堅', '副将', '大将'],
      5: ['先鋒', '次鋒', '中堅', '副将', '大将'],
      6: ['先鋒', '次鋒', '中堅', '三将', '副将', '大将'],
      7: ['先鋒', '次鋒', '五将', '中堅', '三将', '副将', '大将'],
      8: ['先鋒', '次鋒', '六将', '中堅', '四将', '三将', '副将', '大将'],
      9: [
        '先鋒',
        '次鋒',
        '七将',
        '六将',
        '中堅',
        '四将',
        '三将',
        '副将',
        '大将',
      ],
    };
    settingsData.playerTitles = titles[settingsData.playerCount];

    // あふれているスコアがあれば消す
    if (scoreData.score.red.length > settingsData.playerCount) {
      scoreData.score.red.splice(settingsData.playerCount);
    }
    if (scoreData.score.white.length > settingsData.playerCount) {
      scoreData.score.white.splice(settingsData.playerCount);
    }

    setScoreData({ ...scoreData });
    setSettingsData({ ...settingsData });
  }

  function reset(type: 'score' | 'players' | 'all') {
    if (type === 'score' || type === 'players' || type === 'all') {
      // TODO: 本当は initScoreData を使いたい
      setScoreData((prevState) => ({
        ...prevState,
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
      }));
    }
    if (type === 'score') {
      playersData.red.players.map((player) => {
        player.first = false;
      });
      playersData.white.players.map((player) => {
        player.first = false;
      });
      playersData.red.daihyo.first = false;
      playersData.white.daihyo.first = false;

      setPlayersData({ ...playersData });
    }
    if (type === 'players' || type === 'all') {
      // TODO: 本当は initPlayersData を使いたい
      setPlayersData((prevState) => ({
        ...prevState,
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
      }));
    }
    if (type === 'all') {
      // TODO: 本当は initSettingsData を使いたい
      setSettingsData((prevState) => ({
        ...prevState,
        playerCount: 5,
        playerTitles: ['先鋒', '次鋒', '中堅', '副将', '大将'],
        daihyo: true,
      }));
    }

    openMessageDialog('success', 'リセットしました。');
  }

  async function downloadImg() {
    if (scoreData.playing !== 100) {
      openMessageDialog(
        'error',
        '対戦が進行中です。[次選手へ] を押して終了させてください。',
      );
      setIsDownloading(false);
      return;
    }

    setIsDownloading(true);

    const element = scoreboardRef.current;
    const toImg = await toJpeg(element!);

    const link = document.createElement('a');
    link.download = 'scoreboard.jpeg';
    link.href = toImg;
    link.click();

    setIsDownloading(false);
  }

  return (
    <div className="flex items-center justify-center">
      <main className="mt-10">
        <div className="bg-white p-3" ref={scoreboardRef}>
          <table className="h-[345px] table-fixed border-collapse break-all bg-white text-center text-xl">
            <tbody className="border border-black">
              {/* タイトル (表1段目) */}
              <tr className="h-[51px] border-b border-black">
                <th className="w-[170px] border-r border-black">団体名</th>

                {settingsData.playerTitles.map((title, index) => (
                  <th
                    className={
                      'w-[84px] border-r border-black' +
                      (scoreData.playing === index ? ' bg-green-300' : '')
                    }
                    colSpan={2}
                    key={index}
                  >
                    {title}
                  </th>
                ))}

                <th className="w-[80px] border-r border-black" rowSpan={2}>
                  勝点
                </th>

                {settingsData.daihyo && (
                  <th
                    className={
                      'w-[84px]' +
                      (scoreData.playing === 99 ? ' bg-green-300' : '')
                    }
                    colSpan={2}
                  >
                    代表戦
                  </th>
                )}
              </tr>

              {/* 赤選手名表示セル (表2段目) */}
              <tr className="border-b border-black">
                <td
                  className="h-[147px] w-[170px] border-r border-black bg-red-100 p-3"
                  rowSpan={3}
                >
                  {playersData.red.name || ''}
                </td>

                {settingsData.playerTitles.map((_title, index) => (
                  <td
                    className="h-[63px] border-r border-black bg-red-100"
                    colSpan={2}
                    key={index}
                  >
                    {playersData.red.players[index]?.name}
                  </td>
                ))}

                {settingsData.daihyo && (
                  <td className="h-[63px] bg-red-100" colSpan={2}>
                    {playersData.red.daihyo.name}
                  </td>
                )}
              </tr>

              {/* スコア表示セル1段目 (表3段目) */}
              <tr>
                {settingsData.playerTitles.map((_title, index) => (
                  <React.Fragment key={index}>
                    <td className="relative h-[42px] w-[42px] pb-0.5 pr-0.5 text-right align-bottom text-[2rem]">
                      {scoreData.score.red?.[index]?.[0]}

                      {playersData.red.players[index]?.first && (
                        <CircleSvg className="absolute left-0 top-0.5" />
                      )}

                      {scoreData.draw[index] && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100"
                          height="150"
                          viewBox="0 0 24 36"
                          stroke="#000"
                          strokeWidth="0.6"
                          strokeLinecap="round"
                          className="absolute -left-2 top-2"
                        >
                          <line x1="18" y1="9" x2="6" y2="27"></line>
                          <line x1="6" y1="9" x2="18" y2="27"></line>
                        </svg>
                      )}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black pr-1 text-right align-top">
                      {scoreData.hansoku.red[index] ? '▲' : ''}
                    </td>
                  </React.Fragment>
                ))}

                <td
                  className="relative border-r border-black text-[1.7rem]"
                  rowSpan={2}
                >
                  <span>{scoreData.ipponCount.red}</span>
                  <div className="mx-[15%] my-[3px] h-[2px] w-[70%] bg-gray-900" />
                  <span>{scoreData.winCount.red}</span>

                  {scoreData.winner === 'red' && (
                    <CircleSvg
                      className="absolute left-0 top-0.5"
                      size={80}
                      strokeWidth={0.5}
                    />
                  )}
                  {scoreData.winner === 'draw' && (
                    <SquareSvg
                      className="absolute -left-0.5 top-0"
                      size={85}
                      strokeWidth={0.5}
                    />
                  )}
                  {scoreData.winner === 'white' && (
                    <TriangleSvg
                      className="absolute -left-0.5 top-0"
                      size={85}
                      strokeWidth={0.5}
                    />
                  )}
                </td>

                {settingsData.daihyo && (
                  <>
                    <td className="relative h-[42px] w-[42px] pb-0.5 pr-0.5 text-right align-bottom text-[2rem]">
                      {scoreData.daihyo.score.red[0]}

                      {playersData.red.daihyo.first && (
                        <CircleSvg className="absolute left-0 top-0.5" />
                      )}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black pr-1 text-right align-top">
                      {scoreData.daihyo.hansoku.red ? '▲' : ''}
                    </td>
                  </>
                )}
              </tr>

              {/* スコア表示セル2段目 (表4段目) */}
              <tr className="border-b border-black">
                {settingsData.playerTitles.map((_title, index) => (
                  <React.Fragment key={index}>
                    <td className="h-[42px] w-[42px]"></td>
                    <td className="h-[42px] w-[42px] border-r border-black pl-0.5 pt-0.5 text-left align-top text-[2rem]">
                      {scoreData.score.red?.[index]?.[1]}
                    </td>
                  </React.Fragment>
                ))}

                {settingsData.daihyo && (
                  <>
                    <td className="h-[42px] w-[42px]"></td>
                    <td className="h-[42px] w-[42px]"></td>
                  </>
                )}
              </tr>

              {/* スコア表示セル3段目 (表5段目) */}
              <tr>
                <td
                  className="h-[147px] w-[170px] border-r border-black bg-gray-200 p-3"
                  rowSpan={3}
                >
                  {playersData.white.name || ''}
                </td>

                {settingsData.playerTitles.map((_title, index) => (
                  <React.Fragment key={index}>
                    <td className="h-[42px] w-[42px]"></td>
                    <td className="h-[42px] w-[42px] border-r border-black pb-0.5 pl-0.5 text-left align-bottom text-[2rem]">
                      {scoreData.score.white?.[index]?.[1]}
                    </td>
                  </React.Fragment>
                ))}

                <td
                  className="relative border-r border-black text-[1.7rem]"
                  rowSpan={2}
                >
                  <span>{scoreData.ipponCount.white}</span>
                  <div className="mx-[15%] my-[3px] h-[2px] w-[70%] bg-gray-900" />
                  <span>{scoreData.winCount.white}</span>

                  {scoreData.winner === 'white' && (
                    <CircleSvg
                      className="absolute left-0 top-0.5"
                      size={80}
                      strokeWidth={0.5}
                    />
                  )}
                  {scoreData.winner === 'draw' && (
                    <SquareSvg
                      className="absolute -left-0.5 top-0"
                      size={85}
                      strokeWidth={0.5}
                    />
                  )}
                  {scoreData.winner === 'red' && (
                    <TriangleSvg
                      className="absolute -left-0.5 top-0"
                      size={85}
                      strokeWidth={0.5}
                    />
                  )}
                </td>

                {settingsData.daihyo && (
                  <>
                    <td className="relative h-[42px] w-[42px] pb-0.5 pr-0.5 text-right align-bottom text-[2rem]">
                      {scoreData.daihyo.score.white[0]}

                      {playersData.white.daihyo.first && (
                        <CircleSvg className="absolute left-0 top-0.5" />
                      )}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black pr-1 text-right align-top">
                      {scoreData.daihyo.hansoku.white ? '▲' : ''}
                    </td>
                  </>
                )}
              </tr>

              {/* スコア表示セル4段目 (表6段目) */}
              <tr className="border-b border-black">
                {settingsData.playerTitles.map((_title, index) => (
                  <React.Fragment key={index}>
                    <td className="relative h-[42px] w-[42px] pr-0.5 pt-0.5 text-right align-top text-[2rem]">
                      {scoreData.score.white?.[index]?.[0]}

                      {playersData.white.players[index]?.first && (
                        <CircleSvg className="absolute bottom-0 left-0" />
                      )}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black pr-1 text-right align-bottom">
                      {scoreData.hansoku.white[index] ? '▲' : ''}
                    </td>
                  </React.Fragment>
                ))}

                {settingsData.daihyo && (
                  <>
                    <td className="h-[42px] w-[42px]"></td>
                    <td className="h-[42px] w-[42px]"></td>
                  </>
                )}
              </tr>

              {/* 白選手名表示セル (表7段目) */}
              <tr>
                {settingsData.playerTitles.map((_title, index) => (
                  <td
                    className="h-[63px] border-r border-black bg-gray-200"
                    colSpan={2}
                    key={index}
                  >
                    {playersData.white.players[index]?.name}
                  </td>
                ))}

                <td className="border-r border-black"></td>

                {settingsData.daihyo && (
                  <td className="h-[63px] bg-gray-200" colSpan={2}>
                    {playersData.white.daihyo.name}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ボタン1段目 */}
        <div className="mt-5 flex justify-center gap-4 text-center">
          <button
            className="btn"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            onClick={() => window.player_modal.showModal()}
          >
            <UsersIcon className="h-5 w-5" />
            選手名入力
          </button>
          <button
            className="btn"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            onClick={() => window.config_modal.showModal()}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            表設定変更
          </button>
          <button
            className="btn"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            onClick={() => window.reset_modal.showModal()}
          >
            <ArrowPathIcon className="h-5 w-5" />
            リセット
          </button>
          <button className="btn" onClick={downloadImg}>
            <ArrowDownTrayIcon className="h-5 w-5" />
            ダウンロード
          </button>

          {/* 選手名入力ダイアログ */}
          <dialog id="player_modal" className="modal">
            <form method="dialog" className="modal-box max-w-[700px]">
              <h3 className="mb-5 text-lg font-bold">選手名入力</h3>

              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center gap-3">
                  <input
                    className="input input-error w-64"
                    value={playersData.red.name}
                    onChange={(e) =>
                      setPlayersData({
                        ...playersData,
                        red: { ...playersData.red, name: e.target.value },
                      })
                    }
                  />
                  <span className="w-16 text-lg">団体名</span>
                  <input
                    className="input input-bordered w-64"
                    value={playersData.white.name}
                    onChange={(e) =>
                      setPlayersData({
                        ...playersData,
                        white: { ...playersData.white, name: e.target.value },
                      })
                    }
                  />
                </div>
                <hr className="border-b-gray-400" />

                {settingsData.playerTitles.map((title, index) => (
                  <div
                    className="flex items-center justify-center gap-3"
                    key={index}
                  >
                    <input
                      className="input input-error w-64"
                      value={playersData.red.players[index]?.name || ''}
                      onChange={(e) =>
                        updatePlayerName('red', index, e.target.value)
                      }
                    />
                    <span className="w-16 text-lg">{title}</span>
                    <input
                      className="input input-bordered w-64"
                      value={playersData.white.players[index]?.name || ''}
                      onChange={(e) =>
                        updatePlayerName('white', index, e.target.value)
                      }
                    />
                  </div>
                ))}

                {settingsData.daihyo && (
                  <>
                    <hr className="border-b-gray-400" />
                    <div className="flex items-center justify-center gap-3">
                      <input
                        className="input input-error w-64"
                        value={playersData.red.daihyo.name}
                        onChange={(e) =>
                          updatePlayerName('red', 99, e.target.value)
                        }
                      />
                      <span className="w-16 text-lg">代表戦</span>
                      <input
                        className="input input-bordered w-64"
                        value={playersData.white.daihyo.name}
                        onChange={(e) =>
                          updatePlayerName('white', 99, e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-action">
                <button className="btn">閉じる</button>
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          {/* 表設定変更ダイアログ */}
          <dialog id="config_modal" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="text-lg font-bold">表設定変更</h3>
              <span className="text-sm text-gray-500">
                スコア入力後に変更すると、表が崩れる場合があります。
              </span>

              <table className="table mt-5 w-full">
                <tbody>
                  <tr>
                    <td className="text-right text-base">選手人数 (3~9人)</td>
                    <td className="w-1/2">
                      <div className="join">
                        <button
                          className="btn join-item"
                          type="button"
                          onClick={() => updatePlayerCount('decrement')}
                        >
                          －
                        </button>
                        <input
                          className="input join-item input-bordered w-14"
                          type="number"
                          min={3}
                          max={9}
                          value={settingsData.playerCount}
                          onChange={(e) =>
                            updatePlayerCount('custom', Number(e.target.value))
                          }
                        />
                        <button
                          className="btn join-item"
                          type="button"
                          onClick={() => updatePlayerCount('increment')}
                        >
                          ＋
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-right text-base">代表戦</td>
                    <td>
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="checkbox"
                            className="toggle"
                            checked={settingsData.daihyo}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                daihyo: e.target.checked,
                              })
                            }
                          />
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="modal-action">
                <button className="btn">閉じる</button>
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          {/* リセットダイアログ */}
          <dialog id="reset_modal" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="text-lg font-bold">リセット</h3>
              <span className="text-sm text-gray-500">
                リセットすると元に戻せません。注意して実行してください。
              </span>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  className="btn btn-error btn-block"
                  onClick={() => reset('score')}
                >
                  スコアのみリセット
                </button>
                <button
                  className="btn btn-error btn-block"
                  onClick={() => reset('players')}
                >
                  スコアと選手名をリセット
                </button>
                <button
                  className="btn btn-error btn-block"
                  onClick={() => reset('all')}
                >
                  すべてリセット
                </button>
              </div>

              <div className="modal-action">
                <button className="btn">キャンセル</button>
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>

        {/* スコア入力ボタン (ボタン2段目) */}
        <div className="mt-7 flex justify-center gap-4 text-center">
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                className="btn w-16 bg-red-700 text-white"
                onClick={() => ippon('コ', 'red')}
              >
                コ
              </button>
              <button
                className="btn w-16 bg-red-700 text-white"
                onClick={() => ippon('ツ', 'red')}
              >
                ツ
              </button>
              <button
                className="btn w-16 bg-red-700 text-white"
                onClick={() => ippon('ド', 'red')}
              >
                ド
              </button>
              <button
                className="btn w-16 bg-red-700 text-white"
                onClick={() => ippon('メ', 'red')}
              >
                メ
              </button>
              <button
                className="btn w-16 bg-red-700 text-white"
                onClick={() => ippon('▲', 'red')}
              >
                ▲
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="btn bg-red-700 text-white"
                onClick={() => ippon('○', 'red')}
              >
                不戦勝
              </button>
              <button
                className="btn bg-red-700 text-white"
                onClick={() => revert('red')}
              >
                取消
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <div className="flex gap-2">
              <button
                className="btn w-16 bg-gray-500 text-white"
                onClick={() => ippon('コ', 'white')}
              >
                コ
              </button>
              <button
                className="btn w-16 bg-gray-500 text-white"
                onClick={() => ippon('ツ', 'white')}
              >
                ツ
              </button>
              <button
                className="btn w-16 bg-gray-500 text-white"
                onClick={() => ippon('ド', 'white')}
              >
                ド
              </button>
              <button
                className="btn w-16 bg-gray-500 text-white"
                onClick={() => ippon('メ', 'white')}
              >
                メ
              </button>
              <button
                className="btn w-16 bg-gray-500 text-white"
                onClick={() => ippon('▲', 'white')}
              >
                ▲
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="btn bg-gray-500 text-white"
                onClick={() => ippon('○', 'white')}
              >
                不戦勝
              </button>
              <button
                className="btn bg-gray-500 text-white"
                onClick={() => revert('white')}
              >
                取消
              </button>
            </div>
          </div>
        </div>

        {/* 選手切り替えボタン (ボタン3段目) */}
        <div className="my-7 flex justify-center gap-4 text-center">
          <button className="btn" onClick={() => changePlayer('prev')}>
            <ArrowLeftIcon className="h-5 w-5" />
            前選手へ
          </button>
          <button className="btn" onClick={() => changePlayer('next')}>
            次選手へ
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>

        {/* ダウンロード中ローディングオーバーレイ */}
        {isDownloading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="card w-96 bg-base-100">
              <div className="card-body flex flex-col items-center text-center">
                <span className="loading loading-spinner loading-lg text-blue-700"></span>

                <h2 className="card-title justify-center">ダウンロード中</h2>
                <p>
                  表を画像に変換しています。
                  <br />
                  しばらくお待ちください...
                </p>
                <p className="text-xs text-gray-600">
                  ※iPad
                  など、画面の解像度が高い端末の場合は時間がかかる可能性があります
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 共通ダイアログ */}
        <dialog id="message_dialog" className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="mb-3 text-lg font-bold">
              {messageDialog.type === 'error' && (
                <div className="flex items-center gap-1">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  エラー
                </div>
              )}
              {messageDialog.type === 'info' && (
                <div className="flex items-center gap-1">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                  メッセージ
                </div>
              )}
              {messageDialog.type === 'success' && (
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  成功
                </div>
              )}
            </h3>

            {messageDialog.message}

            <div className="modal-action">
              <button className="btn">OK</button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {/* 共通トースト */}
        {toast.show && (
          <div className="toast toast-center">
            <div className="alert max-w-[90vw] gap-2 bg-gray-800 text-white">
              <InformationCircleIcon className="h-5 w-5" />
              <span>{toast.message}</span>
              <div>
                <button
                  className="btn btn-sm"
                  onClick={() => setToast({ show: false, message: '' })}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4">
          <a
            href="https://cms.taigasaito.org/kendo-score"
            target="_blank"
            className="btn btn-sm gap-1"
          >
            <QuestionMarkCircleIcon className="h-4 w-4" />
            ヘルプ
          </a>
        </div>
      </main>
    </div>
  );
}

export default App;
