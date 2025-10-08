import { parseNames } from '../utils';

interface DownloadButtonProps {
  onClick: () => void;
  names: string[];
  rawNames: string;
}

export default function DownloadButton({ onClick, names, rawNames }: DownloadButtonProps) {
  const isDisabled = names.length === 0;
  const isEmpty = parseNames(rawNames).length === 0;
  
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-xl text-white transition-colors ${
        isEmpty
          ? 'bg-neutral-400 cursor-not-allowed'
          : 'bg-clubgreen hover:opacity-90 cursor-pointer'
      }`}
    >
      Download PDF{names.length > 1 ? 's' : ''}
    </button>
  );
}