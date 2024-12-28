import TaskApi, {Task} from "../services/tasks/api.ts";
import {AlarmClock, Check, Copy, Ellipsis, Info, Pencil, Trash} from "lucide-react";
import DateTag from "./DateTag.tsx";
import PriorityTag from "./PriorityTag.tsx";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import queryClient from "../services/queryClient.ts";
import LocationTag from "./LocationTag.tsx";
import useDebounce from "../services/debounce.ts";
import CategoriesTag from "./CategoriesTag.tsx";
import AISpark from '../assets/AISpark.svg';
import {Link} from "react-router-dom";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {AnimatePresence, motion} from "framer-motion";


function TaskDescription(props: {description: string, onChange: (d: string) => void}) {
    const [description, setDescription] = useState(props.description);
    const ref = useRef<HTMLTextAreaElement>(null);
    const onChange = useDebounce(props.onChange, 500);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = '5px';
            ref.current.style.height = Math.max(20, ref.current.scrollHeight) + 'px';
        }
    }, [description]);

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setDescription(e.target.value);
        onChange(e.target.value);
    }

    // return <input className="flex-grow bg-white bg-opacity-0 outline-none" type="text" value={description} onChange={handleChange}/>
    return <div className="flex-grow">
        {/*<input className="bg-white bg-opacity-0 w-full outline-none whitespace-pre-wrap" type="text" value={description} onChange={handleChange}/>*/}
        <textarea ref={ref}
                  value={description} onChange={handleChange}
                  className="bg-white bg-opacity-0 text-sm resize-none w-full break-words overflow-hidden outline-none">
        </textarea>
    </div>
}

type Props = {
    task: Task,
};

function TaskCard({task}: Props) {
    const [editing, setEditing] = useState(false);

    const mutation = useMutation({
        mutationFn: TaskApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    });
    const deleteMutation = useMutation({
        mutationFn: TaskApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    });

    function deleteTask() {
        deleteMutation.mutate(task.id);
    }

    function handleCheck(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            task.date_completed = new Date();
        } else {
            task.date_completed = null;
        }
        mutation.mutate(task);
    }

    function handleDescriptionChange(description: string) {
        task.description = description;
        mutation.mutate(task);
    }

    function handleDateChange(date: Date | null) {
        task.date_due = date;
        mutation.mutate(task);
    }

    function handlePriorityChange(priority: number) {
        task.priority = priority;
        mutation.mutate(task);
    }

    function handleLocationChange(location: string) {
        task.location = location;
        mutation.mutate(task);
    }

    function handleCategoriesChange(categories: string[]) {
        task.categories = categories;
        mutation.mutate(task);
    }

    return <div className="border rounded-lg bg-white bg-opacity-85 px-4 md:px-5 py-3 md:py-5 shadow-lg relative">
        <div className="flex w-full">
            <div className="mr-2">
                <label className="relative inline-block w-6 h-6 group cursor-pointer">
                    <input type="checkbox" checked={!!task.date_completed}
                           onChange={handleCheck}
                           className="peer appearance-none border border-gray-400 w-6 h-6 rounded-full checked:border-aquamarine-600 checked:bg-gradient-to-br checked:from-shakespeare-400 checked:to-aquamarine-400 shadow" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition group-hover:opacity-100 text-gray-400 peer-checked:text-white peer-checked:opacity-100">
                        <Check size={16} />
                    </div>
                </label>
            </div>
            <TaskDescription description={task.description} onChange={handleDescriptionChange} />
            <div className="ml-1 flex space-x-1">
                {/*{editing && <button onClick={deleteTask}*/}
                {/*                    className="text-white bg-red-500 rounded hover:bg-red-400 active:bg-red-600 transition px-2 py-2"*/}
                {/*>*/}
                {/*    <Trash size={14} />*/}
                {/*</button>}*/}

                {!editing && <Popover>
                    {({ open }) => <>
                        <PopoverButton className="text-gray-400 hover:text-gray-500 transition border border-gray-400 border-opacity-0 hover:border-opacity-100 px-2 py-2 rounded bg-gray-200 bg-opacity-0 active:bg-opacity-100">
                            {editing ? <Check size={16}/> : <Ellipsis size={16} />}
                        </PopoverButton>
                        <AnimatePresence>
                            {open && (
                                <PopoverPanel
                                    static
                                    as={motion.div}
                                    initial={{opacity: 0, scale: 0.95}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.95}}
                                    anchor="bottom"
                                    className="flex origin-top flex-col bg-white bg-opacity-85 rounded-md shadow-md min-w-52 backdrop-blur-sm border-2 md:border-0 border-gray-500 border-opacity-25"
                                >
                                    <button onClick={() => setEditing(true)}
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 text-sm bg-gray-200 bg-opacity-0 hover:bg-opacity-100 transition rounded my-2 mx-2">
                                        <Pencil size={16}/>
                                        <div>Edit</div>
                                    </button>
                                    <hr/>
                                    <Link to={'/app/task/' + task.id}
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 text-sm bg-gray-200 bg-opacity-0 hover:bg-opacity-100 transition rounded mt-2 mx-2">
                                        <Info size={16}/>
                                        <div>View Details</div>
                                    </Link>
                                    <button
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 text-sm bg-gray-200 bg-opacity-0 hover:bg-opacity-100 transition rounded mx-2">
                                        <Copy size={16}/>
                                        <div>Duplicate</div>
                                    </button>
                                    <button
                                        className="flex items-center space-x-3 px-3 py-2 text-gray-600 text-sm bg-gray-200 bg-opacity-0 hover:bg-opacity-100 transition rounded mb-2 mx-2">
                                        <AlarmClock size={16}/>
                                        <div>Set Reminder</div>
                                    </button>
                                    <hr/>
                                    <button onClick={deleteTask}
                                        className="flex items-center space-x-3 px-3 py-2 text-red-600 text-sm bg-gray-200 bg-opacity-0 hover:bg-opacity-100 transition rounded my-2 mx-2">
                                        <Trash size={16}/>
                                        <div>Delete</div>
                                    </button>
                                </PopoverPanel>
                            )}
                        </AnimatePresence>
                    </>}
                </Popover>}

                {editing && <button onClick={() => setEditing(!editing)}
                        className="text-gray-400 hover:text-gray-500 transition border border-gray-400 border-opacity-0 hover:border-opacity-100 px-2 py-2 rounded bg-gray-200 bg-opacity-0 active:bg-opacity-100"
                >
                    <Check size={16}/>
                </button>}
            </div>
        </div>
        <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:space-x-3">
            {(task.date_due || editing) && <DateTag date={task.date_due} onChange={handleDateChange}/>}
            {(task.priority > 0 || editing) && <PriorityTag priority={task.priority} onChange={handlePriorityChange}/>}
        </div>

        {(task.location || editing) && <div className="my-1">
            <LocationTag location={task.location} onChange={handleLocationChange} />
        </div>}
        {(task.categories.length > 0 || editing) && <div className="mt-1">
            <CategoriesTag categories={task.categories} onChange={handleCategoriesChange} alwaysShowInput={editing} />
        </div>}

        <Link to={'/app/task/' + task.id}
                className="flex space-x-2 items-center bg-white bg-opacity-0 hover:bg-opacity-100 transition px-2 py-1 rounded-full hover:shadow text-sm active:bg-gray-200 absolute bottom-2 right-2 text-gray-400 hover:text-shakespeare-800"
        >
            <img src={AISpark} alt="AI Assist" className="w-5" />
            <div>AI Assist</div>
        </Link>
    </div>
}

export default TaskCard;