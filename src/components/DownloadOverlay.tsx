import { useAtomValue } from 'jotai';
import { stateAtom } from '../scripts/jotai';

export default function DownloadOverlay() {
  const stateData = useAtomValue(stateAtom);

  return (
    <>
      {stateData.isDownloading && (
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
    </>
  );
}
