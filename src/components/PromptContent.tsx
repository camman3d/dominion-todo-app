import {Prompt, TaskPrompt} from "../services/prompt-api.ts";
import Markdown from "react-markdown";
import {useEffect, useState} from "react";
import TaskApi, {Task, TaskBase} from "../services/tasks/api.ts";
import {Check, Plus} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import queryClient from "../services/queryClient.ts";

function formatDate(date: Date | string) {
    date = new Date(date);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) + ' ' + date.toLocaleTimeString();
}

function SuggestedTasks(props: {json: string, task: Task}) {
    const [tasks, setTasks] = useState<Partial<Task>[]>([]);
    const [addedIndices, setAddedIndices] = useState<number[]>([]);

    const mutation = useMutation({
        mutationFn: TaskApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']});
        }
    });

    useEffect(() => {
        try {
            const value = JSON.parse(props.json);
            setTasks(value.tasks || []);
        } catch (e) {
            console.error(e);
        }
    }, [props.json]);

    function handleAdd(index: number, suggested: Partial<Task>) {
        const newIndices = addedIndices.slice();
        newIndices.push(index);
        setAddedIndices(newIndices);

        const newTask: TaskBase = {
            description: suggested.description!,
            location: props.task.location,
            priority: props.task.priority,
            date_due: props.task.date_due,
            date_completed: null,
            status: '',
            categories: props.task.categories.slice().concat(['AI Generated']),
        };
        mutation.mutate(newTask);
    }

    return <div>
        {tasks.length > 0 && <div className="mb-1">Suggested Tasks:</div>}
        {tasks.map((task, i) => <div className="flex items-center space-x-3 my-1">
            <button onClick={() => handleAdd(i, task)}
                    disabled={addedIndices.includes(i)}
                    className="bg-aquamarine-500 hover:bg-aquamarine-400 active:bg-aquamarine-600 transition text-white px-1 py-1 rounded-sm disabled:pointer-events-none disabled:opacity-50"
            >
                {addedIndices.includes(i) ? <Check size={18} /> : <Plus size={18} />}
            </button>
            <div className="text-sm rounded-full px-0.5 py-0.5 bg-gradient-to-br from-amber-500 to-yellow-500 text-white">
                <div className="px-3 py-1 bg-white rounded-full text-gray-600">
                    {task.description}
                </div>
            </div>
        </div>)}
    </div>
}


type Props = {
    taskPrompt: TaskPrompt,
    prompt: Prompt,
    task: Task,
};

function PromptContent({taskPrompt, prompt, task}: Props) {
    return <div>
        <div className="text-sm text-gray-400 mb-5">{formatDate(taskPrompt.date_added)}</div>

        {!prompt.returns_json && <div className="prose">
            <Markdown>{taskPrompt.result}</Markdown>
        </div>}
        {prompt.returns_json && <SuggestedTasks json={taskPrompt.result} task={task} />}
    </div>
}

export default PromptContent;