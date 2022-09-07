const Statistics = () => {
  return (
    <>
      <h1 className='text-center text-xl font-bold'>Statistics</h1>

      <div>
        To view your hand statistics, begin by clicking on the bar chart icon in
        the top right corner. By default, the records are sorted to show
        scenarios with the lowest correct percentage first.
      </div>

      <ol className='ml-2.5 list-inside list-disc space-y-6 text-sm'>
        <li>
          <span className='font-bold'>Sort </span>
          the table by clicking on any of the column headers. You are able to
          sort by multiple columns by holding shift before clicking on the
          column headers.
        </li>
        <li>
          <span className='font-bold'>Filter </span> the table to show only
          certain hand types such as pairs by clicking on one of the filter
          options below the table.
        </li>
        <li>
          Be aware that certain hands have
          <span className='font-bold'> modifiers</span>. This is indicated by a
          red asterisk next to the hand name. Depending on the game settings,
          certain identical hands have differing correct moves. Hover over these
          rows with modifiers to accurately determine which scenario this is.
        </li>
      </ol>
    </>
  );
};

export default Statistics;
