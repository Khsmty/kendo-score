import { useState, useRef } from 'react';
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

function App() {
  const [settingsData, setSettingsData] = useState(initSettingsData);
  const [playersData, setPlayersData] = useState(initPlayersData);
  const [scoreData, setScoreData] = useState(initScoreData);
  const [messageDialog, setMessageDialog] = useState({
    type: 'info' as 'error' | 'info' | 'success',
    message: '',
  });

  useRegisterSW({
    onOfflineReady() {
      openMessageDialog(
        'info',
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

    if (scoreData.score[team][scoreData.playing].length >= 4) {
      openMessageDialog(
        'error',
        '上限に達しました。[次選手へ] を押してください。',
      );
      return;
    }

    if (type === '▲' && scoreData.hansoku[team][scoreData.playing]) {
      type = '反';
      scoreData.hansoku[team][scoreData.playing] = false;

      // 1本目が▲だった場合は、first を移動
      if (
        scoreData.playing !== 5 &&
        scoreData.score[team][scoreData.playing][0] === '▲' &&
        playersData[team].players[scoreData.playing].first !== 0
      ) {
        playersData[team].players[scoreData.playing].first! -= 2;
      }

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
      const numbers = [
        [1, 3, 2, 4],
        [5, 7, 6, 8],
        [9, 11, 10, 12],
        [13, 15, 14, 16],
        [17, 19, 18, 20],
      ];
      let i = team === 'red' ? 0 : 2;

      if (scoreData.score[team][scoreData.playing].length === 1) {
        i++;
      }

      playersData[team].players[scoreData.playing].first =
        numbers[scoreData.playing][i];
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
      playersData[team].players[scoreData.playing].first = 0;
    }

    setScoreData({ ...scoreData });
    calcWinPoint();
  }

  function changePlayer(type: 'next' | 'prev') {
    // 勝数と一本数が同じときは、代表戦へ
    if (
      type === 'next' &&
      scoreData.playing === 4 &&
      (scoreData.result.wins.red !== scoreData.result.wins.white ||
        (scoreData.result.wins.red === scoreData.result.wins.white &&
          scoreData.result.ippons.red !== scoreData.result.ippons.white)) &&
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
      (scoreData.result.wins.red !== scoreData.result.wins.white ||
        (scoreData.result.wins.red === scoreData.result.wins.white &&
          scoreData.result.ippons.red !== scoreData.result.ippons.white))
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
          first: 0,
        };
      }
      if (!playersData.white.players[scoreData.playing]) {
        playersData.white.players[scoreData.playing] = {
          name: '',
          first: 0,
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
        scoreData.result.draw[i] = false;
      } else if (red > white) {
        winCount.red++;
        scoreData.result.draw[i] = false;
      } else if (i < scoreData.playing) {
        scoreData.result.draw[i] = true;
      } else {
        scoreData.result.draw[i] = false;
      }

      scoreData.result.ippons.red = ipponCount.red;
      scoreData.result.ippons.white = ipponCount.white;
      scoreData.result.wins.red = winCount.red;
      scoreData.result.wins.white = winCount.white;
    }
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
      }));
    }
    if (type === 'players' || type === 'all') {
      // TODO: 本当は initPlayersData を使いたい
      setPlayersData((prevState) => ({
        ...prevState,
        red: {
          name: '',
          players: [],
        },
        white: {
          name: '',
          players: [],
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
              <tr className="h-[51px] border-b border-black">
                <th className="w-[170px] border-r border-black">団体名</th>

                {settingsData.playerTitles.map((title, index) => (
                  <th
                    className={
                      'w-[84px] border-r border-black' +
                      (scoreData.playing === index ? ' bg-green-300' : '')
                    }
                    colSpan={2}
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
                    style={{ width: '80px' }}
                  >
                    代表戦
                  </th>
                )}
              </tr>

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
                  >
                    {playersData.red.players[index]?.name}
                  </td>
                ))}

                {settingsData.daihyo && (
                  <td className="h-[63px] bg-red-100">
                    {playersData.red.players[5]?.name}
                  </td>
                )}
              </tr>

              <tr>
                {settingsData.playerTitles.map((_title, index) => (
                  <>
                    <td className="h-[42px] w-[42px] text-[1.7rem]">
                      {scoreData.score.red?.[index]?.[0]}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                      {scoreData.score.red?.[index]?.[1]}
                    </td>
                  </>
                ))}

                <td className="border-r border-black text-[1.7rem]" rowSpan={2}>
                  <span>{scoreData.result.ippons.red}</span>
                  <div className="mx-[15%] my-[3px] h-[2px] w-[70%] bg-gray-900" />
                  <span>{scoreData.result.wins.red}</span>
                </td>

                {settingsData.daihyo && (
                  <td className="h-[42px] w-[80px] text-[1.7rem]">
                    {scoreData.score.red?.[5]?.[0]}
                  </td>
                )}
              </tr>

              <tr className="border-b border-black">
                {settingsData.playerTitles.map((_title, index) => (
                  <>
                    <td className="h-[42px] w-[42px] text-[1.7rem]">
                      {scoreData.score.red?.[index]?.[2]}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                      {scoreData.score.red?.[index]?.[3]}
                    </td>
                  </>
                ))}

                {settingsData.daihyo && (
                  <td className="h-[42px] w-[80px] text-[1.7rem]">
                    {scoreData.score.red?.[5]?.[1]}
                  </td>
                )}
              </tr>

              <tr>
                <td
                  className="h-[147px] w-[170px] border-r border-black bg-gray-200 p-3"
                  rowSpan={3}
                >
                  {playersData.white.name}
                </td>

                {settingsData.playerTitles.map((_title, index) => (
                  <>
                    <td className="h-[42px] w-[42px] text-[1.7rem]">
                      {scoreData.score.white?.[index]?.[0]}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                      {scoreData.score.white?.[index]?.[1]}
                    </td>
                  </>
                ))}

                <td className="border-r border-black text-[1.7rem]" rowSpan={2}>
                  <span>{scoreData.result.ippons.white}</span>
                  <div className="mx-[15%] my-[3px] h-[2px] w-[70%] bg-gray-900" />
                  <span>{scoreData.result.wins.white}</span>
                </td>

                {settingsData.daihyo && (
                  <td className="h-[42px] w-[80px] text-[1.7rem]">
                    {scoreData.score.white?.[5]?.[0]}
                  </td>
                )}
              </tr>

              <tr className="border-b border-black">
                {settingsData.playerTitles.map((_title, index) => (
                  <>
                    <td className="h-[42px] w-[42px] text-[1.7rem]">
                      {scoreData.score.white?.[index]?.[2]}
                    </td>
                    <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                      {scoreData.score.white?.[index]?.[3]}
                    </td>
                  </>
                ))}

                {settingsData.daihyo && (
                  <td className="h-[42px] w-[80px] text-[1.7rem]">
                    {scoreData.score.white?.[5]?.[1]}
                  </td>
                )}
              </tr>

              <tr>
                {settingsData.playerTitles.map((_title, index) => (
                  <td
                    className="h-[63px] border-r border-black bg-gray-200"
                    colSpan={2}
                  >
                    {playersData.white.players[index]?.name}
                  </td>
                ))}

                <td className="border-r border-black"></td>

                {settingsData.daihyo && (
                  <td className="h-[63px] bg-gray-200">
                    {playersData.white.players[5]?.name}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

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
                  <div className="flex items-center justify-center gap-3">
                    <input
                      className="input input-error"
                      value={playersData.red.players[index]?.name}
                      onChange={(e) =>
                        setPlayersData((prevState) => ({
                          ...prevState,
                          red: {
                            ...prevState.red,
                            players: prevState.red.players.map((player, i) =>
                              i === index
                                ? { ...player, name: e.target.value }
                                : player,
                            ),
                          },
                        }))
                      }
                    />
                    <span className="w-16 text-lg">{title}</span>
                    <input
                      className="input input-bordered"
                      value={playersData.white.players[index]?.name}
                      onChange={(e) =>
                        setPlayersData((prevState) => ({
                          ...prevState,
                          white: {
                            ...prevState.white,
                            players: prevState.white.players.map((player, i) =>
                              i === index
                                ? { ...player, name: e.target.value }
                                : player,
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                ))}

                {settingsData.daihyo && (
                  <>
                    <hr className="border-b-gray-400" />
                    <div className="flex items-center justify-center gap-3">
                      <input className="input input-error" />
                      <span className="w-16 text-lg">代表戦</span>
                      <input className="input input-bordered" />
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

          <dialog id="config_modal" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="mb-5 text-lg font-bold">表設定変更</h3>

              <div className="join">
                <button className="btn join-item" type="button">
                  －
                </button>
                <input
                  className="input join-item input-bordered w-14"
                  type="number"
                  min={3}
                  max={7}
                  value={5}
                />
                <button className="btn join-item" type="button">
                  ＋
                </button>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">代表戦</span>
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

              <div className="modal-action">
                <button className="btn">閉じる</button>
              </div>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

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

        {/* スコア入力ボタン */}
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

        {/* 選手切り替えボタン */}
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
      </main>
    </div>
  );
}

export default App;
