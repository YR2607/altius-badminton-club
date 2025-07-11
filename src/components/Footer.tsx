import { Phone, MapPin, Clock, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-altius-lime mb-4">
              🏸 Altius
            </div>
            <p className="text-gray-300 mb-4">
              Современный бадминтонный клуб в Кишиневе с профессиональными кортами
              и удобной системой бронирования.
            </p>
            <div className="flex items-center text-gray-300 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Кишинев, Молдова
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                +373 XX XXX XXX
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                info@altius.md
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                ул. Примерная, 123, Кишинев
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Режим работы</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                <div>
                  <div>Пн-Пт: 06:00 - 23:00</div>
                  <div>Сб-Вс: 08:00 - 22:00</div>
                </div>
              </div>
            </div>
            
            {/* Halls Info */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Наши залы:</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Зал 1: 3 корта</div>
                <div>Зал 2: 7 кортов</div>
                <div>Зал 3: 7 кортов</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Altius Кишинев. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
