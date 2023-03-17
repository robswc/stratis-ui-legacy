import React, {useMemo} from 'react';
import {useTable, Column, useSortBy} from 'react-table';
import {Order, Position} from '@/types/types';
import {getMoneyFormat} from "@/components/utils/utils";
import {HiOutlineArrowSmLeft, HiOutlineArrowSmRight, ImArrowLeft, ImArrowRight} from "react-icons/all";

type TableProps = {
    data: Position[];
    columns: Column<Position>[];
};

const PositionTable: React.FC<TableProps> = ({data, columns}) => {
    const tableData = useMemo(() => data, [data]);
    const tableColumns = useMemo(() => columns, [columns]);

    const tableInstance = useTable<Position>(
        {
            columns: tableColumns,
            data: tableData,
        },
        useSortBy
    );

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;

    return (
        <table {...getTableProps()} className='table table-zebra w-full'>
            <thead>
            {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index} className=''>
                    {headerGroup.headers.map((column, index) => (
                        // @ts-ignore
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}
                            key={index}
                            className='text-left cursor-pointer'>
                            <div className='btn btn-ghost btn-sm text-bold'>
                                {column.render('Header')}
                                <span className='ml-1'>
                                    {/*@ts-ignore*/}
                                    {column.isSorted ? column.isSortedDesc ? '(descending)' : '(ascending)' : ''}
                  </span>
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} key={index} className='text-sm'>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} key={index}>{cell.render('Cell')}</td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default PositionTable;

export const positionTableColumns: Column<Position>[] = [
    {
        Header: 'Orders',
        accessor: 'orders',
        Cell: ({row}: any) => {
            const rootOrder = row.original.orders[0]
            const orderList = row.original.orders.map((order: any) => {
                return (
                    <div className='flex gap-2 items-center' key={order.id}>
                        <div className={order.side === rootOrder.side ? 'text-success' : 'text-error'}>
                            {order.side === rootOrder.side ? '+' : '-'}
                        </div>
                        <div className='text-sm text-gray-500'>{order.id.substring(0, 8)}</div>
                        {/*<div className='text-sm text-gray-500'>{order.timestamp}</div>*/}
                    </div>
                );
            })
            return <div className='flex flex-col gap-1'>{orderList}</div>
        },
    },
    {
        Header: 'Side',
        accessor: 'side',
        Cell: ({row}: any) => {
            let textColor = row.original.orders[0].side === 'buy' ? 'text-success' : 'text-error'
            return <div className={`${textColor} uppercase`}>{row.original.side}</div>
        },
    },
    {
        Header: 'Size',
        accessor: 'largest_size'
    },
    {
        Header: 'Entry Price',
        accessor: 'average_entry_price',
    },
    {
        Header: 'Exit Price',
        accessor: 'average_exit_price',
    },
    {
        Header: 'Profit/Loss',
        accessor: 'pnl',
        Cell: ({row}: any) => {
            let textColor = row.original.pnl > 0 ? 'text-success' : 'text-error'
            return <div className={textColor}>{getMoneyFormat(row.original.pnl)}</div>
        }
    },
    {
        Header: 'Timestamp',
        accessor: 'opened_timestamp',
        Cell: ({row}: any) => {
            // convert timestamp to local time, and format it with padded zeros
            let opened_timestamp = new Date(row.original.opened_timestamp).toLocaleString('en-US', {
                hour12: false,
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
            let closed_timestamp = new Date(row.original.closed_timestamp).toLocaleString('en-US', {
                hour12: false,
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
            return <div className='flex items-end justify-between flex-col'>
                <div className='flex gap-2 items-center'>
                    <div className='tooltip' data-tip='First Entered'>
                        <HiOutlineArrowSmRight className='text-secondary-content' />
                    </div>
                    <div>{opened_timestamp}</div>
                </div>
                <div className='flex gap-2 items-center'>
                    <div className='tooltip' data-tip='Last Exit'>
                        <HiOutlineArrowSmLeft className='text-secondary-content' />
                    </div>
                    <div>{closed_timestamp}</div>
                </div>
            </div>
        },
    }
];
