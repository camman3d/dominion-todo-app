import {File, ShieldAlert, ShieldCheck} from "lucide-react";
import {useEffect, useState} from "react";
import windowCloser from "../services/window-closer.ts";

const PriorityLabels = ['Priority', 'Critical', 'Urgent', 'High', 'Mid', 'Low', 'Note']
const PriorityColors = [
    'border border-gray-300 text-gray-400',
    'bg-red-500 text-white',
    'bg-orange-500 text-white',
    'bg-amber-500 text-white',
    'bg-aquamarine-500 text-white',
    'bg-shakespeare-500 text-white',
    'bg-gray-300 text-gray-500',
];

type BtnProps = {
    priority: number,
    onClick: () => void,
};

function PriorityBtn({priority, onClick}: BtnProps) {
    const color = PriorityColors[priority];

    return <button onClick={onClick}
                   className={'flex space-x-1 text-sm items-center rounded px-2 ' + color}>
        {priority <= 3 && <ShieldAlert size={14}/>}
        {priority >= 4 && priority <= 5 && <ShieldCheck size={14}/>}
        {priority >= 6 && <File size={14}/>}
        <div>{PriorityLabels[priority]}</div>
    </button>
}


type Props = {
    priority: number,
    onChange: (priority: number) => void,
};

function PriorityTag({priority, onChange}: Props) {
    const [menuVisible, setMenuVisible] = useState(false);

    // Close the picker if clicking outside of it or pressing escape
    useEffect(() => {
        return windowCloser(() => setMenuVisible(false));
    }, []);

    function handleChange(priority: number) {
        onChange(priority);
        setMenuVisible(false);
    }

    return <div className="relative" onClick={e => e.stopPropagation()}>
        {menuVisible && <div className="absolute bg-white border border-gray-200 px-2 py-2 rounded shadow-lg z-10 left-1/2 bottom-full -translate-x-1/2 -translate-y-1">
            <div className="flex space-x-2 justify-center mb-1">
                <PriorityBtn priority={1} onClick={() => handleChange(1)}/>
                <PriorityBtn priority={2} onClick={() => handleChange(2)}/>
                <PriorityBtn priority={3} onClick={() => handleChange(3)}/>
            </div>
            <div className="flex space-x-2 justify-center">
                <PriorityBtn priority={4} onClick={() => handleChange(4)}/>
                <PriorityBtn priority={5} onClick={() => handleChange(5)}/>
                <PriorityBtn priority={6} onClick={() => handleChange(6)}/>
            </div>
        </div>}
        <PriorityBtn priority={priority} onClick={() => setMenuVisible(!menuVisible)} />
    </div>
}

export default PriorityTag;