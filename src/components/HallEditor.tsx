'use client';

import { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';

interface Hall {
  id: number;
  name: string;
  courts_count: number;
  price_per_hour: number;
  description: string;
  detailed_description: string;
  features: string[];
  images: string[];
  videos: string[];
  specifications: Record<string, string>;
  amenities: string[];
  working_hours: Record<string, string>;
  is_active: boolean;
}

interface HallEditorProps {
  hall: Hall;
  isEditing: boolean;
  onSave: (hall: Hall) => void;
  onCancel: () => void;
  onChange: (hall: Hall) => void;
}

export default function HallEditor({ hall, isEditing, onSave, onCancel, onChange }: HallEditorProps) {
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      onChange({
        ...hall,
        features: [...hall.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    onChange({
      ...hall,
      features: hall.features.filter((_, i) => i !== index)
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      onChange({
        ...hall,
        amenities: [...hall.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    onChange({
      ...hall,
      amenities: hall.amenities.filter((_, i) => i !== index)
    });
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      onChange({
        ...hall,
        specifications: {
          ...hall.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...hall.specifications };
    delete newSpecs[key];
    onChange({
      ...hall,
      specifications: newSpecs
    });
  };

  const updateWorkingHours = (day: string, hours: string) => {
    onChange({
      ...hall,
      working_hours: {
        ...hall.working_hours,
        [day]: hours
      }
    });
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Особенности */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Особенности</h3>
          <div className="flex flex-wrap gap-2">
            {hall.features.map((feature, index) => (
              <span
                key={index}
                className="bg-altius-blue/10 text-altius-blue px-3 py-1 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Удобства */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Удобства</h3>
          <div className="flex flex-wrap gap-2">
            {hall.amenities.map((amenity, index) => (
              <span
                key={index}
                className="bg-altius-lime/10 text-altius-lime px-3 py-1 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Характеристики */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Характеристики</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(hall.specifications).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700">{key}</div>
                <div className="text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Часы работы */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Часы работы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(hall.working_hours).map(([day, hours]) => (
              <div key={day} className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700 capitalize">{day}</div>
                <div className="text-gray-900">{hours}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Редактирование особенностей */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Особенности</h3>
        <div className="space-y-2">
          {hall.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...hall.features];
                  newFeatures[index] = e.target.value;
                  onChange({ ...hall, features: newFeatures });
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={() => removeFeature(index)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Добавить особенность"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
            />
            <button
              onClick={addFeature}
              className="bg-altius-blue text-white p-2 rounded-lg hover:bg-altius-blue-dark"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Редактирование удобств */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Удобства</h3>
        <div className="space-y-2">
          {hall.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => {
                  const newAmenities = [...hall.amenities];
                  newAmenities[index] = e.target.value;
                  onChange({ ...hall, amenities: newAmenities });
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={() => removeAmenity(index)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Добавить удобство"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
            />
            <button
              onClick={addAmenity}
              className="bg-altius-lime text-white p-2 rounded-lg hover:bg-altius-lime-dark"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Редактирование характеристик */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Характеристики</h3>
        <div className="space-y-2">
          {Object.entries(hall.specifications).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newSpecs = { ...hall.specifications };
                  delete newSpecs[key];
                  newSpecs[e.target.value] = value;
                  onChange({ ...hall, specifications: newSpecs });
                }}
                className="w-1/3 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Название"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  onChange({
                    ...hall,
                    specifications: {
                      ...hall.specifications,
                      [key]: e.target.value
                    }
                  });
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Значение"
              />
              <button
                onClick={() => removeSpecification(key)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="Название характеристики"
              className="w-1/3 border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="text"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Значение"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
            />
            <button
              onClick={addSpecification}
              className="bg-altius-orange text-white p-2 rounded-lg hover:bg-altius-orange-dark"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Редактирование часов работы */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Часы работы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Будни
            </label>
            <input
              type="text"
              value={hall.working_hours.weekdays || ''}
              onChange={(e) => updateWorkingHours('weekdays', e.target.value)}
              placeholder="06:00 - 23:00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Выходные
            </label>
            <input
              type="text"
              value={hall.working_hours.weekends || ''}
              onChange={(e) => updateWorkingHours('weekends', e.target.value)}
              placeholder="08:00 - 22:00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center space-x-4 pt-4 border-t">
        <button
          onClick={() => onSave(hall)}
          className="bg-altius-blue text-white px-6 py-2 rounded-lg hover:bg-altius-blue-dark transition-colors inline-flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить изменения
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
