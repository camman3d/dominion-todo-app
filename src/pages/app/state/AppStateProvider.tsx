import {ReactNode} from "react";
import {AppState, AppStateContext, AppViewType} from "./AppStateContext.tsx";
import usePersistentState from "../../../services/persistent-state.ts";


export default function AppStateProvider({children}: {children: ReactNode}) {
    const [sort, setSort] = usePersistentState('state:sort', 'date_due');
    const [filter, setFilter] = usePersistentState('state:filter', '');
    const [view, setView] = usePersistentState<AppViewType>('state:view', 'list');

    const state: AppState = {sort, filter, view};

    return <AppStateContext.Provider value={{state, setSort, setFilter, setView}}>
        {children}
    </AppStateContext.Provider>;

}