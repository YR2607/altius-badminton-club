'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Calendar,
  Users,
  Trophy,
  GraduationCap,
  Star,
  Dumbbell,
  Coffee,
  Car,
  Wifi,
  ShowerHead,
  Shirt
} from 'lucide-react';

export default function ServicesPage() {
  const mainServices = [
    {
      icon: Calendar,
      title: 'Аренда кортов',
      description: 'Почасовая аренда профессиональных кортов для игры в бадминтон',
      features: [
        'Корты международного стандарта',
        'Профессиональное покрытие',
        'Отличное освещение',
        'Климат-контроль'
      ],
      price: 'от 150 лей/час',
      popular: true
    },
    {
      icon: GraduationCap,
      title: 'Тренировки',
      description: 'Индивидуальные и групповые тренировки с профессиональными тренерами',
      features: [
        'Индивидуальные занятия',
        'Групповые тренировки',
        'Детские секции',
        'Программы для начинающих'
      ],
      price: 'от 300 лей/занятие',
      popular: false
    },
    {
      icon: Trophy,
      title: 'Турниры',
      description: 'Организация и проведение турниров различного уровня',
      features: [
        'Любительские турниры',
        'Профессиональные соревнования',
        'Корпоративные турниры',
        'Детские соревнования'
      ],
      price: 'по запросу',
      popular: false
    },
    {
      icon: Users,
      title: 'Корпоративные мероприятия',
      description: 'Организация спортивных мероприятий для компаний',
      features: [
        'Тимбилдинг мероприятия',
        'Корпоративные турниры',
        'Аренда залов для мероприятий',
        'Кейтеринг услуги'
      ],
      price: 'от 2000 лей/мероприятие',
      popular: false
    }
  ];

  const additionalServices = [
    {
      icon: Dumbbell,
      title: 'Фитнес-зона',
      description: 'Тренажерный зал для общей физической подготовки'
    },
    {
      icon: Coffee,
      title: 'Кафе',
      description: 'Зона отдыха с напитками и легкими закусками'
    },
    {
      icon: Car,
      title: 'Парковка',
      description: 'Бесплатная охраняемая парковка для посетителей'
    },
    {
      icon: Wifi,
      title: 'Wi-Fi',
      description: 'Бесплатный высокоскоростной интернет'
    },
    {
      icon: ShowerHead,
      title: 'Душевые',
      description: 'Современные душевые кабины с горячей водой'
    },
    {
      icon: Shirt,
      title: 'Прокат инвентаря',
      description: 'Ракетки, воланы и спортивная форма в аренду'
    }
  ];

  const pricingPlans = [
    {
      name: 'Разовое посещение',
      price: '150-200',
      period: 'лей/час',
      description: 'Идеально для редких игр',
      features: [
        'Аренда корта на час',
        'Доступ к раздевалкам',
        'Бесплатная парковка',
        'Wi-Fi'
      ],
      popular: false
    },
    {
      name: 'Абонемент на месяц',
      price: '1200',
      period: 'лей/месяц',
      description: 'Для регулярных тренировок',
      features: [
        '10 часов игры',
        'Скидка 20% на дополнительные часы',
        'Приоритетное бронирование',
        'Доступ к фитнес-зоне'
      ],
      popular: true
    },
    {
      name: 'VIP абонемент',
      price: '2500',
      period: 'лей/месяц',
      description: 'Максимальный комфорт',
      features: [
        'Безлимитная игра',
        'VIP раздевалки',
        'Персональный тренер (2 занятия)',
        'Бесплатный прокат инвентаря'
      ],
      popular: false
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
              Наши услуги
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Полный спектр услуг для любителей бадминтона - 
              от аренды кортов до профессиональных тренировок
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Основные услуги</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы предлагаем широкий спектр услуг для игроков любого уровня
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg p-6 relative ${
                  service.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Популярно
                    </span>
                  </div>
                )}
                
                <div className="flex items-start mb-4">
                  <service.icon className="w-8 h-8 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Дополнительные услуги</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы заботимся о вашем комфорте и предлагаем множество дополнительных удобств
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <service.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Тарифные планы</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Выберите подходящий тариф для регулярных занятий бадминтоном
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg p-6 relative ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Рекомендуем
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 text-sm">{plan.period}</div>
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Выбрать план
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-blue-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Нужна консультация?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Наши специалисты помогут выбрать подходящий тариф и ответят на все вопросы
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Связаться с нами
            </button>
            <button 
              onClick={() => window.location.href = '/#halls'}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Забронировать корт
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
