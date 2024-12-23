import {authHeader} from "../auth/auth.ts";

export interface TaskBase {
    description: string;
    location: string,
    priority: number,
    date_due: Date | string | null;
    date_completed: Date | string | null;
    status: string | null;
    categories: string[];
}

export type Task = TaskBase & {id: number};

const TaskBaseUrl = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE + '/tasks';

const TaskApi = {
    current: async (sort: string, filter: string): Promise<Task[]> => {
        const url = TaskBaseUrl + '?' + new URLSearchParams([['sort', sort], ['filter_name', filter]]).toString();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...authHeader(),
            }
        });
        return await response.json();
    },
    create: async (task: TaskBase): Promise<Task> => {
        const response = await fetch(TaskBaseUrl, {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            }
        });
        return await response.json();
    },
    update: async (task: Task): Promise<Task> => {
        const response = await fetch(TaskBaseUrl + '/' + task.id, {
            method: 'PUT',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            }
        });
        return await response.json();
    },
    delete: async (taskId: number): Promise<void> => {
        const response = await fetch(TaskBaseUrl + '/' + taskId, {
            method: 'DELETE',
            headers: {...authHeader()}
        });
        return await response.json();
    }
}

export default TaskApi;