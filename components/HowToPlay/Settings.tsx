const Settings = () => {
  return (
    <>
      <h1 className='text-center text-xl font-bold'>Settings</h1>

      <div>
        To adjust your settings, begin by clicking on the gear icon in the top
        right corner.
      </div>

      <ol className='ml-2.5 list-inside list-disc space-y-6 text-sm'>
        <li>
          Adjust your
          <span className='text-base font-bold'> game settings </span>
          by switching any of the options on or off. All casinos have different
          rules on what is and isn&apos;t allowed and the correct move for a
          given hand may change depending on it.
        </li>
        <li>
          Specify the type of hands to
          <span className='text-base font-bold'> practice</span> by selecting
          one of the options in the dropdown list. By default, all hands are
          shown but you can specify a hand type such as pairs, soft hands, hard
          hands, or even more specific hands like soft 16s to focus your
          practice on your weaknesses.
        </li>
      </ol>
    </>
  );
};

export default Settings;
