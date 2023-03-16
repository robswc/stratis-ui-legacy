"use client"
import React, {useEffect, useState} from 'react'
import {themeChange} from 'theme-change'
import Logo from "@/components/navbar/logo";
import {JSXElement} from "@typescript-eslint/types/dist/generated/ast-spec";
import {MdSettings} from "react-icons/all";
import SettingsMenu from "@/components/navbar/settingsMenu";
import {getHexFromClass} from "@/components/utils/utils";

export default function Navbar() {

    const [theme, setTheme] = useState('light');
    const [primaryColor, setPrimaryColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#000000');

    useEffect(() => {
        setPrimaryColor(getHexFromClass('bg-primary'));
        setSecondaryColor(getHexFromClass('bg-secondary'));
    }, [theme])

    return (
        <div className='bg-base-100 shadow-2xl border-b-accent border-b-4 flex justify-between px-2'>
            <Logo textColor={primaryColor} haloColor={secondaryColor}/>
            <SettingsMenu themeCallback={setTheme}/>
        </div>
    )
}