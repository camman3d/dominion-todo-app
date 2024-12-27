import {useQuery} from "@tanstack/react-query";
import TaskApi, {Task} from "../../../services/tasks/api.ts";
import TaskCard from "../../../components/TaskCard.tsx";
import {useApp} from "../state/AppStateContext.tsx";

function ListView() {
    const {state} = useApp();
    const tasks = useQuery({queryKey: ['todos', state.sort, state.filter], queryFn: () => TaskApi.current(state.sort, state.filter)});

    return <div className="w-2/3 lg:w-1/3 mx-auto py-5">
        {tasks.status === 'loading' && <div>Loading tasks...</div>}
        {tasks.status === 'error' && <div className="text-red-500">Error: {(tasks.error as Error).message}</div>}
        {tasks.status === 'success' && <div>
            {!tasks.data.length && <div>No tasks</div>}
            {tasks.data.map((task: Task) => <div key={task.id} className="flex flex-col space-y-2 my-5">
                <TaskCard task={task}/>
            </div>)}
        </div>}
    </div>
}

export default ListView;