"use client"
import Tile from "@/components/tile";
import {Chart} from "@/components/chart";
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
    const [data, setData] = useState([]);
    // initial state is an empty StrategyResponse
    const [response, setResponse] = useState({} as StrategyResponse);


    useEffect(() => {

    }, [response])

    // axios post request to get data
    function getData(adapter: string, data: string) {
        axios.get(
            `${process.env.NEXT_PUBLIC_HOST}/api/v1/data/?adapter=${adapter}&data=${data}`,
        ).then(res => {
            setData(res.data)
        }
        )
    }


    async function runStrategy(data: any) {
        let parameters = data
        console.log('params', parameters)
        let testData = {
            strategy: "SMACrossOver",
            parameters: parameters,
            adapter: "CSVAdapter",
            data: "tests/data/AAPL_2.csv"
        }
        fetch(`${process.env.NEXT_PUBLIC_HOST}/api/v1/strategy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData),
        }).then(res => res.json()).then(data => {
            setResponse(data)
        })

    }

    return (
        <div className='grid grid-cols-4 grid-rows-2 gap-3 px-3'>
            <Tile title={strategy.name}>
                <div className='tile-section'>
                    <h2>Data</h2>
                    {/*@ts-ignore*/}
                    <DataForm onSubmit={getData}/>
                </div>
                <div className='tile-section'>
                    <h2>Parameters</h2>
                    <StrategyForm name={strategy.name} runCallback={runStrategy}/>
                </div>
            </Tile>
            <div className='col-span-3 flex flex-col gap-3'>
                <Tile title={'Chart'} >
                    <Chart
                        ohlc={data}
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