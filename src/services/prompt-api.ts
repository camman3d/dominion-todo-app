import {authHeader} from "./auth/auth.ts";

export interface Prompt {
    id: number;
    name: string;
    description: string;
    cost: number,
    returns_json: boolean;
}

export interface TaskPrompt {
    id: number;
    ai_prompt_id: number;
    result: string;
    date_added: string | Date;
}

export interface ApplyPromptResponse {
    success: boolean
    message?: string
    task_prompt?: TaskPrompt
    credit_balance: number
}

const PromptBaseUrl = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE + '/prompts';

const PromptApi = {
    list: async (): Promise<Prompt[]> => {
        const response = await fetch(PromptBaseUrl, {
            method: 'GET',
            headers: {
                ...authHeader(),
            }
        });
        return await response.json();
    },
    byTask: async (taskId: number): Promise<TaskPrompt[]> => {
        const url = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE + '/tasks/' + taskId + '/prompts';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...authHeader(),
            }
        });
        return await response.json();
    },
    apply: async (promptId: number, taskId: number): Promise<ApplyPromptResponse> => {
        const url = `${PromptBaseUrl}/${promptId}/apply/${taskId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...authHeader(),
            }
        });
        return await response.json();
    }
}

export default PromptApi;