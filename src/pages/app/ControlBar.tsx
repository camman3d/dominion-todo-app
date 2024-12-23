import {ArrowUpDown, Filter, LayoutDashboard} from "lucide-react";
import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {AnimatePresence, motion} from "framer-motion";
import {useApp} from "./state/AppStateContext.tsx";
import useDebounce from "../../services/debounce.ts";

function ControlButton({icon, name, children}: {icon: ReactNode, name: string, children: ReactNode}) {
    return <Popover>
        {({ open }) => <>
            <PopoverButton className="flex space-x-1 items-center group outline-none focus:outline-none text-gray-100 hover:underline">
                {icon}
                <span>{name}</span>
            </PopoverButton>
            <AnimatePresence>
                {open && (
                    <PopoverPanel
                        static
                        as={motion.div}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        anchor="bottom"
                        className="flex origin-top flex-col bg-white bg-opacity-85 rounded-md shadow-md divide-y divide-aquamarine-500 min-w-52 backdrop-blur-sm"
                    >
                        {children}
                    </PopoverPanel>
                )}
            </AnimatePresence>
        </>}
    </Popover>;
}

function ActiveDot() {
    return <div className="relative flex h-3 w-3">
        <div className="w-full h-full bg-aquamarine-500 rounded-full absolute opacity-75 animate-ping"/>
        <div className="w-3 h-3 bg-aquamarine-500 rounded-full"/>
    </div>;
}

function ControlMenuButton(props: { active: boolean, onClick: () => void, children: ReactNode}) {
    return <button onClick={props.onClick}
                   className="flex items-center space-x-2 px-3 py-3 hover:bg-gray-100 active:bg-gray-200 hover:text-aquamarine-700 transition"
    >
        <div>{props.children}</div>
        <div className="flex-grow" />
        {props.active && <ActiveDot/>}
    </button>;
}

function ControlMenuInput(props: { prefix: string, filter: string, onChange: (value: string) => void, children: ReactNode}) {
    const [value, setValue] = useState(
        props.filter.startsWith(props.prefix) ?
            props.filter.substring(props.prefix.length + 1) : ''
    );

    useEffect(() => {
        if (!props.filter.startsWith(props.prefix))
            setValue('');
    }, [props.prefix, props.filter]);

    const onChange = useDebounce(props.onChange, 500);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        onChange(props.prefix + ':' + e.target.value);
    }

    return <div className="flex flex-col px-3 py-3 hover:bg-gray-100 hover:text-aquamarine-700 transition">
        <div className="flex items-center space-x-2">
            <div className="text-sm">{props.children}</div>
            <div className="flex-grow"/>
            {props.filter.startsWith(props.prefix) && <ActiveDot/>}
        </div>
        <div className="mt-1">
            <input type="text"
                   value={value} onChange={handleChange}
                   className="border border-gray-300 shadow-inner rounded px-2 py-0 outline-none text-sm/6 text-gray-500"/>
        </div>
    </div>;
}

function ControlBar() {
    const {state, setSort, setFilter, setView} = useApp();
    return <div className="flex container mx-auto justify-center">
        <div
            className="flex justify-center items-center bg-shakespeare-900 bg-opacity-30 border border-shakespeare-500 rounded py-3 px-8 shadow-lg space-x-5 opacity-65 hover:opacity-100 transition"
        >
            <ControlButton icon={<ArrowUpDown size={18}/>} name="Sort">
                <ControlMenuButton active={state.sort === 'date_due'} onClick={() => setSort('date_due')}>
                    Due Date
                </ControlMenuButton>
                <ControlMenuButton active={state.sort === 'date_added'} onClick={() => setSort('date_added')}>
                    Date Added
                </ControlMenuButton>
                <ControlMenuButton active={state.sort === 'priority'} onClick={() => setSort('priority')}>
                    Priority
                </ControlMenuButton>
            </ControlButton>
            <ControlButton icon={<Filter size={18}/>} name="Filter">
                <ControlMenuButton active={state.filter === ''} onClick={() => setFilter('')}>
                    All
                </ControlMenuButton>
                <ControlMenuButton active={state.filter === 'today'} onClick={() => setFilter('today')}>
                    Due Today
                </ControlMenuButton>
                <ControlMenuButton active={state.filter === 'week'} onClick={() => setFilter('week')}>
                    Due This Week
                </ControlMenuButton>
                <ControlMenuButton active={state.filter === 'high_priority'} onClick={() => setFilter('high_priority')}>
                    High Priority
                </ControlMenuButton>
                <ControlMenuInput prefix="category" filter={state.filter} onChange={setFilter}>
                    By Category
                </ControlMenuInput>
                <ControlMenuInput prefix="location" filter={state.filter} onChange={setFilter}>
                    By Location
                </ControlMenuInput>
                <ControlMenuButton active={state.filter === 'completed'} onClick={() => setFilter('completed')}>
                    Completed
                </ControlMenuButton>
            </ControlButton>
            <ControlButton icon={<LayoutDashboard size={18}/>} name="View">
                <ControlMenuButton active={state.view === 'list'} onClick={() => setView('list')}>
                    List
                </ControlMenuButton>
                <ControlMenuButton active={state.view === 'groups'} onClick={() => setView('groups')}>
                    Groups
                </ControlMenuButton>
                <ControlMenuButton active={state.view === 'board'} onClick={() => setView('board')}>
                    Board
                </ControlMenuButton>
                <ControlMenuButton active={state.view === 'calendar'} onClick={() => setView('calendar')}>
                    Calendar
                </ControlMenuButton>
            </ControlButton>
        </div>
    </div>
}

export default ControlBar;