'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { User, Phone, Calendar, Clock, MapPin, CreditCard, QrCode } from 'lucide-react';

const bookingSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(8, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').optional().or(z.literal('')),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  hallId: number;
  date: Date;
  time: string;
  court: number;
  onSubmit: (data: BookingFormData & { hallId: number; date: Date; time: string; court: number }) => void;
  onCancel: () => void;
}

export default function BookingForm({ hallId, date, time, court, onSubmit, onCancel }: BookingFormProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'transfer'>('qr');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const pricePerHour = 150; // лей за час

  const handleFormSubmit = () => {
    setShowPayment(true);
  };

  const handlePaymentConfirm = () => {
    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      hallId,
      date,
      time,
      court
    };
    onSubmit(data);
  };

  if (showPayment) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Оплата бронирования</h3>
        
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">Детали бронирования:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Зал {hallId}, Корт {court}</div>
            <div>{format(date, 'dd MMMM yyyy', { locale: ru })}</div>
            <div>{time}</div>
            <div className="font-semibold text-lg text-blue-600 mt-2">
              Стоимость: {pricePerHour} лей
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Способ оплаты:</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('qr')}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                paymentMethod === 'qr' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <QrCode className="w-5 h-5 mr-2" />
              QR-код
            </button>
            <button
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Перевод
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod === 'qr' && (
          <div className="text-center mb-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              Отсканируйте QR-код для оплаты через банковское приложение
            </p>
          </div>
        )}

        {paymentMethod === 'transfer' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3">Реквизиты для перевода:</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Получатель:</strong> BadmintonClub SRL</div>
              <div><strong>Банк:</strong> Moldova Agroindbank</div>
              <div><strong>IBAN:</strong> MD24AG000000000000000000</div>
              <div><strong>Сумма:</strong> {pricePerHour} лей</div>
              <div><strong>Назначение:</strong> Бронирование зал {hallId}, корт {court}, {format(date, 'dd.MM.yyyy')} {time}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handlePaymentConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Подтвердить оплату
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Форма бронирования</h3>
      
      {/* Booking Details */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center text-blue-800 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-semibold">Зал {hallId}, Корт {court}</span>
        </div>
        <div className="flex items-center text-blue-700 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(date, 'dd MMMM yyyy', { locale: ru })}</span>
        </div>
        <div className="flex items-center text-blue-700">
          <Clock className="w-4 h-4 mr-2" />
          <span>{time}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register('name')}
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите ваше имя"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register('phone')}
              type="tel"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+373 XX XXX XXX"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Email Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (необязательно)
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Price Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Стоимость (1 час):</span>
            <span className="text-lg font-bold text-blue-600">{pricePerHour} лей</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Обработка...' : 'Продолжить к оплате'}
          </button>
        </div>
      </form>
    </div>
  );
}
