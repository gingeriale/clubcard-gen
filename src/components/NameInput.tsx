import { parseNames } from '../utils';

interface NameInputProps {
  rawNames: string;
  setRawNames: React.Dispatch<React.SetStateAction<string>>;
}

export default function NameInput({ rawNames, setRawNames }: NameInputProps) {
  const names = parseNames(rawNames);

  return (
    <div className='relative w-full max-w-md mb-10'>
      <textarea
        className='w-full bg-transparent outline-none px-3 py-2 text-left resize-y'
        name='names'
        rows={4}
        value={rawNames}
        onChange={(e) => setRawNames(e.target.value)}
        placeholder='Enter name (or multiple names, comma or new line separated)'
      />
      <span className='pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-clubgreen' />
      <span className='pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-clubgreen scale-x-0 focus-within:scale-x-100 transition-transform duration-150 origin-left' />
      <div className='absolute left-0 -bottom-5 text-xs sm:text-sm text-neutral-600'>
        {names.length} card{names.length === 1 ? '' : 's'} will be generated
      </div>
    </div>
  );
}