import {authHeader} from "./auth/auth.ts";

export interface CreditTransaction {
    id: number
    amount: number
    date: Date | string
    stripe_payment_id?: string
    task_prompt_id?: number
}

interface CreditBalance {
    credit_balance: number
}

const CreditBaseUrl = import.meta.env.VITE_API_HOST + import.meta.env.VITE_API_BASE + '/credits';

const CreditApi = {
    list: async (): Promise<CreditTransaction[]> => {
        const response = await fetch(CreditBaseUrl, {
            method: 'GET',
            headers: {
                ...authHeader(),
            }
        });
        return await response.json();
    },
    balance: async (): Promise<CreditBalance> => {
        const url = CreditBaseUrl + '/balance';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...authHeader(),
            }
        });
        return await response.json();
    },
}

export default CreditApi;