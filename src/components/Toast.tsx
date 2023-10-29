import { useAtom } from 'jotai';
import { stateAtom } from '../scripts/jotai';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

export default function Toast() {
  const [stateData, setStateData] = useAtom(stateAtom);

  return (
    <>
      {stateData.toast.show && (
        <div className="toast toast-center">
          <div className="alert max-w-[90vw] gap-2 bg-gray-800 text-white">
            <InformationCircleIcon className="h-5 w-5" />
            <span>{stateData.toast.message}</span>
            <div>
              <button
                className="btn btn-sm"
                onClick={() =>
                  setStateData({
                    ...stateData,
                    toast: { show: false, message: '' },
                  })
                }
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
