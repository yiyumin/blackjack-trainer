import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Popover } from '@headlessui/react';
import {
  ChevronDoubleDownIcon,
  ScissorsIcon,
  FlagIcon,
} from '@heroicons/react/solid';
import { TrashIcon } from '@heroicons/react/outline';

import {
  DealerKey,
  HandKey,
  HandStatDisplay,
  HandType,
  HeroIcon,
  Modifier,
  ModifierType,
  Stats,
} from '../lib/types';
import {
  getHandFriendlyName,
  getHandStatsToDisplay,
  MODIFIER_TEXT,
} from '../lib/blackjack';

import ModifierIcon from './ModifierIcon';
import ConfirmationPopover from './ConfirmationPopover';
import StatisticsOverall from './StatisticsOverall';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    deleteRow: (
      handType: HandType,
      playerHandKey: HandKey,
      dealerKey: DealerKey,
      modifier?: Modifier
    ) => void;

    deleteCurrentRows: () => void;
  }
}

const MODIFIER_ICON: Record<ModifierType, HeroIcon> = {
  double_down: ChevronDoubleDownIcon,
  double_down_after_split: ScissorsIcon,
  surrender: FlagIcon,
};

const columnHelper = createColumnHelper<HandStatDisplay<HandKey>>();

const columns = [
  columnHelper.group({
    id: 'headerStat',
    header: ({ table }) => {
      const { timesCorrect, timesSeen } = table.getRowModel().rows.reduce(
        (curr, row) => {
          curr.timesCorrect += row.original.timesCorrect;
          curr.timesSeen += row.original.timesSeen;

          return curr;
        },
        { timesCorrect: 0, timesSeen: 0 }
      );

      return (
        <div className='relative flex justify-center border-b bg-slate-800 py-2 text-white'>
          <StatisticsOverall
            handsPlayed={timesSeen}
            handsPlayedCorrect={timesCorrect}
          />
          <div className='absolute right-5 top-1/2 -translate-y-1/2'>
            {timesSeen !== 0 && (
              <ConfirmationPopover
                openPopoverElement={
                  <TrashIcon className='h-8 w-8 stroke-slate-500 transition-colors hover:stroke-slate-600' />
                }
                message='Are you sure you want reset all currently hands displayed?'
                onConfirm={() => table.options.meta?.deleteCurrentRows()}
                buttonLabel='open reset all currently displayed hands confirmation popover'
              />
            )}
          </div>
        </div>
      );
    },
    columns: [
      columnHelper.accessor(
        (row) => getHandFriendlyName(row.handType, row.playerHandKey),
        {
          id: 'playerHand',
          cell: ({
            getValue,
            row: {
              original: { modifier },
            },
          }) => (
            <div className='relative pr-5 text-left md:pr-10'>
              {getValue()}
              {modifier != null && (
                <Popover className='absolute inset-y-0 right-1 md:right-2'>
                  <Popover.Button className='underline decoration-dotted'>
                    <ModifierIcon
                      Icon={MODIFIER_ICON[modifier.type]}
                      allowed={modifier.allowed}
                    />
                  </Popover.Button>
                  <Popover.Panel className='absolute z-10 w-40 -translate-x-1/4 rounded-md bg-slate-300 p-2.5 text-sm text-black md:-translate-x-1/2'>
                    when {MODIFIER_TEXT[modifier.type]} is{' '}
                    {modifier.allowed ? '' : 'not '}possible
                  </Popover.Panel>
                </Popover>
              )}
            </div>
          ),
          header: 'Player Hand',
          size: 80,
        }
      ),
      columnHelper.accessor('dealerKey', {
        cell: ({ getValue }) =>
          getValue() === '10' ? '10 (J/Q/K)' : getValue(),
        header: 'Dealer Showing',
        size: 60,
      }),
      columnHelper.accessor('timesCorrect', {
        header: 'Times Correct',
        size: 32,
      }),
      columnHelper.accessor('timesSeen', {
        header: 'Times Seen',
        size: 32,
      }),
      columnHelper.accessor((row) => row.timesCorrect / row.timesSeen, {
        id: 'correctPercent',
        cell: ({ getValue }) => (getValue() * 100).toFixed(2),
        header: 'Correct %',
        size: 60,
      }),
      columnHelper.accessor('correctMove', {
        cell: ({
          getValue,
          row: {
            original: { correctMoveDetailed },
          },
        }) => (
          <Popover className='relative'>
            <Popover.Button className='underline decoration-dotted'>
              {getValue()}
            </Popover.Button>
            <Popover.Panel className='absolute right-3 z-10 w-40 rounded-md bg-slate-300 p-2.5 text-sm text-black'>
              {correctMoveDetailed}
            </Popover.Panel>
          </Popover>
        ),
        header: 'Correct Move',
        size: 60,
      }),
      columnHelper.display({
        id: 'resetHandStat',
        cell: ({ row: { original }, table }) => (
          <ConfirmationPopover
            openPopoverElement={
              <TrashIcon className='h-4 w-4 stroke-slate-500 transition-colors hover:stroke-slate-600' />
            }
            message='Are you sure you want reset this hand?'
            onConfirm={() =>
              table.options.meta?.deleteRow(
                original.handType,
                original.playerHandKey,
                original.dealerKey,
                original.modifier
              )
            }
            buttonLabel='open reset this hand confirmation popover'
          />
        ),
        size: 32,
      }),
    ],
  }),
];

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
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'correctPercent', desc: false },
    { id: 'timesSeen', desc: true },
  ]);
  const data = useMemo(() => getHandStatsToDisplay(stats), [stats]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: handTypeFilter },
    globalFilterFn: (row, columnId, filterValue) =>
      filterValue === undefined || row.original.handType === filterValue,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      deleteRow: (handType, playerHandKey, dealerKey, modifier?) => {
        resetHandStat(handType, playerHandKey, dealerKey, modifier);
      },
      deleteCurrentRows: () => {
        resetAllHandStatsOfHandType(handTypeFilter);
      },
    },
  });

  return (
    <div className='h-[55vh] overflow-y-auto px-1 md:h-[60vh]'>
      <table className='w-full'>
        <thead className='sticky top-0 z-20 bg-slate-500'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className='flex'>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className='p-0'
                  style={{
                    flex: `${header.getSize()} 0 auto`,
                    width: `${header.getSize()}px`,
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`h-full ${
                        header.column.id !== 'headerStat'
                          ? 'overflow-hidden text-ellipsis text-xs font-normal text-white md:text-sm md:font-bold'
                          : ''
                      } ${
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className='text-xs'>
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className='flex bg-white text-center dark:bg-black'
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='border border-slate-700 text-xs md:text-base'
                    style={{
                      flex: `${cell.column.getSize()} 0 auto`,
                      width: `${cell.column.getSize()}px`,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className='flex h-24 items-center justify-center italic'>
              <td>No Data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsTable;
