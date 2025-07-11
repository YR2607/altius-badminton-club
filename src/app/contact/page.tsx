'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  CheckCircle,
  MessageSquare,
  Navigation,
  Calendar
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(8, 'Введите корректный номер телефона'),
  subject: z.string().min(5, 'Тема должна содержать минимум 5 символов'),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    // Симуляция отправки формы
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contact form submitted:', data);
    setIsSubmitted(true);
    reset();
    
    // Сброс состояния через 3 секунды
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Адрес',
      details: ['ул. Примерная, 123', 'Кишинев, Молдова', 'MD-2001'],
      action: 'Построить маршрут'
    },
    {
      icon: Phone,
      title: 'Телефон',
      details: ['+373 XX XXX XXX', '+373 YY YYY YYY'],
      action: 'Позвонить'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@badmintonclub.md', 'booking@badmintonclub.md'],
      action: 'Написать'
    },
    {
      icon: Clock,
      title: 'Режим работы',
      details: ['Пн-Пт: 06:00 - 23:00', 'Сб-Вс: 08:00 - 22:00'],
      action: 'Забронировать'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Контакты
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Свяжитесь с нами любым удобным способом. 
              Мы всегда готовы ответить на ваши вопросы!
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <info.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                <div className="space-y-1 mb-4">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {info.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Напишите нам</h2>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Сообщение отправлено!
                </h3>
                <p className="text-gray-600">
                  Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ваше имя"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+373 XX XXX XXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тема *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Тема сообщения"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Сообщение *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ваше сообщение..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    'Отправка...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить сообщение
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Navigation className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Как нас найти</h3>
                </div>
              </div>
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <div className="font-medium">Интерактивная карта</div>
                  <div className="text-sm">ул. Примерная, 123, Кишинев</div>
                </div>
              </div>
              <div className="p-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Открыть в Google Maps
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Быстрые действия</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/#halls'}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-lg transition-colors flex items-center"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Забронировать корт
                </button>
                <button className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-lg transition-colors flex items-center">
                  <Phone className="w-5 h-5 mr-3" />
                  Позвонить сейчас
                </button>
                <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-lg transition-colors flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  Написать email
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Часто задаваемые вопросы</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Можно ли забронировать корт по телефону?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Да, вы можете забронировать корт по телефону или через наш сайт.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Есть ли парковка?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Да, у нас есть бесплатная охраняемая парковка для всех посетителей.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Можно ли арендовать инвентарь?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Да, мы предоставляем в аренду ракетки, воланы и спортивную форму.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
