import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

export default function HelpBtn() {
  return (
    <div className="fixed bottom-4 right-4">
      <a
        href="https://taigasaito.org/kendo-score/"
        target="_blank"
        className="btn btn-sm gap-1"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" />
        ヘルプ
      </a>
    </div>
  );
}
