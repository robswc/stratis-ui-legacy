// Includes a title and holds children
import React, {useEffect, useState} from "react";
import {IoSettings} from "react-icons/all";

export function TileSection({
                                title,
                                children,
                                className
                            }: { title: string, children: React.ReactNode, className?: string }) {
    return <div className='tile-section'>
        <h2 className='mb-2'>{title}</h2>
        <>
            {children}
        </>
    </div>
}

export default function Tile({
                                 title,
                                 children,
                                 passedSettings,
                                 className
                             }: { title: string, children: React.ReactNode, passedSettings?: React.ReactNode, className?: string }) {

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [childHeight, setChildHeight] = useState<number>(0);
    const [childWidth, setChildWidth] = useState<number>(0);
    const divRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current) {
            setChildHeight(divRef.current.clientHeight);
            setChildWidth(divRef.current.clientWidth);
        }
    }, [children]);

    const settingsElement = () => {
        return <div className='bg-base-100 bg-opacity-90 backdrop-blur-sm'
                    style={{height: childHeight, width: childWidth, position: "absolute", zIndex: 99}}>
            {passedSettings ? passedSettings : <>No settings for this component</>}
        </div>
    }

    return (
        <div className={`tile ${className}`}>
            <div className='tile-header card mb-3'>
                <h1>{title}</h1>
                <div className='!hover:text-primary text-accent'>
                    <div className='btn px-2 btn-sm'>
                        <IoSettings onClick={() => setSettingsToggle(!settingsToggle)}/>
                    </div>
                </div>
            </div>
            <div ref={divRef}>
                {
                    settingsToggle ? settingsElement() : <></>
                }
                {children}
            </div>
        </div>
    )
}
