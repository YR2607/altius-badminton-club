'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Award, Clock, Target, Heart, Star } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Александр Петров',
      position: 'Директор клуба',
      experience: '15 лет в бадминтоне',
      description: 'Мастер спорта по бадминтону, основатель клуба',
      image: '/api/placeholder/300/300?text=Александр+Петров'
    },
    {
      name: 'Мария Иванова',
      position: 'Главный тренер',
      experience: '12 лет тренерского стажа',
      description: 'Кандидат в мастера спорта, специалист по работе с детьми',
      image: '/api/placeholder/300/300?text=Мария+Иванова'
    },
    {
      name: 'Дмитрий Сидоров',
      position: 'Тренер',
      experience: '8 лет в спорте',
      description: 'Специалист по технической подготовке игроков',
      image: '/api/placeholder/300/300?text=Дмитрий+Сидоров'
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: '500+ довольных клиентов',
      description: 'За 5 лет работы мы обслужили более 500 постоянных клиентов'
    },
    {
      icon: Users,
      title: '17 профессиональных кортов',
      description: '3 современных зала с кортами международного стандарта'
    },
    {
      icon: Clock,
      title: '16 часов работы в день',
      description: 'Работаем с 6:00 до 23:00 для вашего удобства'
    },
    {
      icon: Target,
      title: '50+ турниров проведено',
      description: 'Организуем турниры различного уровня для всех возрастов'
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
              О нашем клубе
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              BadmintonClub Кишинев - ведущий бадминтонный клуб Молдовы, 
              где профессионализм встречается с комфортом
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша история</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  BadmintonClub Кишинев был основан в 2019 году группой энтузиастов бадминтона, 
                  которые мечтали создать современный спортивный центр европейского уровня в столице Молдовы.
                </p>
                <p>
                  За пять лет работы мы выросли от небольшого зала с тремя кортами до крупнейшего 
                  бадминтонного комплекса в стране с 17 профессиональными кортами в трех залах.
                </p>
                <p>
                  Сегодня наш клуб является домашней ареной для сборной команды Молдовы по бадминтону 
                  и местом проведения международных турниров.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-8 text-white">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏸</div>
                  <h3 className="text-2xl font-bold mb-4">5 лет успеха</h3>
                  <p className="text-blue-100">
                    Мы гордимся тем, что стали частью спортивной жизни Кишинева 
                    и помогли сотням людей полюбить бадминтон
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Наша миссия и ценности</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы стремимся популяризировать бадминтон в Молдове и создавать условия 
              для развития спорта на всех уровнях
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Любовь к спорту</h3>
              <p className="text-gray-600">
                Мы искренне любим бадминтон и хотим поделиться этой страстью с каждым посетителем
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Качество</h3>
              <p className="text-gray-600">
                Только лучшее оборудование, покрытия и условия для комфортной игры
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Сообщество</h3>
              <p className="text-gray-600">
                Мы создаем дружественную атмосферу, где каждый чувствует себя частью большой семьи
              </p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши достижения</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              За годы работы мы достигли значительных результатов и продолжаем развиваться
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <achievement.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Наша команда</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Профессиональные тренеры и администраторы, которые сделают ваше пребывание 
              в клубе максимально комфортным
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">👤</div>
                    <div className="text-xl font-semibold">{member.name}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.experience}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к нам!</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Станьте частью нашего спортивного сообщества. Забронируйте корт 
            и почувствуйте разницу игры в профессиональных условиях.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/#halls'}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Забронировать корт
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Связаться с нами
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
