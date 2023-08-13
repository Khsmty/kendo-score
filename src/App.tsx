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

  function reset(type: 'score' | 'players' | 'all') {
    if (type === 'score' || type === 'players' || type === 'all') {
      setScoreData(initScoreData);
    }
    if (type === 'players' || type === 'all') {
      setPlayersData(initPlayersData);
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
                <th
                  className={
                    'w-[84px] border-r border-black' +
                    (scoreData.playing === 0 ? 'nowplaying' : '')
                  }
                  colSpan={2}
                >
                  先鋒
                </th>
                <th
                  className={
                    'w-[84px] border-r border-black' +
                    (scoreData.playing === 1 ? 'nowplaying' : '')
                  }
                  colSpan={2}
                >
                  次鋒
                </th>
                <th
                  className={
                    'w-[84px] border-r border-black' +
                    (scoreData.playing === 2 ? 'nowplaying' : '')
                  }
                  colSpan={2}
                >
                  中堅
                </th>
                <th
                  className={
                    'w-[84px] border-r border-black' +
                    (scoreData.playing === 3 ? 'nowplaying' : '')
                  }
                  colSpan={2}
                >
                  副将
                </th>
                <th
                  className={
                    'w-[84px] border-r border-black' +
                    (scoreData.playing === 4 ? 'nowplaying' : '')
                  }
                  colSpan={2}
                >
                  大将
                </th>
                <th className="w-[80px] border-r border-black" rowSpan={2}>
                  勝点
                </th>

                {settingsData.daihyo && (
                  <th
                    className={
                      'w-[84px]' + (scoreData.playing === 5 ? 'nowplaying' : '')
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
                <td
                  className="h-[63px] border-r border-black bg-red-100"
                  colSpan={2}
                >
                  {playersData.red.players[0]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-red-100"
                  colSpan={2}
                >
                  {playersData.red.players[1]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-red-100"
                  colSpan={2}
                >
                  {playersData.red.players[2]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-red-100"
                  colSpan={2}
                >
                  {playersData.red.players[3]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-red-100"
                  colSpan={2}
                >
                  {playersData.red.players[4]?.name}
                </td>

                {settingsData.daihyo && (
                  <td className="h-[63px] bg-red-100">
                    {playersData.red.players[5]?.name}
                  </td>
                )}
              </tr>
              <tr>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[0]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[0]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[1]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[1]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[2]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[2]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[3]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[3]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[4]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[4]?.[1]}
                </td>
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
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[0]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[0]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[1]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[1]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[2]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[2]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[3]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[3]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.red?.[4]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.red?.[4]?.[3]}
                </td>

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
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[0]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[0]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[1]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[1]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[2]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[2]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[3]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[3]?.[1]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[4]?.[0]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[4]?.[1]}
                </td>
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
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[0]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[0]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[1]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[1]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[2]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[2]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[3]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[3]?.[3]}
                </td>
                <td className="h-[42px] w-[42px] text-[1.7rem]">
                  {scoreData.score.white?.[4]?.[2]}
                </td>
                <td className="h-[42px] w-[42px] border-r border-black text-[1.7rem]">
                  {scoreData.score.white?.[4]?.[3]}
                </td>

                {settingsData.daihyo && (
                  <td className="h-[42px] w-[80px] text-[1.7rem]">
                    {scoreData.score.white?.[5]?.[1]}
                  </td>
                )}
              </tr>
              <tr>
                <td
                  className="h-[63px] border-r border-black bg-gray-200"
                  colSpan={2}
                >
                  {playersData.white.players[0]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-gray-200"
                  colSpan={2}
                >
                  {playersData.white.players[1]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-gray-200"
                  colSpan={2}
                >
                  {playersData.white.players[2]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-gray-200"
                  colSpan={2}
                >
                  {playersData.white.players[3]?.name}
                </td>
                <td
                  className="h-[63px] border-r border-black bg-gray-200"
                  colSpan={2}
                >
                  {playersData.white.players[4]?.name}
                </td>
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
            <form method="dialog" className="modal-box max-w-[600px]">
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
                <div className="flex items-center justify-center gap-3">
                  <input className="input input-error" />
                  <span className="w-16 text-lg">先鋒</span>
                  <input className="input input-bordered" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <input className="input input-error" />
                  <span className="w-16 text-lg">次鋒</span>
                  <input className="input input-bordered" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <input className="input input-error" />
                  <span className="w-16 text-lg">中堅</span>
                  <input className="input input-bordered" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <input className="input input-error" />
                  <span className="w-16 text-lg">副将</span>
                  <input className="input input-bordered" />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <input className="input input-error" />
                  <span className="w-16 text-lg">大将</span>
                  <input className="input input-bordered" />
                </div>
                <hr className="border-b-gray-400" />
                <div className="flex items-center justify-center gap-3">
                  <input className="input input-error" />
                  <span className="w-16 text-lg">代表戦</span>
                  <input className="input input-bordered" />
                </div>
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

        <div className="mt-7 flex justify-center gap-4 text-center">
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-4">
              <button className="btn bg-red-700 text-white">コ</button>
              <button className="btn bg-red-700 text-white">ツ</button>
              <button className="btn bg-red-700 text-white">ド</button>
              <button className="btn bg-red-700 text-white">メ</button>
              <button className="btn bg-red-700 text-white">▲</button>
            </div>
            <div className="flex gap-4">
              <button className="btn bg-red-700 text-white">不戦勝</button>
              <button className="btn bg-red-700 text-white">取消</button>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="flex gap-4">
              <button className="btn bg-gray-500 text-white">コ</button>
              <button className="btn bg-gray-500 text-white">ツ</button>
              <button className="btn bg-gray-500 text-white">ド</button>
              <button className="btn bg-gray-500 text-white">メ</button>
              <button className="btn bg-gray-500 text-white">▲</button>
            </div>
            <div className="flex gap-4">
              <button className="btn bg-gray-500 text-white">不戦勝</button>
              <button className="btn bg-gray-500 text-white">取消</button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-center gap-4 text-center">
          <button className="btn">
            <ArrowLeftIcon className="h-5 w-5" />
            前選手へ
          </button>
          <button className="btn">
            次選手へ
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>

        {/* 共通ダイアログ */}
        <button
          className="btn"
          onClick={() => {
            setMessageDialog({
              type: 'success',
              message: 'エラーが発生しました。',
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            window.message_dialog.showModal();
          }}
        >
          open modal
        </button>
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
