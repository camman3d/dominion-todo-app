import {FormEvent, useEffect, useRef, useState} from "react";
import {Check, CircleHelp, X} from "lucide-react";
import TaskParser from "../services/tasks/parser.tsx";
import {useMutation} from "@tanstack/react-query";
import TaskApi from "../services/tasks/api.ts";
import queryClient from "../services/queryClient.ts";
import DateTag from "./DateTag.tsx";
import PriorityTag from "./PriorityTag.tsx";
import LocationTag from "./LocationTag.tsx";
import CategoriesTag from "./CategoriesTag.tsx";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {AnimatePresence, motion} from "framer-motion";

type Props = {
    onClose?: () => void;
    autoFocus?: boolean,
}

function TaskForm({onClose, autoFocus}: Props) {

    const [description, setDescription] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [loaded, setLoaded] = useState(false);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState(0);
    const [location, setLocation] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    const mutation = useMutation({
        mutationFn: TaskApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    });

    useEffect(() => {
        if (!loaded && autoFocus) {
            inputRef.current?.focus();
        }
        setLoaded(true);
    }, [loaded, autoFocus]);

    useEffect(() => {
        const meta = new TaskParser().parseTask(description);
        if (meta.dueDate) setDueDate(meta.dueDate);
        if (meta.priority) setPriority(meta.priority);
        if (meta.location) setLocation(meta.location);
        if (meta.categories.length) setCategories(meta.categories);

    }, [description]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const meta = new TaskParser().parseTask(description);
        mutation.mutate({
            description: meta.cleanDescription,
            location,
            priority,
            date_due: dueDate,
            date_completed: null,
            status: '',
            categories,
        });
        setDescription('');
        if (onClose) onClose();
    }

    function handleCancel() {
        onClose!();
    }

    return <div className="relative">
        <div className="bg-white bg-opacity-85 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
                <div className="px-5 py-5">
                    <input type="text" placeholder="Description"
                           ref={inputRef}
                           className="appearance-none bg-opacity-0 bg-white outline-0 focus:outline-none w-full"
                           value={description} onChange={e => setDescription(e.target.value)}/>
                </div>
            </form>

            <div className="border-t border-shakespeare-300 px-5 py-5 flex">
                <div>
                    <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:space-x-3">
                        <DateTag date={dueDate} onChange={setDueDate} />
                        <PriorityTag priority={priority} onChange={setPriority} />
                    </div>
                    <div className="my-1">
                        <LocationTag location={location} onChange={setLocation} />
                    </div>
                    <CategoriesTag categories={categories} onChange={setCategories} alwaysShowInput />
                </div>
                <div className="flex-grow"/>
                <div className="flex space-x-2">
                    {onClose && <button onClick={handleCancel}
                                        className="w-8 h-8 flex items-center justify-center bg-white text-gray-500 rounded-full border border-gray-300 shadow hover:text-gray-600 hover:border-gray-800 transition active:bg-gray-200"
                    >
                        <X className="scale-75"/>
                    </button>}
                    <button onClick={handleSubmit}
                            className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-shakespeare-400 to-aquamarine-400 text-white rounded-full shadow transition hover:from-shakespeare-500 hover:to-aquamarine-500"
                    >
                        <Check className="scale-75"/>
                    </button>
                </div>
            </div>
        </div>
        <div className="absolute top-0 right-full pr-3 pt-5">
            <Popover>
                {({ open }) => <>
                    <PopoverButton className="text-white opacity-70 hover:opacity-90 transition">
                        <CircleHelp />
                    </PopoverButton>
                    <AnimatePresence>
                        {open && (
                            <PopoverPanel
                                static
                                as={motion.div}
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.95}}
                                anchor="top start"
                                className="flex origin-top flex-col space-y-2 bg-white bg-opacity-85 rounded-md shadow-md backdrop-blur-sm w-80 md:w-96 px-3 py-3"
                            >
                                <div>
                                    You can set due date, location, priority, and categories directly in your task
                                    description. Simply type and the corresponding fields will be automatically updated!
                                </div>
                                <div>
                                    <div className="font-medium">Due Date</div>
                                    Add date as
                                    <code className="text-sm bg-shakespeare-200 px-1 rounded mx-1">12/25</code>
                                    or
                                    <code className="text-sm bg-shakespeare-200 px-1 rounded ml-1">December 25</code>
                                </div>

                                <div>
                                    <div className="font-medium">Priority</div>
                                    Use one of
                                    <div className="flex flex-wrap">
                                        {['critical', 'urgent', 'high', 'mid', 'low', 'note'].map(p =>
                                            <code key={p}
                                                  className="text-sm bg-shakespeare-200 px-1 rounded mr-1 mb-1">!{p}</code>)
                                        }
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium">Location</div>
                                    Add
                                    <code className="text-sm bg-shakespeare-200 px-1 rounded mx-1">@location</code>
                                    (e.g.
                                    <code className="text-sm bg-shakespeare-200 px-1 rounded mx-1">@home</code>
                                    )
                                </div>

                                <div>
                                    <div className="font-medium">Categories</div>
                                    Add <code
                                    className="text-sm bg-shakespeare-200 px-1 rounded">#category1</code>, <code
                                    className="text-sm bg-shakespeare-200 px-1 rounded">#category2</code>, etc.
                                </div>

                            </PopoverPanel>
                        )}
                    </AnimatePresence>
                </>}
            </Popover>
        </div>
    </div>
}

export default TaskForm;