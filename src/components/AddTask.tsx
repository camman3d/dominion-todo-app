import {useState} from 'react';
import TaskForm from "./TaskForm.tsx";
import {Plus} from "lucide-react";

function AddTask() {
    const [showAdd, setShowAdd] = useState(false);

    return <div>
        {showAdd ?
            <TaskForm onClose={() => setShowAdd(false)} autoFocus /> :
            <div className="text-center">
                <button onClick={() => setShowAdd(true)}
                        className="inline-flex items-center justify-center space-x-2 text-sm group text-shakespeare-800 hover:text-white transition cursor-pointer"
                >
                    <Plus/>
                    <div>Add Task</div>
                </button>
            </div>
        }
    </div>
}

export default AddTask;