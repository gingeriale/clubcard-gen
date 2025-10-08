interface MembershipTypeSelectorProps {
  membershipType: 'Freediver' | 'Snorkeller';
  setMembershipType: React.Dispatch<React.SetStateAction<'Freediver' | 'Snorkeller'>>;
}

export default function MembershipTypeSelector({ membershipType, setMembershipType }: MembershipTypeSelectorProps) {
  return (
    <div className='flex justify-center gap-6 mb-6'>
      <div className='font-bold'>
        Membership type:
      </div>
      <label className='flex items-center gap-2 cursor-pointer'>
        <input
          type='radio'
          name='membership'
          value='Freediver'
          checked={membershipType === 'Freediver'}
          onChange={() => setMembershipType('Freediver')}
          className='accent-clubgreen cursor-pointer'
        />
        Freediver
      </label>
      <label className='flex items-center gap-2 cursor-pointer'>
        <input
          type='radio'
          name='membership'
          value='Snorkeller'
          checked={membershipType === 'Snorkeller'}
          onChange={() => setMembershipType('Snorkeller')}
          className='accent-clubgreen cursor-pointer'
        />
        Snorkeller
      </label>
    </div>
  );
}