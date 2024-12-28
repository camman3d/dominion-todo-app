import {Link, useParams} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import TaskApi from "../../services/tasks/api.ts";
import PromptApi from "../../services/prompt-api.ts";
import AIButton from "../../components/AIButton.tsx";
import TabSelector from "../../components/TabSelector.tsx";
import PromptContent from "../../components/PromptContent.tsx";


function TaskDetails() {
    const taskId = Number(useParams().taskId);
    const task = useQuery({
        queryKey: ['todos', taskId],
        queryFn: () => TaskApi.get(taskId)
    });
    const prompts = useQuery({
        queryKey: ['prompts'],
        queryFn: PromptApi.list
    });
    const taskPrompts = useQuery({
        queryKey: ['taskPrompts', taskId],
        queryFn: () => PromptApi.byTask(taskId),
    });


    return <div className="container mx-auto pb-2">
        <Link to="/app" className="inline-flex space-x-2 text-white">
            <ArrowLeft />
            <div>Back to Tasks</div>
        </Link>
        <div className="mt-2 bg-white bg-opacity-85 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-rows-1 grid-cols-4">
                <div className="col-span-4 md:col-span-3 px-4 py-4">
                    {task.status === 'loading' && <div>Loading task...</div>}
                    {task.status === 'error' && <div className="text-red-500">Error: {(task.error as Error).message}</div>}
                    {task.status === 'success' && <div>
                        <div className="text-xl font-semibold">{task.data.description}</div>
                        {/*<div>Other details here</div>*/}

                        {/* Mobile show AI buttons here */}
                        <div className="block md:hidden bg-shakespeare-100 border-t border-b border-gray-200 px-4 py-4 -mx-4 my-2">
                            {prompts.status === 'loading' && <div>Loading actions...</div>}
                            {prompts.status === 'error' &&
                                <div className="text-red-500">Error: {(prompts.error as Error).message}</div>}
                            {prompts.status === 'success' && task.status === 'success' && <div>
                                <div
                                    className="text-xs uppercase font-semibold tracking-wide text-shakespeare-500">
                                    AI Actions
                                </div>

                                <div className="mt-2 flex flex-col space-y-1">
                                    {prompts.data.map(prompt =>
                                        <div key={prompt.id}>
                                            <AIButton prompt={prompt} task={task.data}/>
                                        </div>
                                    )}
                                </div>
                            </div>}
                        </div>

                        <div className="text-xs uppercase font-semibold tracking-wide text-shakespeare-500">
                            Generated Content
                        </div>
                        <div>
                            {taskPrompts.status === 'loading' && <div>Loading...</div>}
                            {taskPrompts.status === 'error' &&
                                <div className="text-red-500">Error: {(taskPrompts.error as Error).message}</div>}
                            {taskPrompts.status === 'success' && prompts.status === 'success' && <div>
                                {taskPrompts.data.length === 0 ?
                                    <div className="text-gray-500">Nothing created yet.</div> :
                                    <div>
                                        <TabSelector>
                                            {taskPrompts.data.map(tp => {
                                                const prompt = prompts.data.find(p => p.id === tp.ai_prompt_id)!;
                                                return {
                                                    id: tp.id,
                                                    label: prompt.name,
                                                    content: <PromptContent taskPrompt={tp} prompt={prompt}
                                                                            task={task.data}/>
                                                };
                                            })}
                                        </TabSelector>
                                    </div>}
                            </div>}
                        </div>
                    </div>}
                </div>
                <div className="hidden md:block bg-shakespeare-100 border-l border-gray-200 px-4 py-4">
                    {prompts.status === 'loading' && <div>Loading actions...</div>}
                    {prompts.status === 'error' &&
                        <div className="text-red-500">Error: {(prompts.error as Error).message}</div>}
                    {prompts.status === 'success' && task.status === 'success' && <div>
                        <div className="text-xs uppercase font-semibold tracking-wide text-shakespeare-500 mt-5">
                            AI Actions
                        </div>

                        <div className="mt-2 flex flex-col space-y-1">
                            {prompts.data.map(prompt =>
                                <div key={prompt.id}>
                                    <AIButton prompt={prompt} task={task.data}/>
                                </div>
                            )}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

export default TaskDetails;