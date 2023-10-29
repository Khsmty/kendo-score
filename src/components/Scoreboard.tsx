import React from 'react';
import { useAtomValue } from 'jotai';
import { playersAtom, scoreAtom, settingsAtom } from '../scripts/jotai';
import { CircleSvg, SquareSvg, TriangleSvg } from './SvgIcons';

export default function Scoreboard() {
  const scoreData = useAtomValue(scoreAtom);
  const playersData = useAtomValue(playersAtom);
  const settingsData = useAtomValue(settingsAtom);

  return (
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
                'w-[84px]' + (scoreData.playing === 99 ? ' bg-green-300' : '')
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
  );
}
