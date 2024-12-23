import {ReactNode, useState} from "react";
import {AppStateContext, AppViewType} from "./AppStateContext.tsx";


export default function AppStateProvider({children}: {children: ReactNode}) {
    const [sort, setSort] = useState('date_due');
    const [filter, setFilter] = useState('');
    const [view, setView] = useState<AppViewType>('list');

    const state = {sort, filter, view};

    return <AppStateContext.Provider value={{state, setSort, setFilter, setView}}>
        {children}
    </AppStateContext.Provider>;

}