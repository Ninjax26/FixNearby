import React, { useState } from 'react';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition"
          >
            &lt;
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 mb-3">
        <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <div
            key={day}
            className="aspect-square flex items-center justify-center rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;
