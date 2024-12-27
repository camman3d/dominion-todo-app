import {useApp} from "../state/AppStateContext.tsx";
import {useQuery} from "@tanstack/react-query";
import TaskApi from "../../../services/tasks/api.ts";
import {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

function CalendarView() {
    const {state} = useApp();
    const tasks = useQuery({queryKey: ['todos', state.sort, state.filter], queryFn: () => TaskApi.current(state.sort, state.filter)});

    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getDayTasks = (date: Date) => {
        if (tasks.status !== 'success')
            return [];

        return tasks.data.filter(task => {
            if (!task.date_due) return false;
            const taskDate = new Date(task.date_due);
            return taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
        });
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const monthDays = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const daysArray = Array.from({ length: monthDays }, (_, i) => i + 1);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return <div>
        {tasks.status === 'loading' && <div>Loading tasks...</div>}
        {tasks.status === 'error' && <div className="text-red-500">Error: {(tasks.error as Error).message}</div>}
        {tasks.status === 'success' && <div className="container mx-auto">
            <div className="flex flex-row gap-2 items-center justify-center space-y-0 py-4">
                <button onClick={() => changeMonth(-1)}>
                    <ChevronLeft/>
                </button>
                <div className="text-shakespeare-800 font-medium w-32 text-center">{monthName} {year}</div>
                <button onClick={() => changeMonth(1)}>
                    <ChevronRight/>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-shakespeare-800">
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before the first of the month */}
                {Array.from({length: firstDayOfMonth}).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2 h-24"/>
                ))}

                {/* Calendar days */}
                {daysArray.map(day => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dayTasks = getDayTasks(date);

                    return (
                        <div
                            key={day}
                            className="p-2 border rounded-md h-24 overflow-y-auto bg-white bg-opacity-75 hover:bg-opacity-95 transition"
                        >
                            <div className="text-sm text-shakespeare-800 mb-1">{day}</div>
                            {dayTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="text-xs p-1 mb-1 bg-shakespeare-300 rounded"
                                    title={task.description}
                                >
                                    {task.description}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

        </div>}
    </div>
}

export default CalendarView;