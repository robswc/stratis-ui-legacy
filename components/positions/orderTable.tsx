import React, {useMemo} from 'react';
import {useTable, Column, useSortBy} from 'react-table';
import {Order} from "@/types/types";
import {getMoneyFormat, getOrderTypeAbbreviation} from "@/components/utils/utils";
import {TbTableExport} from "react-icons/all";

type TableProps = {
    data: Order[];
    columns: Column<Order>[];
}

const OrderTable: React.FC<TableProps> = ({data, columns}) => {
    const tableData = useMemo(() => data, [data]);
    const tableColumns = useMemo(() => columns, [columns]);

    const tableInstance = useTable<Order>(
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
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                        // @ts-ignore
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index} className='text-left cursor-pointer'>
                            <div className='btn btn-ghost btn-sm text-bold'>
                                {column.render('Header')}
                                {/*@ts-ignore*/}
                                <span className='ml-1'>{column.isSorted ? (column.isSortedDesc ? '(descending)' : '(ascending)') : ''}</span>
                            </div>
                        </th>
                    ))}
                    <div className='-ml-14 btn btn-info btn-sm text-3xl mt-4 px-1' style={{zIndex: 99}}>
                        <TbTableExport />
                    </div>
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} key={index} className='text-sm'>
                        {row.cells.map((cell, index) => (
                            <td {...cell.getCellProps()} key={index}>{cell.render('Cell')}</td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};
export default OrderTable;

export const orderTableColumns: Column<Order>[] = [
    {
        Header: 'Order ID',
        accessor: 'id',
        Cell: ({row}: any) => {
            // return truncated id, with tooltip to show full id
            return (
                <div className="has-tooltip">
                    <div className="">{row.original.id.substring(0, 8)}</div>
                </div>
            )
        },
    },
    {
        Header: 'Order Type',
        accessor: 'type',
        Cell: ({row}: any) => {
            return <div>{getOrderTypeAbbreviation(row.original.type)}</div>
        }
    },
    {
        Header: 'Side',
        accessor: 'side',
        Cell: ({row}: any) => {
            let textColor = row.original.side === 'buy' ? 'text-success' : 'text-error'
            return <div className={`${textColor} uppercase`}>{row.original.side}</div>
        },
    },
    {
        Header: 'Quantity',
        accessor: 'qty'
    },
    {
        Header: 'Price',
        accessor: 'filled_avg_price',
        Cell: ({row}: any) => {
            return <div>{getMoneyFormat(row.original.filled_avg_price)}</div>
        }
    },
    {
        Header: 'Timestamp',
        accessor: 'timestamp',
        Cell: ({row}: any) => {
            // convert timestamp to local time, and format it with padded zeros
            let timestamp = new Date(row.original.timestamp).toLocaleString('en-US', {
                hour12: false,
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
            return <div className='text-right'>{timestamp}</div>
        },
    }
];
