import {useApp} from "./state/AppStateContext.tsx";
import ListView from "./views/ListView.tsx";
import GroupView from "./views/GroupView.tsx";
import CalendarView from "./views/CalendarView.tsx";

function ViewPicker() {
    const {state: {view}} = useApp();

    if (view === 'groups')
        return <GroupView />
    if (view === 'calendar')
        return <CalendarView />
    return <ListView />
}

export default ViewPicker;