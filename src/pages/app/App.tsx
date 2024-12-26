import {Navigate} from "react-router-dom";
import {useAuth} from "../../services/auth/AuthContext.tsx";
import ControlBar from "./ControlBar.tsx";
import AppStateProvider from "./state/AppStateProvider.tsx";
import ViewPicker from "./ViewPicker.tsx";

function App() {
    const {authState} = useAuth();

    if (!authState.user)
        return <Navigate to="/login" />;

    return <AppStateProvider>
        <ControlBar />
        <ViewPicker />
    </AppStateProvider>
}

export default App;