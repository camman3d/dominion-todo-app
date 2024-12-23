import {Calendar} from "lucide-react";
import DatePicker from "./DatePicker.tsx";
import {useEffect, useMemo, useState} from "react";
import windowCloser from "../services/window-closer.ts";

type Props = {
    date: Date | string | null,
    onChange: (date: Date | null) => void,
};

function formatFriendlyDate(date: Date) {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    const tomorrow = new Date(today.getTime() + 86400000);

    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
}

const OneDayMs = 24 * 60 * 60 * 1000;

function getColorFromDate(date: Date | null) {
    if (!date) return 'text-gray-400';
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
    if (Math.abs(timeDiff) < OneDayMs)
        return 'text-yellow-500';
    if (now > date)
        return 'text-red-500';
    return 'text-gray-500';
}

function DateTag(props: Props) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const date = useMemo(() => typeof props.date === 'string' ? new Date(props.date) : props.date, [props.date]);

    const color = getColorFromDate(date);

    // Close the picker if clicking outside of it or pressing escape
    useEffect(() => {
        return windowCloser(() => setPickerOpen(false));
    }, []);

    function handleChange(date: Date | null) {
        setPickerOpen(false);
        props.onChange(date);
    }

    return <div className="relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => setPickerOpen(!pickerOpen)}
                className={'flex space-x-1 text-sm items-center ' + color}>
            <Calendar size={14} />
            {date ?
                <div>{formatFriendlyDate(date)}</div> :
                <div className="text-gray-400">Due Date</div>}
        </button>
        {pickerOpen && <DatePicker initialDate={date || new Date()} onDateChange={handleChange} />}
    </div>
}

export default DateTag;