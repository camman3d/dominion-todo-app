import {createContext, useContext} from "react";

export type AppViewType = 'list' | 'groups' | 'board' | 'calendar';

export interface AppState {
    sort: string;
    filter: string;
    view: AppViewType;
}

type AppStateContextType = {
    state: AppState,
    setSort: (sort: string) => void,
    setFilter: (filter: string) => void,
    setView: (view: AppViewType) => void,
}

export const AppStateContext = createContext<AppStateContextType>({
    state: {
        sort: '',
        filter: '',
        view: 'list',
    },
    setSort: () => {},
    setFilter: () => {},
    setView: () => {},
})

export const useApp = () => useContext(AppStateContext);