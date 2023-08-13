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
} from '@heroicons/react/24/solid';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { useRegisterSW } from 'virtual:pwa-register/react';

import {
  initSettingsData,
  initPlayersData,
  initScoreData,
} from './scripts/initData.ts';
import { CircleSvg } from './components/CircleSvg.tsx';

function App() {
  const [settingsData, setSettingsData] = useState(initSettingsData);
  const [playersData, setPlayersData] = useState(initPlayersData);
  const [scoreData, setScoreData] = useState(initScoreData);
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
        '端末にページをキャッシュしました。次回からはインターネットに接続しなくてもこのページを開くことができます。',
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
    if (scoreData.playing === -1) {
      openMessageDialog(
        'error',
        '対戦が開始されていません。[次選手へ] を押してください。',
      );
      return;
    } else if (scoreData.playing === 6) {
      openMessageDialog(
        'error',
        '対戦が終了しています。[リセット] を押してください。',
      );
      return;
    }

    if (scoreData.score[team][scoreData.playing].length >= 2) {
      openMessageDialog(
        'error',
        '既に勝敗が決まっています。[次選手へ] を押してください。',
      );
      return;
    }

    if (type === '▲' && scoreData.hansoku[team][scoreData.playing]) {
      type = '反';
      scoreData.hansoku[team][scoreData.playing] = false;

      if (team === 'red') {
        team = 'white';

        scoreData.score.red[scoreData.playing].splice(
          scoreData.score.red[scoreData.playing].indexOf('▲' as never),
          1,
        );
      } else {
        team = 'red';

        scoreData.score.white[scoreData.playing].splice(
          scoreData.score.white[scoreData.playing].indexOf('▲' as never),
          1,
        );
      }
    } else if (type === '▲') {
      scoreData.hansoku[team][scoreData.playing] = true;
    }

    if (
      scoreData.playing !== 5 &&
      type !== '▲' &&
      type !== '○' &&
      (scoreData.score.red[scoreData.playing].length === 0 ||
        (scoreData.score.red[scoreData.playing].length === 1 &&
          scoreData.score.red[scoreData.playing].some(
            (score) => score === '▲',
          ))) &&
      (scoreData.score.white[scoreData.playing].length === 0 ||
        (scoreData.score.white[scoreData.playing].length === 1 &&
          scoreData.score.white[scoreData.playing].some(
            (score) => score === '▲',
          )))
    ) {
      playersData[team].players[scoreData.playing].first = true;
    }

    if (type === '○') {
      scoreData.score[team][scoreData.playing].push('○' as never);
    }

    scoreData.score[team][scoreData.playing].push(type as never);

    setScoreData({ ...scoreData });
    calcWinPoint();
  }

  function revert(team: 'red' | 'white') {
    if (scoreData.playing === -1) {
      alert('対戦が開始されていません。[次選手へ] を押してください。');
      return;
    } else if (scoreData.playing === 6) {
      alert('対戦が終了しています。[リセット] を押してください。');
    }

    scoreData.score[team][scoreData.playing].pop();

    /* 1本目を取り消した場合 */
    if (
      scoreData.score[team][scoreData.playing].length === 0 ||
      (scoreData.score[team][scoreData.playing].length === 1 &&
        scoreData.score[team][scoreData.playing].some((score) => score === '▲'))
    ) {
      playersData[team].players[scoreData.playing].first = false;
    }

    setScoreData({ ...scoreData });
    calcWinPoint();
  }

  function changePlayer(type: 'next' | 'prev') {
    // 勝数と一本数が同じときは、代表戦へ
    if (
      type === 'next' &&
      scoreData.playing === 4 &&
      (scoreData.wins.red !== scoreData.wins.white ||
        (scoreData.wins.red === scoreData.wins.white &&
          scoreData.ippons.red !== scoreData.ippons.white)) &&
      scoreData.score.red[5].length === 0 &&
      scoreData.score.white[5].length === 0
    ) {
      scoreData.playing = 100;
    } else if (type === 'next' && scoreData.playing === 5) {
      scoreData.playing = 100;
    } else if (type === 'prev' && scoreData.playing === -1) {
      return;
    } else if (type === 'next' && scoreData.playing === 100) {
      return;
    } else if (
      type === 'prev' &&
      scoreData.playing === 100 &&
      scoreData.score.red[5].length === 0 &&
      scoreData.score.white[5].length === 0 &&
      (scoreData.wins.red !== scoreData.wins.white ||
        (scoreData.wins.red === scoreData.wins.white &&
          scoreData.ippons.red !== scoreData.ippons.white))
    ) {
      scoreData.playing = 4;
    } else if (type === 'prev' && scoreData.playing === 0) {
      scoreData.playing = -1;
    } else if (type === 'next') {
      scoreData.playing++;
    } else if (type === 'prev') {
      scoreData.playing--;
    }

    // scoreData.score, scoreData.hansoku がなければ作成
    if (scoreData.playing !== -1 && scoreData.playing !== 100) {
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
    if (scoreData.playing !== -1 && scoreData.playing !== 100) {
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

    for (let i = 0; i <= 5; i++) {
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
      } else scoreData.draw[i] = i < scoreData.playing;

      scoreData.ippons.red = ipponCount.red;
      scoreData.ippons.white = ipponCount.white;
      scoreData.wins.red = winCount.red;
      scoreData.wins.white = winCount.white;
    }
  }

  function updatePlayerName(
    team: 'red' | 'white',
    index: number,
    name: string,
  ) {
    if (index !== 100) {
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
      }));
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
      setSettingsData(initSettingsData);
    }

    openMessageDialog('success', 'リセットしました。');
  }

  async function downloadImg() {
    if (scoreData.playing !== 100) {
      openMessageDialog(
        'error',
        '対戦が進行中です。[次選手へ] を押して終了させてください。',
      );
      return;
    }

    const element = scoreboardRef.current;

    toJpeg(element!).then(function (dataUrl) {
      const link = document.createElement('a');
      link.download = 'scoreboard.jpeg';
      link.href = dataUrl;
      link.click();
    });
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
                      (scoreData.playing === 5 ? ' bg-green-300' : '')
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
                  {playersData.red.name}
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
                          strokeWidth="0.8"
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

                <td className="border-r border-black text-[1.7rem]" rowSpan={2}>
                  <span>{scoreData.ippons.red}</span>
                  <div className="mx-[15%] my-[3px] h-[2px] w-[70%] bg-gray-900" />
                  <span>{scoreData.wins.red}</span>
                </td>

                {settingsData.daihyo && (
                  <>
                    <td className="relative h-[42px] w-[42px] pb-0.5 pr-0.5 text-right align-bottom text-[2rem]">
                      {scoreData.score.red?.[5]?.[0]}

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
                  {playersData.white.name}
                </td>

                {settingsData.playerTitles.map((_title, index) => (
                  <React.Fragment key={index}>
                    <td className="h-[42px] w-[42px]"></td>
                    <td className="h-[42px] w-[42px] border-r border-black pb-0.5 pl-0.5 text-left align-bottom text-[2rem]">
                      {scoreData.score.white?.[index]?.[1]}
                    </td>
                  </React.Fragment>
                ))}

                <td className="border-r border-black text-[1.7rem]" rowSpan={2}>
                  <span>{scoreData.ippons.white}</span>
                  <div className="mx-[15%] my-[3px] h-[2px] w-[70%] bg-gray-900" />
                  <span>{scoreData.wins.white}</span>
                </td>

                {settingsData.daihyo && (
                  <>
                    <td className="relative h-[42px] w-[42px] pb-0.5 pr-0.5 text-right align-bottom text-[2rem]">
                      {scoreData.score.white?.[5]?.[0]}

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
                    className="input input-error"
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
                    className="input input-bordered"
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
                      className="input input-error"
                      value={playersData.red.players[index]?.name}
                      onChange={(e) =>
                        updatePlayerName('red', index, e.target.value)
                      }
                    />
                    <span className="w-16 text-lg">{title}</span>
                    <input
                      className="input input-bordered"
                      value={playersData.white.players[index]?.name}
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
                        className="input input-error"
                        value={playersData.red.daihyo.name}
                        onChange={(e) =>
                          updatePlayerName('red', 100, e.target.value)
                        }
                      />
                      <span className="w-16 text-lg">代表戦</span>
                      <input
                        className="input input-bordered"
                        value={playersData.white.daihyo.name}
                        onChange={(e) =>
                          updatePlayerName('white', 100, e.target.value)
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
              <h3 className="mb-5 text-lg font-bold">表設定変更</h3>

              <table className="table w-full">
                <tbody>
                  <tr>
                    <td className="text-right text-base">選手人数 (3~7人)</td>
                    <td className="w-1/2">
                      <div className="join">
                        <button
                          className="btn join-item"
                          type="button"
                          onClick={() =>
                            setSettingsData({
                              ...settingsData,
                              playerCount:
                                settingsData.playerCount - 1 < 3
                                  ? 3
                                  : settingsData.playerCount - 1,
                            })
                          }
                        >
                          －
                        </button>
                        <input
                          className="input join-item input-bordered w-14"
                          type="number"
                          min={3}
                          max={7}
                          value={settingsData.playerCount}
                          onChange={(e) =>
                            setSettingsData({
                              ...settingsData,
                              playerCount: Number(e.target.value),
                            })
                          }
                        />
                        <button
                          className="btn join-item"
                          type="button"
                          onClick={() =>
                            setSettingsData({
                              ...settingsData,
                              playerCount:
                                settingsData.playerCount + 1 > 7
                                  ? 7
                                  : settingsData.playerCount + 1,
                            })
                          }
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
        <div className="mt-7 flex justify-center gap-4 text-center">
          <button className="btn" onClick={() => changePlayer('prev')}>
            <ArrowLeftIcon className="h-5 w-5" />
            前選手へ
          </button>
          <button className="btn" onClick={() => changePlayer('next')}>
            次選手へ
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 max-w-3xl">
          {JSON.stringify(settingsData)}
          <br />
          {JSON.stringify(playersData)}
          <br />
          {JSON.stringify(scoreData)}
        </div>

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
            <div className="alert gap-2 bg-gray-800 text-white">
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
      </main>
    </div>
  );
}

export default App;
