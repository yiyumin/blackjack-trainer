const QuickGuide = () => {
  return (
    <>
      <h1 className='text-center text-xl font-bold'>Quick Guide</h1>

      <div>
        Welcome to blackjack trainer! This application will help you to
        fine-tune your blackjack game and find your common weaknesses. This
        particular application is tailored for &quot;Multiple Decks (4+), Dealer
        Stands on Soft 17&quot; using this chart{' '}
        <a
          href='https://www.jackace.com/gambling/blackjack/systems/basic-strategy/charts/MD_S17/'
          target='_blank'
          rel='noreferrer'
          className='underline decoration-green-500'
        >
          here
        </a>
        .
      </div>

      <div className='flex flex-col gap-y-2.5'>
        <h3 className='text-lg font-medium'>Getting Started</h3>
        <ol className='ml-2.5 list-inside list-decimal space-y-6 text-sm'>
          <li>
            <span className='text-base font-bold'>Adjust game settings </span>
            such as whether doubling down is allowed or which type of hands to
            deal by clicking on the gear icon in the top right corner.
          </li>
          <li>
            <span className='text-base font-bold'>Practice!</span> After cards
            are dealt, simply select what you believe to be the correct move.
          </li>
          <li>
            <span className='text-base font-bold'>
              View your hand statistics{' '}
            </span>
            to determine which hands you need more practice with by clicking on
            the bar chart icon in the top right corner.
          </li>
        </ol>
      </div>
    </>
  );
};

export default QuickGuide;
