import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import OrderTable, {orderTableColumns} from "@/components/positions/orderTable";
import {Backtest, Order} from "@/types/types";
import PositionTable, {positionTableColumns} from "@/components/positions/positionTable";

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

export default function BacktestResults({backtest}: {backtest: Backtest}) {

    let stats = ['pnl', 'wl_ratio', 'winning_trades', 'losing_trades', 'trades']

    console.log('backtest', backtest)

    const renderStats = () => {
        if (backtest) {
            return stats.map((stat, index) => {
                // @ts-ignore
                const statValue = backtest[stat]
                return (
                    <Stat key={index} label={stat} value={statValue} />
                )
            })
        } else {
            return null
        }
    }

    const renderOrderCount = backtest ? <div className='badge badge-sm badge-primary'>{backtest.orders.length}</div> : null

    return (
        <Tabs>
            <TabList className='tabs mb-2'>
                <Tab className='tab tab-bordered'>Overview</Tab>
                <Tab className='tab tab-bordered'>Positions</Tab>
                <Tab className='tab tab-bordered'><div className='flex items-center gap-2'><div>Orders</div>{renderOrderCount}</div></Tab>
            </TabList>
            <TabPanel>
                <div className='stats w-full'>
                    {renderStats()}
                </div>
            </TabPanel>
            <TabPanel>
                {backtest ? <PositionTable data={backtest.positions} columns={positionTableColumns}/> : <div>no positions</div>}
            </TabPanel>
            <TabPanel>
                {backtest ? <OrderTable data={backtest.orders} columns={orderTableColumns}/> : <div>no orders</div>}
            </TabPanel>
        </Tabs>
    )
}