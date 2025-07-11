'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';



interface BookingCalendarProps {
  hallId: number;
  onSlotSelect: (date: Date, time: string, court: number) => void;
}

export default function BookingCalendar({ hallId, onSlotSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Генерируем временные слоты с 6:00 до 23:00
  const timeSlots: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Получаем количество кортов для зала
  const getCourtCount = (hallId: number) => {
    switch (hallId) {
      case 1: return 3;
      case 2: return 7;
      case 3: return 7;
      default: return 3;
    }
  };

  const courtCount = getCourtCount(hallId);

  // Генерируем дни недели
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // Симуляция занятых слотов (в реальном приложении это будет из API)
  const isSlotBooked = (date: Date, time: string, court: number) => {
    // Случайная логика для демонстрации
    const dateStr = format(date, 'yyyy-MM-dd');
    // Используем dateStr, time и court для генерации случайного значения
    const hash = dateStr.length + time.length + court;
    return hash % 3 === 0; // 33% слотов заняты
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Выберите дату и время
        </h3>
        <p className="text-gray-600">
          Зал {hallId} • {courtCount} кортов
        </p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-lg font-semibold">
          {format(currentWeek, 'MMMM yyyy', { locale: ru })}
        </div>
        
        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDate(day)}
            className={`p-3 text-center rounded-lg transition-colors ${
              isSameDay(day, selectedDate)
                ? 'bg-blue-600 text-white'
                : isToday(day)
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {format(day, 'EEE', { locale: ru })}
            </div>
            <div className="font-semibold">
              {format(day, 'd')}
            </div>
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {timeSlots.map((time) => (
            <div key={time} className="border rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">{time}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: courtCount }, (_, courtIndex) => {
                  const court = courtIndex + 1;
                  const isBooked = isSlotBooked(selectedDate, time, court);
                  
                  return (
                    <button
                      key={court}
                      onClick={() => !isBooked && onSlotSelect(selectedDate, time, court)}
                      disabled={isBooked}
                      className={`p-2 text-sm rounded transition-colors ${
                        isBooked
                          ? 'bg-red-100 text-red-600 cursor-not-allowed'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      Корт {court}
                      {isBooked && (
                        <div className="text-xs">Занят</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
