"use client"
import Tile from "@/components/tile";
import {Chart} from "@/components/chart";
import StrategyForm from "@/components/strategy/strategy";
import DataForm from "@/components/data/data";
import {useEffect, useState} from "react";
import axios from "axios";
import Positions from "@/components/positions/positions";
import {Order} from "@/types/types";

export async function getStrategy(name: string) {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/strategy/?name=${name}`, {next: {revalidate: 5}})
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    } else {
        return res.json();
    }
}

export async function getData(adapter: string, data: string) {
    "use client"
    const res = await fetch(
        `http://127.0.0.1:8000/api/v1/data/?adapter=${adapter}&data=${data}`, {next: {revalidate: 5}}
    )
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    } else {
        return res.json();
    }
}

type BacktestResults = {
    orders: Order[],
}

export default function StrategyPage({params}: any) {

    const [strategy, setStrategy] = useState({name: params.name, parameters: []});
    const [dataConfig, setDataConfig] = useState({});
    const [data, setData] = useState([]);
    const [backtestResults, setBacktestResults] = useState({orders: []} as BacktestResults);
    const [plots, setPlots] = useState([]);

    useEffect(() => {
        console.log('USE EFFECT')
    }, [backtestResults])

    // axios post request to get data
    function getData(adapter: string, data: string) {
        axios.get(
            `http://127.0.0.1:8000/api/v1/data/?adapter=${adapter}&data=${data}`,
        ).then(res => {
            setData(res.data)
        }
        )
    }


    async function runStrategy(data: any) {
        'use server'
        let testData = {
            strategy: "SMACrossOver",
            adapter: "CSVAdapter",
            data: "tests/data/AAPL.csv"
        }
        fetch(`http://127.0.0.1:8000/api/v1/strategy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData),
        }).then(res => res.json()).then(data => {
            setBacktestResults(data.backtest)
            setPlots(data.plots)
        })

    }

    return (
        <div className='grid grid-cols-4 grid-rows-2 gap-3 px-3'>
            <Tile title={strategy.name} className={'row-span-2 flex flex-col gap-2'}>
                <div className='mb-3'>
                    <h2>Data</h2>
                    {/*@ts-ignore*/}
                    <DataForm onSubmit={getData}/>
                </div>
                <div className='mb-3'>
                    <h2>Parameters</h2>
                    <StrategyForm name={strategy.name} runCallback={runStrategy}/>
                </div>
            </Tile>
            <div className='col-span-3 flex flex-col gap-3'>
                <Tile title={'Chart'} >
                    <Chart
                        ohlc={data}
                        plots={plots}
                        orders={backtestResults.orders}
                        className='shadow-sm'
                    />
                </Tile>
                <Tile title={'Positions'}>
                    <Positions backtestResults={backtestResults}/>
                </Tile>
            </div>
        </div>
    )
}