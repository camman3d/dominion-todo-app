import {useQuery} from "@tanstack/react-query";
import TaskApi, {Task} from "../../services/tasks/api.ts";
import TaskCard from "../../components/TaskCard.tsx";

function ListView() {
    const tasks = useQuery({queryKey: ['todos'], queryFn: TaskApi.current});

    if (tasks.isLoading)
        return <div>Loading tasks...</div>;
    if (tasks.isError)
        return <div className="text-red-500">Error: {(tasks.error as Error).message}</div>
    return <div>
        {!tasks.data.length && <div>No tasks</div>}
        {tasks.data.map((task: Task) => <div key={task.id} className="flex flex-col space-y-2 my-5">
            <TaskCard task={task} />
        </div>)}
    </div>

}

export default ListView;