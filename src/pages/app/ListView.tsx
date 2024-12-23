import {useQuery} from "@tanstack/react-query";
import TaskApi, {Task} from "../../services/tasks/api.ts";
import TaskCard from "../../components/TaskCard.tsx";
import {useApp} from "./state/AppStateContext.tsx";

function ListView() {
    const {state} = useApp();
    const tasks = useQuery({queryKey: ['todos', state.sort, state.filter], queryFn: () => TaskApi.current(state.sort, state.filter)});

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