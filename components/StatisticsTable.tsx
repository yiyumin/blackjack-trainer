import { useCallback, useEffect, useMemo } from 'react';
import {
  Column,
  useTable,
  useFlexLayout,
  useSortBy,
  useGlobalFilter,
  Row,
} from 'react-table';
import { Popover } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';

import {
  ChevronDoubleDownIcon,
  ScissorsIcon,
  FlagIcon,
} from '@heroicons/react/solid';

import {
  DealerKey,
  HandKey,
  Modifier,
  HandStatDisplay,
  HandType,
  HeroIcon,
  ModifierType,
  Stats,
} from '../types';
import {
  getHandFriendlyName,
  getHandStatsToDisplay,
  MODIFIER_TEXT,
} from '../lib/blackjack';

import StatisticsOverall from './StatisticsOverall';
import ConfirmationPopover from './ConfirmationPopover';
import ModifierIcon from './ModifierIcon';

const MODIFIER_ICON: Record<ModifierType, HeroIcon> = {
  double_down: ChevronDoubleDownIcon,
  double_down_after_split: ScissorsIcon,
  surrender: FlagIcon,
};

type StatisticsTableProps = {
  stats: Stats;
  handTypeFilter?: HandType;
  resetHandStat: (
    handType: HandType,
    playerHandKey: HandKey,
    dealerKey: DealerKey,
    modifier?: Modifier
  ) => void;
  resetAllHandStatsOfHandType: (handType?: HandType) => void;
};

const StatisticsTable = ({
  stats,
  handTypeFilter,
  resetHandStat,
  resetAllHandStatsOfHandType,
}: StatisticsTableProps) => {
  const initialState = useMemo(
    () => ({
      sortBy: [{ id: 'correctPercent' }, { id: 'timesSeen', desc: true }],
      globalFilter: handTypeFilter,
      hiddenColumns: ['modifier', 'handType'],
    }),
    [handTypeFilter]
  );

  const handTypeGlobalFilter = useCallback(
    (
      rows: Row<HandStatDisplay<HandKey>>[],
      columnIds: string[],
      globalFilterValue?: HandType
    ) => {
      if (globalFilterValue == null) {
        return rows;
      }

      return rows.filter((row) => row.values['handType'] === globalFilterValue);
    },
    []
  );

  const sortByNumber = useCallback(
    (
      rowA: Row<HandStatDisplay<HandKey>>,
      rowB: Row<HandStatDisplay<HandKey>>,
      columnId: string
    ) => {
      if (rowA.values[columnId] > rowB.values[columnId]) {
        return 1;
      }

      if (rowB.values[columnId] > rowA.values[columnId]) {
        return -1;
      }

      return 0;
    },
    []
  );

  const data = useMemo(() => getHandStatsToDisplay(stats), [stats]);

  const columns = useMemo(
    () =>
      [
        {
          id: 'headerStat',
          Header: ({ rows, state }) => {
            const { timesCorrect, timesSeen } = useMemo(() => {
              const total = rows.reduce(
                (curr, row) => {
                  curr.timesCorrect += row.values.timesCorrect;
                  curr.timesSeen += row.values.timesSeen;

                  return curr;
                },
                { timesCorrect: 0, timesSeen: 0 }
              );

              return total;
            }, [rows]);

            return (
              <div className='relative flex justify-center border-b bg-slate-800 py-2'>
                <StatisticsOverall
                  handsPlayed={timesSeen}
                  handsPlayedCorrect={timesCorrect}
                />
                <div className='absolute right-5 top-1/2 -translate-y-1/2'>
                  {timesSeen !== 0 && (
                    <ConfirmationPopover
                      openPopoverElement={
                        <TrashIcon className='h-8 w-8 stroke-[#878a8c]' />
                      }
                      message='Are you sure you want reset all currently hands displayed?'
                      onConfirm={() =>
                        resetAllHandStatsOfHandType(state.globalFilter)
                      }
                    />
                  )}
                </div>
              </div>
            );
          },
          columns: [
            {
              Header: 'Player Hand',
              id: 'playerHand',
              accessor: (row) =>
                getHandFriendlyName(row.handType, row.playerHandKey),
              Cell: ({
                row,
                value,
              }: {
                row: Row<HandStatDisplay<HandKey>>;
                value: string;
              }) => (
                <div className='relative pr-5 text-left md:pr-10'>
                  {value}
                  {row.original.modifier != null && (
                    <Popover className='absolute inset-y-0 right-1 md:right-2'>
                      <Popover.Button className='underline decoration-dotted'>
                        <ModifierIcon
                          Icon={MODIFIER_ICON[row.original.modifier.type]}
                          allowed={row.original.modifier.allowed}
                        />
                      </Popover.Button>
                      <Popover.Panel className='absolute z-10 w-40 -translate-x-1/4 rounded-md bg-slate-300 p-2.5 text-sm text-black md:-translate-x-1/2'>
                        when {MODIFIER_TEXT[row.original.modifier.type]} is{' '}
                        {row.original.modifier.allowed ? '' : 'not '}possible
                      </Popover.Panel>
                    </Popover>
                  )}
                </div>
              ),
              width: 80,
            },
            {
              Header: 'Dealer Showing',
              accessor: 'dealerKey',
              Cell: ({ value }) => (value === '10' ? '10 (J/Q/K)' : value),
              width: 60,
            },
            {
              Header: 'Times Correct',
              accessor: 'timesCorrect',
              width: 32,
            },
            {
              Header: 'Times Seen',
              accessor: 'timesSeen',
              width: 32,
            },
            {
              Header: 'Correct %',
              accessor: (row) => row.timesCorrect / row.timesSeen,
              id: 'correctPercent',
              Cell: ({ value }: { value: number }) => (value * 100).toFixed(2),
              width: 60,
              sortType: sortByNumber,
            },
            {
              Header: 'Correct Move',
              accessor: 'correctMove',
              Cell: ({ row, value }) => (
                <Popover className='relative'>
                  <Popover.Button className='underline decoration-dotted'>
                    {value}
                  </Popover.Button>
                  <Popover.Panel className='absolute right-3 z-10 w-40 rounded-md bg-slate-300 p-2.5 text-sm text-black'>
                    {row.original.correctMoveDetailed}
                  </Popover.Panel>
                </Popover>
              ),
              width: 60,
            },
            {
              id: 'resetHandStat',
              Cell: ({ row }: { row: Row<HandStatDisplay<HandKey>> }) => (
                <ConfirmationPopover
                  openPopoverElement={
                    <TrashIcon className='h-4 w-4 stroke-[#878a8c]' />
                  }
                  message='Are you sure you want reset this hand?'
                  onConfirm={() =>
                    resetHandStat(
                      row.original.handType,
                      row.original.playerHandKey,
                      row.original.dealerKey,
                      row.original.modifier
                    )
                  }
                />
              ),
              width: 32,
            },
          ],
        },
        { accessor: 'handType' },
      ] as Column<HandStatDisplay<HandKey>>[],
    [resetHandStat, resetAllHandStatsOfHandType, sortByNumber]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    { columns, data, initialState, globalFilter: handTypeGlobalFilter },
    useFlexLayout,
    useGlobalFilter,
    useSortBy
  );

  useEffect(() => {
    setGlobalFilter(handTypeFilter);
  }, [setGlobalFilter, handTypeFilter]);

  return (
    <div className='h-[55vh] w-full space-y-1 overflow-y-auto px-1 md:h-[60vh]'>
      <table {...getTableProps()} className='w-full'>
        <thead className='sticky top-0 z-20 bg-slate-500'>
          {headerGroups.map((headerGroup, headerGroupIdx) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIdx}>
              {headerGroup.headers.map((column, columnIdx) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={columnIdx}
                  className={`p-0 ${
                    column.id !== 'headerStat_0'
                      ? 'overflow-hidden text-ellipsis text-xs font-normal md:text-sm md:font-bold'
                      : ''
                  }`}
                >
                  {column.render('Header')}

                  <span className='text-xs'>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row, rowIdx) => {
              prepareRow(row);

              return (
                <tr
                  {...row.getRowProps()}
                  key={rowIdx}
                  className='bg-black text-center'
                >
                  {row.cells.map((cell, cellIdx) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cellIdx}
                        className='border border-slate-700 text-xs md:text-base'
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr className='flex h-24 items-center justify-center italic'>
              No Data
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsTable;
