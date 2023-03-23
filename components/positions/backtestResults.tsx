import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OrderTable, {orderTableColumns} from "@/components/positions/orderTable";
import {Backtest, Order} from "@/types/types";
import PositionTable, {positionTableColumns} from "@/components/positions/positionTable";

function Stat({label, value, type}: {label: string, value: string, type: string}) {

    let newValue = ''
    // remove trailing zeros
    if (type === 'number') {
        newValue = parseFloat(value).toFixed(2)
    } else if (type === 'integer') {
        newValue = parseInt(value).toString()
    }

    return (
        <div className='stat hover:bg-base-200'>
            <div className='stat-title'>{label}</div>
            <div className='stat-value'>{newValue}</div>
        </div>
    )
}

export default function BacktestResults({backtest}: {backtest: Backtest}) {

    let stats = ['pnl', 'wl_ratio', 'winning_trades', 'losing_trades', 'trades']

    console.log('Backtest Results', backtest)

    const renderStats = () => {
        if (backtest) {
            return stats.map((stat, index) => {
                // @ts-ignore
                const statValue = backtest[stat]
                let type = 'number'
                if (stat === 'winning_trades' || stat === 'losing_trades' || stat === 'trades') {
                    type = 'integer'
                }
                return (
                    <Stat key={index} label={stat} value={statValue} type={type} />
                )
            })
        } else {
            return null
        }
    }

    const renderOrderCount = backtest ? <div className='badge badge-sm badge-neutral'>{backtest.orders.length}</div> : null
    const renderPositionCount = backtest ? <div className='badge badge-sm badge-neutral'>{backtest.positions.length}</div> : null

    return (
        <Tabs>
            <TabList className='tabs mb-2'>
                <Tab className='tab tab-bordered'>Overview</Tab>
                <Tab className='tab tab-bordered'><div className='flex items-center gap-2'><div>Positions</div>{renderPositionCount}</div></Tab>
                <Tab className='tab tab-bordered'><div className='flex items-center gap-2'><div>Orders</div>{renderOrderCount}</div></Tab>
                <Tab className='tab tab-bordered'>Order Inspector</Tab>
            </TabList>
            <TabPanel>
                <div className='stats shadow w-full transition-all'>
                    {renderStats()}
                </div>
            </TabPanel>
            <TabPanel>
                {backtest ? <PositionTable data={backtest.positions} columns={positionTableColumns}/> : <div>no positions</div>}
            </TabPanel>
            <TabPanel>
                {backtest ? <OrderTable data={backtest.orders} columns={orderTableColumns}/> : <div>no orders</div>}
            </TabPanel>
            <TabPanel>
                Coming soon!
            </TabPanel>
        </Tabs>
    )
}