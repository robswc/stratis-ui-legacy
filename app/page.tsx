import React from "react";

function InfoCard({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
    return (
        <div className='card bg-base-100 shadow'>
            <div className='card-body'>
                <div className='card-title'>{title}</div>
                {children}
                <div className='card-actions justify-end'>
                    <a href={link} className='btn btn-primary'>View</a>
                </div>
            </div>
        </div>
    )
}

export default function HomePage() {
    return (
        <div className='container mx-auto'>
            <h1 className='text-4xl font-black'>Home</h1>
            <div className='grid grid-cols-3 gap-4'>
                <InfoCard title='Wiki and Guide' link={'https://github.com/robswc/stratis/wiki'}>
                    <p>Check out the official Stratis Wiki and Guide!</p>
                </InfoCard>
                <InfoCard title='Github' link={'https://github.com/robswc/stratis'}>
                    <div>Feel free to contribute or give feedback on Github</div>
                </InfoCard>
                <InfoCard title='Demo' link={'/strategy/SMACrossOver'}>
                    <p>View a demo strategy!</p>
                </InfoCard>
                <InfoCard title='Available Strategies' link={'/strategy'}>
                    <p>View all available strategies</p>
                </InfoCard>
            </div>
        </div>
    )
}