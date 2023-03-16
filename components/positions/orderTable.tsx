import React, { useMemo } from 'react';
import { useTable, Column } from 'react-table';
import {Order} from "@/types/types";

type TableProps = {
    data: Order[];
    columns: Column<Order>[];
}

const OrderTable: React.FC<TableProps> = ({ data, columns }) => {
    const tableData = useMemo(() => data, [data]);
    const tableColumns = useMemo(() => columns, [columns]);

    const tableInstance = useTable<Order>({
        columns: tableColumns,
        data: tableData,
    });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
        <table {...getTableProps()} className='table table-zebra w-full'>
            <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className=''>
                    {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()} className='text-left'>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()} className='text-sm'>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </td>
                        ))}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};


export default OrderTable;
