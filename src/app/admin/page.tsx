'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Calendar, 
  Users, 
  Clock, 
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hallId: number;
  court: number;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export default function AdminPage() {
  const [selectedHall, setSelectedHall] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Симуляция данных бронирований
  const mockBookings: Booking[] = [
    {
      id: '1',
      name: 'Иван Петров',
      phone: '+373 69 123 456',
      email: 'ivan@example.com',
      hallId: 1,
      court: 1,
      date: new Date(),
      time: '10:00',
      status: 'confirmed',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Мария Иванова',
      phone: '+373 69 789 012',
      hallId: 2,
      court: 3,
      date: addDays(new Date(), 1),
      time: '14:30',
      status: 'pending',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Александр Сидоров',
      phone: '+373 69 345 678',
      email: 'alex@example.com',
      hallId: 1,
      court: 2,
      date: new Date(),
      time: '18:00',
      status: 'confirmed',
      createdAt: new Date()
    }
  ];

  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      format(booking.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      (!selectedHall || booking.hallId === selectedHall)
    );
  };

  const updateBookingStatus = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      default: return 'Неизвестно';
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Панель администратора
            </h1>
            <div className="text-sm text-gray-500">
              BadmintonClub Кишинев
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Сегодня</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getBookingsForDate(new Date()).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Подтверждено</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ожидает</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всего</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedHall || ''}
              onChange={(e) => setSelectedHall(e.target.value ? parseInt(e.target.value) : null)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Все залы</option>
              <option value="1">Зал 1 (3 корта)</option>
              <option value="2">Зал 2 (7 кортов)</option>
              <option value="3">Зал 3 (7 кортов)</option>
            </select>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Расписание бронирований
              </h2>
              <div className="flex items-center space-x-4">
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
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => {
                const dayBookings = getBookingsForDate(day);
                return (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="text-center mb-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {format(day, 'EEE', { locale: ru })}
                      </div>
                      <div className="font-semibold">
                        {format(day, 'd')}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="text-xs p-2 rounded border-l-2 border-blue-500 bg-blue-50"
                        >
                          <div className="font-medium">{booking.time}</div>
                          <div className="text-gray-600">
                            Зал {booking.hallId}, Корт {booking.court}
                          </div>
                          <div className="text-gray-600 truncate">
                            {booking.name}
                          </div>
                          <div className={`inline-block px-1 py-0.5 rounded text-xs ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Все бронирования
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Контакты
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Бронирование
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {booking.phone}
                      </div>
                      {booking.email && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {booking.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(booking.date, 'dd.MM.yyyy', { locale: ru })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.time} • Зал {booking.hallId}, Корт {booking.court}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Подтвердить"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Отменить"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
