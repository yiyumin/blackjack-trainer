import { Tab } from '@headlessui/react';
import ContentWrapper from './ContentWrapper';
import Controls from './Controls';
import QuickGuide from './QuickGuide';
import Settings from './Settings';
import Statistics from './Statistics';

const tabs = [
  { label: 'Quick Guide', content: <QuickGuide /> },
  { label: 'Settings', content: <Settings /> },
  { label: 'Controls', content: <Controls /> },
  { label: 'Statistics', content: <Statistics /> },
];

const HowToPlay = () => {
  return (
    <div className='w-4/5 py-8'>
      <Tab.Group>
        <Tab.List className='flex space-x-1 rounded-xl bg-white/20 p-1'>
          {tabs.map((tab, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                `w-full rounded-lg py-1 text-xs font-medium leading-5 md:py-2.5 md:text-sm ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-5'>
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx}>
              <ContentWrapper>{tab.content}</ContentWrapper>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default HowToPlay;
