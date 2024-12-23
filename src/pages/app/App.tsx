import {Navigate, Route, Routes} from "react-router-dom";
import {useAuth} from "../../services/auth/AuthContext.tsx";
import ListView from "./ListView.tsx";
import AddTask from "../../components/AddTask.tsx";
import ControlBar from "./ControlBar.tsx";
import AppStateProvider from "./state/AppStateProvider.tsx";

function App() {
    const {authState} = useAuth();

    if (!authState.user)
        return <Navigate to="/login" />;

    return <AppStateProvider>
        <ControlBar />

        <div className="w-2/3 lg:w-1/3 mx-auto py-5">
            <AddTask/>
            <Routes>
                <Route path="/" element={<ListView/>}/>
                <Route path="/list" element={<ListView/>}/>
            </Routes>
        </div>
    </AppStateProvider>
}

export default App;