import { useAtomValue } from 'jotai';
import { stateAtom } from '../scripts/jotai';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

export default function MessageDialog() {
  const stateData = useAtomValue(stateAtom);

  return (
    <dialog id="message_dialog" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="mb-3 text-lg font-bold">
          {stateData.messageDialog.type === 'error' && (
            <div className="flex items-center gap-1">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              エラー
            </div>
          )}
          {stateData.messageDialog.type === 'info' && (
            <div className="flex items-center gap-1">
              <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              メッセージ
            </div>
          )}
          {stateData.messageDialog.type === 'success' && (
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              成功
            </div>
          )}
        </h3>

        {stateData.messageDialog.message}

        <div className="modal-action">
          <button type="submit" className="btn">
            OK
          </button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
