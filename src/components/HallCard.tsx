import { Users, MapPin, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface HallCardProps {
  id: number;
  name: string;
  courts: number;
  image: string;
  description: string;
  features: string[];
  pricePerHour: number;
  onBookClick: (hallId: number) => void;
}

export default function HallCard({
  id,
  name,
  courts,
  description,
  features,
  pricePerHour,
  onBookClick
}: HallCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className={`relative h-64 ${
        id === 1 ? 'bg-gradient-to-br from-altius-blue to-altius-blue-dark' :
        id === 2 ? 'bg-gradient-to-br from-altius-lime to-altius-lime-dark' :
        'bg-gradient-to-br from-altius-orange to-altius-orange-dark'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-2">🏸</div>
            <div className="text-xl font-semibold">{name}</div>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <div className="flex items-center text-sm font-semibold text-gray-700">
            <Users className="w-4 h-4 mr-1" />
            {courts} кортов
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Особенности:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                  id === 1 ? 'bg-altius-blue' :
                  id === 2 ? 'bg-altius-lime' :
                  'bg-altius-orange'
                }`}></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Price and Location */}
        <div className="flex items-center justify-between mb-4">
          <div className={`text-lg font-bold ${
            id === 1 ? 'text-altius-blue' :
            id === 2 ? 'text-altius-lime' :
            'text-altius-orange'
          }`}>
            {pricePerHour} лей/час
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            Кишинев
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href={`/halls/${id}`}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Подробнее
          </Link>
          <button
            onClick={() => onBookClick(id)}
            className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
              id === 1 ? 'bg-altius-blue hover:bg-altius-blue-dark' :
              id === 2 ? 'bg-altius-lime hover:bg-altius-lime-dark' :
              'bg-altius-orange hover:bg-altius-orange-dark'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
}
