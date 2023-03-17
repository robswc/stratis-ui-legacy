"use client"
import Link from "next/link";
async function getStrategies() {
    const res = await fetch('http://127.0.0.1:8000/api/v1/strategy/strategy');
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    console.log(res)
    return res.json();
}


export default async function StrategyPage() {

    const res = await getStrategies()

    return (
        <div className='container mx-auto px-4'>
            <div className='tile'>
                <h1 className='text-4xl mb-3 font-black uppercase'>Strategies</h1>
                <div className='flex flex-col gap-3'>
                    {res.map((strategy: any) => (
                        <Link key={strategy.id} href={'/strategy/' + strategy.name}>{strategy.name}</Link>
                    ))}
                </div>
            </div>
        </div>
    )
}