import TaskApi, {Task} from "../services/tasks/api.ts";
import {Check, Pencil, Trash} from "lucide-react";
import DateTag from "./DateTag.tsx";
import PriorityTag from "./PriorityTag.tsx";
import {ChangeEvent, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import queryClient from "../services/queryClient.ts";
import LocationTag from "./LocationTag.tsx";
import useDebounce from "../services/debounce.ts";
import CategoriesTag from "./CategoriesTag.tsx";



function TaskDescription(props: {description: string, onChange: (d: string) => void}) {
    const [description, setDescription] = useState(props.description);
    const onChange = useDebounce(props.onChange, 500);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setDescription(e.target.value);
        onChange(e.target.value);
    }

    return <input className="flex-grow bg-white bg-opacity-0 outline-none" type="text" value={description} onChange={handleChange}/>
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

    return <div className="border rounded-lg bg-white bg-opacity-85 px-5 py-5 shadow-lg">
        <div className="flex">
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
                {editing && <button onClick={deleteTask}
                                    className="text-white bg-red-500 rounded hover:bg-red-400 active:bg-red-600 transition px-2 py-2"
                >
                    <Trash size={14} />
                </button>}
                <button onClick={() => setEditing(!editing)}
                        className="text-gray-400 hover:text-gray-500 transition border border-gray-400 border-opacity-0 hover:border-opacity-100 px-2 py-2 rounded bg-gray-200 bg-opacity-0 active:bg-opacity-100"
                >
                    {editing ? <Check size={14}/> : <Pencil size={14} />}
                </button>
            </div>
        </div>
        <div className="flex space-x-3 mb-1">
            {(task.date_due || editing) && <DateTag date={task.date_due} onChange={handleDateChange}/>}
            {(task.priority > 0 || editing) && <PriorityTag priority={task.priority} onChange={handlePriorityChange}/>}
            {task.location && !editing && <LocationTag location={task.location} onChange={handleLocationChange} />}
        </div>
        {editing && <LocationTag location={task.location} onChange={handleLocationChange} />}
        {(task.categories.length > 0 || editing) && <CategoriesTag categories={task.categories} onChange={handleCategoriesChange} alwaysShowInput={editing} />}
    </div>
}

export default TaskCard;