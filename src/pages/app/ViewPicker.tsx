import {useApp} from "./state/AppStateContext.tsx";
import ListView from "./views/ListView.tsx";
import GroupView from "./views/GroupView.tsx";

function ViewPicker() {
    const {state: {view}} = useApp();

    if (view === 'groups')
        return <GroupView />
    return <ListView />
}

export default ViewPicker;