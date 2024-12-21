import {authHeader} from "../auth/auth.ts";

export interface TaskBase {
    description: string;
    location: string | null,
    priority: number | null,
    date_due: Date | string | null;
    date_completed: Date | string | null;
    status: string | null;
    categories: string[];
}

export type Task = TaskBase & {id: number};

const TaskBaseUrl = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE + '/tasks';

const TaskApi = {
    current: async (): Promise<Task[]> => {
        const response = await fetch(TaskBaseUrl, {
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
    }
}

export default TaskApi;