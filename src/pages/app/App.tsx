import {Navigate, Route, Routes} from "react-router-dom";
import {useAuth} from "../../services/auth/AuthContext.tsx";
import AppStateProvider from "./state/AppStateProvider.tsx";
import ViewPicker from "./ViewPicker.tsx";
import TaskDetails from "./TaskDetails.tsx";

function App() {
    const {authState} = useAuth();

    if (!authState.user)
        return <Navigate to="/login" />;

    return <AppStateProvider>
        <Routes>
            <Route path="/" element={<ViewPicker />} />
            <Route path="/task/:taskId" element={<TaskDetails />} />
        </Routes>
    </AppStateProvider>
}

export default App;