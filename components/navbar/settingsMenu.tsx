import {MdSettings} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {themeChange} from "theme-change";

export default function SettingsMenu({themeCallback}: { themeCallback: (theme: string) => void }) {

    const [toggle, setToggle] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        themeChange(false)
        themeCallback(theme)
    }, [theme])

    const themePreview = (theme: string) => {
        return (
            <div data-theme={theme}
                 className="bg-base-100 text-base-content w-full cursor-pointer font-sans border-2">
                <div className="grid grid-cols-5 grid-rows-3">
                    <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                    <div className="bg-base-300 col-start-1 row-start-3"></div>
                    <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div className="font-bold">{theme}</div>
                        <div className="flex flex-wrap gap-1">
                            <div
                                className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-primary-content text-sm font-bold">A</div>
                            </div>
                            <div
                                className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-secondary-content text-sm font-bold">A</div>
                            </div>
                            <div
                                className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-accent-content text-sm font-bold">A</div>
                            </div>
                            <div
                                className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                                <div className="text-neutral-content text-sm font-bold">A</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const themeValues = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"]

    const themePreviews = themeValues.map((theme) => {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <button className='btn btn-ghost h-24' data-set-theme={theme} onClick={() => setTheme(theme)}>
                        {themePreview(theme)}
                    </button>
                </div>
            </div>
        )
    })

    const containerBg = toggle ? 'bg-base-300' : ''
    const containerClass = `flex flex-col gap-2 justify-center items-end`

    return (
        <div className={containerClass}>
            <div className='flex items-center gap-2' style={{zIndex: 20}}>

                <button onClick={() => setToggle(!toggle)} className={`btn btn-ghost ${toggle ? 'btn-active rounded-tr-2xl rounded-br-none rounded-tl-none border-secondary' : ''}`}>
                    <div>Settings</div>
                    <MdSettings className='w-8 h-8'/>
                </button>
            </div>

            <div
                className={`absolute pt-8 mt-2 ${toggle ? 'display' : 'hidden'} bg-base-300 card drop-shadow-lg border-white border-2`}
                style={{width: toggle ? 860 : 0, zIndex: 10, top: 0}}>
                <div className='p-2'>
                    <div>Themes</div>
                    <div className='grid grid-cols-4 gap-4 card bg-base-100 p-1'>
                        {themePreviews}
                    </div>
                </div>
            </div>

        </div>
    )
}