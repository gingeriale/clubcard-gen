interface YearSelectorProps {
  selectedYear: 'current' | 'next';
  setSelectedYear: React.Dispatch<React.SetStateAction<'current' | 'next'>>;
}

export default function YearSelector({ selectedYear, setSelectedYear }: YearSelectorProps) {
  return (
    <div className='flex justify-center gap-6 mb-4'>
      <div className='font-bold'>
        Year:
      </div>
      <label className='flex items-center gap-2 cursor-pointer'>
        <input
          type='radio'
          name='year'
          value='current'
          checked={selectedYear === 'current'}
          onChange={() => setSelectedYear('current')}
          className='accent-clubgreen cursor-pointer'
        />
        Current
      </label>
      <label className='flex items-center gap-2 cursor-pointer'>
        <input
          type='radio'
          name='year'
          value='next'
          checked={selectedYear === 'next'}
          onChange={() => setSelectedYear('next')}
          className='accent-clubgreen cursor-pointer'
        />
        Next
      </label>
    </div>
  );
}