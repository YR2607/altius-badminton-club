'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      // Якорная ссылка - переходим на главную страницу если не на ней
      if (pathname !== '/') {
        router.push('/' + href);
      } else {
        // Если уже на главной странице, просто скроллим
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Обычная ссылка
      router.push(href);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-altius-blue">
              🏸 Altius
            </div>
            <div className="ml-2 text-sm text-gray-600 hidden sm:block">
              Кишинев
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className="text-gray-700 hover:text-altius-blue transition-colors"
            >
              Главная
            </button>
            <button
              onClick={() => handleNavigation('/about')}
              className="text-gray-700 hover:text-altius-lime transition-colors"
            >
              О нас
            </button>
            <button
              onClick={() => handleNavigation('#halls')}
              className="text-gray-700 hover:text-altius-orange transition-colors"
            >
              Залы
            </button>
            <button
              onClick={() => handleNavigation('/services')}
              className="text-gray-700 hover:text-altius-blue transition-colors"
            >
              Услуги
            </button>
            <button
              onClick={() => handleNavigation('/contact')}
              className="text-gray-700 hover:text-altius-lime transition-colors"
            >
              Контакты
            </button>
            <Link href="/admin" className="text-gray-700 hover:text-altius-orange transition-colors">
              Админ
            </Link>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              +373 XX XXX XXX
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              Кишинев
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation('/')}
                className="text-gray-700 hover:text-altius-blue transition-colors text-left"
              >
                Главная
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="text-gray-700 hover:text-altius-lime transition-colors text-left"
              >
                О нас
              </button>
              <button
                onClick={() => handleNavigation('#halls')}
                className="text-gray-700 hover:text-altius-orange transition-colors text-left"
              >
                Залы
              </button>
              <button
                onClick={() => handleNavigation('/services')}
                className="text-gray-700 hover:text-altius-blue transition-colors text-left"
              >
                Услуги
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className="text-gray-700 hover:text-altius-lime transition-colors text-left"
              >
                Контакты
              </button>
              <Link href="/admin" className="text-gray-700 hover:text-altius-orange transition-colors">
                Админ
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4 mr-1" />
                  +373 XX XXX XXX
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  Кишинев
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
