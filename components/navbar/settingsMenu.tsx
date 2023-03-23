import {MdSettings} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {themeChange} from "theme-change";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

export default function SettingsMenu({themeCallback}: { themeCallback: (theme: string) => void }) {

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
    const themeValues = ["bloomberg", "light", "dark", "bumblebee", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"]

    // add index, key to prevent react warning
    const themePreviews = themeValues.map((theme, index) => {
        return (
            <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                    <button className='btn btn-ghost h-24' data-set-theme={theme} onClick={() => setTheme(theme)}>
                        {themePreview(theme)}
                    </button>
                </div>
            </div>
        )
    })

    return (
        <div className="dropdown dropdown-end px-2">
            <label tabIndex={0} className="btn btn-ghost flex gap-2 items-center">
                <div>Settings</div>
                <MdSettings className='w-8 h-8'/>
            </label>
            <div tabIndex={0} className="dropdown-content menu p-2 drop-shadow-2xl bg-base-100 rounded-box" style={{width: 900}}>
                <Tabs className='p-4'>
                    <TabList className='flex gap-2 tabs'>
                        <Tab className='tab'>Themes</Tab>
                        <Tab className='tab'>Backend</Tab>
                    </TabList>
                    <TabPanel>
                        <div className='grid grid-cols-4 gap-2 card bg-base-100 p-1'>
                            {themePreviews}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h2>Set backend URL</h2>
                        <div></div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}