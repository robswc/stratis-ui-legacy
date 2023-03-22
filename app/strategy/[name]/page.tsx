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

export default function StrategyPage({params}: any) {

    const [strategy, setStrategy] = useState({name: params.name, parameters: []});
    const [dataConfig, setDataConfig] = useState({});
    const [ohlc, setOhlc] = useState([]);
    // initial state is an empty StrategyResponse
    const [response, setResponse] = useState({} as StrategyResponse);


    useEffect(() => {

    }, [response])

    // axios post request to get data
    function getAndSetData(adapter: string, data: string) {
        const url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/data/?adapter=${adapter}&data=${data}`
        axios.get(url).then(res => {
                setOhlc(res.data)
            }
        )
    }


    async function runStrategy(parameters: any) {
        console.log('recieved parameters', parameters)
        let testData = {
            strategy: strategy.name,
            parameters: parameters,
            adapter: "CSVAdapter",
            data: "tests/data/AAPL_2.csv"
        }
        // use axios instead
        axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/v1/strategy/`, testData)
            .then(res => {
                setResponse(res.data)
            })
            .catch(
                err => {
                    console.log(err)
                    console.error(err.response.data.detail)
                }
            )

    }

    const testData = [
        { time: '2021-01-01', value: 50 },
        { time: '2021-01-02', value: 53 },
    ];

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
                    <Chart
                        ohlc={ohlc}
                        plots={response.backtest ? response.plots : []}
                        orders={response.backtest ? response.backtest.orders : []}
                        className='shadow-sm'
                    />
                </Tile>
                <Tile title={'BacktestResults'}>
                    <BacktestResults backtest={response.backtest}/>
                </Tile>
            </div>
        </div>
    )
}