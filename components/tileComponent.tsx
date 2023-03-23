import {useState} from "react";

interface TileComponentSetting {
    name: string;
    label: string;
    tip: string;
    placeholder: string;
    type: string;
    default: any;
}
export default function TileComponent({component, settings}: {component: any, settings: TileComponentSetting[]}) {
    const [currentSettings, setCurrentSettings] = useState<TileComponentSetting[]>(settings);

    function updateSetting(name: string, value: any) {
        const newSettings = currentSettings.map(setting => {
            if (setting.name === name) {
                return {...setting, default: value}
            }
            return setting
        })
        setCurrentSettings(newSettings)
    }

    return (
        {component}
    )
}