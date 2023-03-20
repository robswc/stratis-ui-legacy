"use client"
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";
function getStrategies(callback: any) {
    const url = `${process.env.NEXT_PUBLIC_HOST}/api/v1/strategy/strategy`
    axios.get(url).then(res => {
        return callback(res.data)
    }).catch(err => {
        console.log(err)
        callback([])
    })
}

const StrategyParameterElement = ({parameter}: any) => {
    return (
        <div className='flex flex-row gap-2 items-center'>
            <div className='text-md italic'>{parameter.name}</div>
            <div className='text-neutral-focus text-sm'>{parameter.value}</div>
        </div>
    )
}

const StrategyElement = ({strategy}: any) => {

    const renderParameters = () => {
        return strategy.parameters.map((parameter: any, index: number) => {
            return <StrategyParameterElement key={index} parameter={parameter}/>
        })
    }

    return (
        <Link
            className={'px-2 py-2 items-center justify-between hover:bg-secondary transition-all rounded-md'}
            href={'/strategy/' + strategy.name}
        >
            <div className='mt-1'>
                <div className='text-2xl font-bold'>{strategy.name}</div>
                <div className='text-accent-content text-xl'>Parameters</div>
                <div>{renderParameters()}</div>
            </div>
        </Link>
    )
}

export default function StrategyPage() {

    const [strategies, setStrategies] = useState([]);

    useEffect(() => {
        getStrategies(setStrategies)
    }, [])


    return (
        <div className='container mx-auto px-4'>
            <div className='tile'>
                <h1 className='text-4xl mb-3 font-black uppercase'>Strategies</h1>
                <div className='flex flex-col gap-3'>
                    {strategies.map((strategy: any, index) => {
                        return <StrategyElement key={index} strategy={strategy}/>
                    })}
                </div>
            </div>
        </div>
    )
}