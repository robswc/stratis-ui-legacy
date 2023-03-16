import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import OrderTable from "@/components/positions/orderTable";
import {Order} from "@/types/types";
import {Column} from "react-table";

function buildOrderTable(orders: Order[]) {



    const columns: Column<Order>[] = [
        {
            Header: 'Order ID',
            accessor: 'id',
            Cell: ({row}: any) => {
                // return truncated id, with tooltip to show full id
                return (
                    <div className="has-tooltip">
                        <div className="text-stone-800">{row.original.id.substring(0, 8)}</div>
                    </div>
                )
            },
        },
        {
            Header: 'Order Type',
            accessor: 'type',
        },
        {
            Header: 'Side',
            accessor: 'side',
            Cell: ({row}: any) => {
                let textColor = row.original.side === 'buy' ? 'text-green-500' : 'text-red-500'
                return <div className={textColor}>{row.original.side}</div>
            },
        },
        {
            Header: 'Quantity',
            accessor: 'qty'
        },
        {
            Header: 'Price',
            accessor: 'filled_avg_price'
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

    return (
            orders ? <OrderTable data={orders} columns={columns}/> : <div>no orders</div>
    )
}

function Stat({label, value}: {label: string, value: string}) {

    // round value if it's a number
    if (!isNaN(Number(value))) {
        value = Math.round(Number(value)).toLocaleString()
    }

    return (
        <div className='stat'>
            <div className='stat-title'>{label}</div>
            <div className='stat-value'>{value}</div>
        </div>
    )
}

export default function Positions({backtestResults}: any) {
    // let orderCount = backtestResults ? 1 : 0

    let stats = ['pnl', 'wl_ratio', 'winning_trades', 'losing_trades', 'trades']

    const renderStats = () => {
        return stats.map((stat, index) => {
            return (
                <Stat key={index} label={stat} value={backtestResults[stat]} />
            )
        })
    }

    return (
        <Tabs>
            <TabList>
                <Tab>Overview</Tab>
                <Tab>Positions</Tab>
                <Tab><div className='flex items-center gap-2'><div>Orders</div><div>()</div></div></Tab>
            </TabList>
            <TabPanel>
                <div className='stats w-full'>
                    {renderStats()}
                </div>
            </TabPanel>
            <TabPanel>
                <h2>Any content 1</h2>
            </TabPanel>
            <TabPanel>
                <h2>{buildOrderTable(backtestResults.orders)}</h2>
            </TabPanel>
        </Tabs>
    )
}