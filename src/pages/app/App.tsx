import {Navigate} from "react-router-dom";
import {useAuth} from "../../services/auth/AuthContext.tsx";
import ControlBar from "./ControlBar.tsx";
import AppStateProvider from "./state/AppStateProvider.tsx";
import ViewPicker from "./ViewPicker.tsx";
import AddTask from "../../components/AddTask.tsx";

function App() {
    const {authState} = useAuth();

    if (!authState.user)
        return <Navigate to="/login" />;

    return <AppStateProvider>
        <ControlBar/>
        <div className="w-2/3 lg:w-1/3 mx-auto py-5">
            <AddTask/>
        </div>
        <ViewPicker/>
    </AppStateProvider>
}

export default App;