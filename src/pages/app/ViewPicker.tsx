import {useApp} from "./state/AppStateContext.tsx";
import ListView from "./views/ListView.tsx";
import GroupView from "./views/GroupView.tsx";
import CalendarView from "./views/CalendarView.tsx";
import ControlBar from "./ControlBar.tsx";
import AddTask from "../../components/AddTask.tsx";

function ViewPicker() {
    const {state: {view}} = useApp();

    return <div>
        <ControlBar/>
        <div className="w-2/3 lg:w-1/3 mx-auto py-5">
            <AddTask/>
        </div>
        {view === 'list' && <ListView />}
        {view === 'groups' && <GroupView />}
        {view === 'calendar' && <CalendarView />}
    </div>
}

export default ViewPicker;