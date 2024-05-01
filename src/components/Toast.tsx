import { useAtom } from 'jotai';
import { stateAtom } from '../scripts/jotai';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

export default function Toast() {
  const [stateData, setStateData] = useAtom(stateAtom);

  return (
    <>
      {stateData.toast.show && (
        <div className="toast toast-center z-50 w-max whitespace-normal">
          <div className="alert max-w-[90vw] gap-2 border-none bg-gray-800 text-white">
            <InformationCircleIcon className="hidden h-5 w-5 md:block" />
            <span>{stateData.toast.message}</span>
            <button
              type="button"
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
      )}
    </>
  );
}
