import React, { useState } from 'react';

interface DatePickerProps {
    onDateChange?: (date: Date) => void;
    initialDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   onDateChange,
                                                   initialDate = new Date()
                                               }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const startDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        setSelectedDate(newDate);
        onDateChange?.(newDate);
    };

    const handleMonthChange = (increment: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setSelectedDate(newDate);
    };

    const getDayArray = () => {
        const days = [];
        const totalDays = daysInMonth(selectedDate);
        const startDay = startDayOfMonth(selectedDate);

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= totalDays; i++) {
            days.push(i);
        }

        return days;
    };

    return <div className="absolute z-10 w-64 mt-1 bg-white border rounded shadow text-sm">
        <div className="flex items-center justify-between p-2 border-b">
            <button
                onClick={() => handleMonthChange(-1)}
                className="p-1 hover:bg-gray-100 rounded"
            >
                ←
            </button>
            <span>
              {selectedDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
              })}
            </span>
            <button
                onClick={() => handleMonthChange(1)}
                className="p-1 hover:bg-gray-100 rounded"
            >
                →
            </button>
        </div>

        <div className="grid grid-cols-7 gap-1 p-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-sm text-gray-600">
                    {day}
                </div>
            ))}

            {getDayArray().map((day, index) => (
                <div
                    key={index}
                    onClick={() => day && handleDateSelect(day)}
                    className={`
                      text-center p-1 ${day ? 'cursor-pointer hover:bg-gray-100' : ''}
                      ${day === selectedDate.getDate() ? 'bg-blue-500 text-white rounded' : ''}
                    `}
                >
                    {day}
                </div>
            ))}
        </div>
    </div>;
};

export default DatePicker;