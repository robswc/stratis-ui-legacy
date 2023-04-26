"use client"
import Tile, {TileSection} from "@/components/tile";
import {Chart} from "@/components/chart/chart";
import StrategyForm from "@/components/strategy/strategy";
import DataForm from "@/components/data/data";
import {useEffect, useState} from "react";
import axios from "axios";
import BacktestResults from "@/components/positions/backtestResults";
import {Backtest, Order} from "@/types/types";


interface Plot {
    name: string;
    data: number[];
}

type StrategyResponse = {
    backtest: Backtest,
    plots: Plot[]
}

interface AdapterKwargs {
    path: string | null;
    symbol: string | null;
    start: number | null;
    end: number | null;
}

export default function StrategyPage({params}: any) {

    const [strategy, setStrategy] = useState({name: params.name, parameters: []});
    const [dataConfig, setDataConfig] = useState({adapter: '', data: '', start: 0, end: 0});
    const [ohlc, setOhlc] = useState([]);
    const [chartSettings, setChartSettings] = useState({timezone: null});
    const [response, setResponse] = useState<StrategyResponse>({} as StrategyResponse);

    useEffect(() => {
    }, [response])

    // axios post request to get data
    function getAndSetData(adapter: string, data: string, start: number, end: number, methods: any) {
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/data/${adapter}`
        let body = {start: start, end: end, kwargs: {}}
        if (adapter === 'CSVAdapter') {
            body['kwargs'] = {path: data}
        } else {
            body['kwargs'] = {symbol: data}
        }
        axios.post(url, body).then(res => {
            setDataConfig({adapter: adapter, data: data, start: start, end: end})
            setOhlc(res.data.data)

            // use methods to set the start and end values for the data form
            const startTimestamp = res.data.data[0]['time']
            const endTimestamp = res.data.data[res.data.data.length - 1]['time']
            if (start === undefined) {
                methods.setValue('start', startTimestamp)
            }
            if (end === undefined || end === 0 || end === null) {
                methods.setValue('end', endTimestamp)
            }

            // finally, run the strategy
            runStrategy(strategy.parameters).then(r => {
                console.log('run strategy response', r)
            })

        }).catch(err => {
            console.log(err)
        })
    }

    async function runStrategy(parameters: any) {
        console.log('received parameters', parameters)
        console.log('current data config', dataConfig)
        let kwargs: AdapterKwargs = {start: null, end: null, path: null, symbol: null}
        if (dataConfig.adapter === 'CSVAdapter') {
            kwargs['path'] = dataConfig.data
        } else {
            kwargs['symbol'] = dataConfig.data
        }

        // add start and end to kwargs
        kwargs.start = dataConfig.start
        kwargs.end = dataConfig.end

        const runRequest = {
            strategy: strategy.name,
            parameters: parameters,
            adapter: dataConfig.adapter,
            adapter_kwargs: kwargs,
        }
        console.log('run request', runRequest)
        // use axios instead
        axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/v1/strategy/`, runRequest)
            .then(res => {
                console.log('Run strategy response', res.data)
                setResponse(res.data)
            })
            .catch(
                err => {
                    console.log(err)
                    console.error(err.response.data.detail)
                }
            )
    }

    const renderedChartElement = () => {
        return (
            <Chart
                ohlc={ohlc}
                plots={response.plots ? response.plots : []}
                orders={response.backtest ? response.backtest.orders : []}
                className='shadow-sm'
            />
        )
    }

    return (
        <div className='grid grid-cols-4 grid-rows-2 gap-3 px-3'>
            <Tile title={strategy.name}>
                <TileSection title={'Data'}>
                    <div className='-mt-2'>
                        <DataForm onSubmit={getAndSetData}/>
                    </div>
                </TileSection>
                <TileSection title={'Parameters'}>
                    <StrategyForm name={strategy.name} runCallback={runStrategy}/>
                </TileSection>
            </Tile>
            <div className='col-span-3 flex flex-col gap-3'>
                <Tile title={'Chart'}>
                    {renderedChartElement()}
                </Tile>
                <Tile title={'BacktestResults'}>
                    <BacktestResults backtest={response.backtest}/>
                </Tile>
            </div>
        </div>
    )
}