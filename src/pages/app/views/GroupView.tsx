import usePersistentState from "../../../services/persistent-state.ts";
import {useQuery} from "@tanstack/react-query";
import TaskApi, {Task} from "../../../services/tasks/api.ts";
import {useApp} from "../state/AppStateContext.tsx";
import TaskCard from "../../../components/TaskCard.tsx";

type GroupResult = [Record<string, Task[]>, string[]]

const priorityNames = ['None', 'Critical', 'Urgent', 'High', 'Mid', 'Low', 'Note'];
const priorityNamesOrder = ['Critical', 'Urgent', 'High', 'Mid', 'Low', 'Note', 'None'];
const dateDueOrder = ['24 Hours', '1 Week', 'Later', 'None'];

function groupBy(tasks: Task[], group: string): GroupResult {
    const groups: Record<string, Task[]> = {};

    if (group === 'category') {
        tasks.forEach(task => {
            const categories = task.categories.length ? task.categories : ['Other'];

            categories.forEach(category => {
                if (!groups[category])
                    groups[category] = [];
                groups[category].push(task);
            });
        });

    } else if (group === 'date_due') {
        const now = new Date().getTime();
        const within24H = now + (24 * 60 * 60 * 1000);
        const within1W = now + (7 * 24 * 60 * 60 * 1000);

        tasks.forEach(task => {
            let name = 'None';
            if (task.date_due) {
                const timeDue = new Date(task.date_due).getTime();
                if (timeDue <= within24H)
                    name = '24 Hours';
                else if (timeDue <= within1W)
                    name = '1 Week';
                else
                    name = 'Later'
            }

            if (!groups[name])
                groups[name] = [];
            groups[name].push(task);
        });
        return [groups, dateDueOrder.filter(name => !! groups[name])];

    } else if (group === 'priority') {
        tasks.forEach(task => {
            const name = priorityNames[task.priority];
            if (!groups[name])
                groups[name] = [];
            groups[name].push(task);
        });
        return [groups, priorityNamesOrder.filter(name => !!groups[name])];

    } else if (group === 'location') {
        tasks.forEach(task => {
            const name = task.location || 'None';
            if (!groups[name])
                groups[name] = [];
            groups[name].push(task);
        });
    }

    // Sort categories alphabetically, with 'none' as last
    const names = Object.keys(groups);
    names.sort((a, b) => {
        const aValue = a.toLowerCase();
        const bValue = b.toLowerCase();

        if (aValue === 'none') return 1;
        if (bValue === 'none') return -1;

        return aValue.localeCompare(bValue);
    });
    return [groups, names];
}

function GroupView() {
    const {state} = useApp();
    const [group, setGroup] = usePersistentState('state:group', 'category');
    const tasks = useQuery({queryKey: ['todos', state.sort, state.filter], queryFn: () => TaskApi.current(state.sort, state.filter)});
    const [groups, groupNames]: GroupResult = tasks.status === 'success' ? groupBy(tasks.data, group) : [{}, []];

    return <div className="container mx-auto px-2">
        <div className="flex items-center justify-center space-x-1 my-3 text-sm text-shakespeare-800">
            <div>Group By:</div>
            <select aria-label="Group by" value={group} onChange={(e) => setGroup(e.target.value)}
                    className="px-2 py-1 shadow-inner rounded bg-gray-700/30 text-gray-100 cursor-pointer">
                <option className="text-gray-800 bg-white bg-opacity-0" value="category">Category</option>
                <option className="text-gray-800 bg-white bg-opacity-0" value="priority">Priority</option>
                <option className="text-gray-800 bg-white bg-opacity-0" value="location">Location</option>
                <option className="text-gray-800 bg-white bg-opacity-0" value="date_due">Due Date</option>
            </select>
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap items-center md:items-start justify-center space-y-8 md:space-y-0 md:space-x-2 py-8 md:pb-2">
            {groupNames.map(name => <div key={name} className="w-80">
                <div className="text-center text-lg font-medium text-shakespeare-800">{name}</div>
                <div className="flex flex-col space-y-2">
                    {groups[name].map(task => <TaskCard task={task} key={task.id}/>)}
                </div>

            </div>)}
        </div>
    </div>
}

export default GroupView;