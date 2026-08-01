import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar as CalendarIcon, Smile, Flame, Utensils, Zap, Moon, AlertCircle, Droplet, Coffee, Headphones } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const ManSymptoms = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      if (savedProfile && savedProfile.gender === 'man') {
        setProfile(savedProfile);
        // Simular datos de la pareja
        const simulatedPartner = {
          name: 'Tu Pareja'
        };
        setPartnerData(simulatedPartner);
        loadSymptoms(selectedDate);
      } else {
        navigate('/');
      }
    };
    loadProfile();
  }, [selectedDate]);

  const loadSymptoms = (date) => {
    // Aquí se cargarían los síntomas del backend
    // Por ahora, simulamos datos
    const simulatedSymptoms = {
      mood: 'Feliz',
      libido: 'Alta',
      cravings: 'Chocolate',
      energy: 'Alta',
      sleep: 'Bien',
      pain: 'Ninguno',
      skin: 'Normal',
      digestion: 'Normal',
      headache: 'Ninguno',
      notes: 'Se siente muy bien hoy'
    };
    setSymptoms(simulatedSymptoms);
  };

  const getSymptomIcon = (category) => {
    switch (category) {
      case 'mood': return Smile;
      case 'libido': return Flame;
      case 'cravings': return Utensils;
      case 'energy': return Zap;
      case 'sleep': return Moon;
      case 'pain': return AlertCircle;
      case 'skin': return Droplet;
      case 'digestion': return Coffee;
      case 'headache': return Headphones;
      default: return Heart;
    }
  };

  const getSymptomLabel = (category) => {
    switch (category) {
      case 'mood': return 'Estado de ánimo';
      case 'libido': return 'Libido';
      case 'cravings': return 'Antojos';
      case 'energy': return 'Energía';
      case 'sleep': return 'Sueño';
      case 'pain': return 'Dolor';
      case 'skin': return 'Piel';
      case 'digestion': return 'Digestión';
      case 'headache': return 'Dolor de cabeza';
      default: return category;
    }
  };

  if (!profile || !partnerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/man-home')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Síntomas</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Selector de fecha */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar fecha
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              onClick={(e) => e.target.showPicker?.()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Síntomas de {partnerData.name}
          </p>
        </div>

        {/* Síntomas del día */}
        {symptoms ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="mr-2 text-pink-500" size={20} />
              Síntomas del {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(symptoms).map(([key, value]) => {
                if (key === 'notes') return null;
                const Icon = getSymptomIcon(key);
                return (
                  <div key={key} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Icon className="text-blue-500 mr-2" size={18} />
                      <span className="text-sm font-medium text-gray-700">
                        {getSymptomLabel(key)}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {value || 'No registrado'}
                    </p>
                  </div>
                );
              })}
            </div>

            {symptoms.notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Heart className="mr-2 text-pink-500" size={16} />
                  Notas
                </h3>
                <p className="text-sm text-gray-700">
                  {symptoms.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <Heart className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sin síntomas registrados
            </h3>
            <p className="text-sm text-gray-600">
              {partnerData.name} no ha registrado síntomas para esta fecha.
            </p>
          </div>
        )}

        {/* Información */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Heart className="mr-2 text-pink-500" size={18} />
            Información
          </h3>
          <p className="text-sm text-gray-600">
            Aquí puedes ver los síntomas que {partnerData.name} ha registrado. 
            Esta información es de solo lectura para ayudarte a entender cómo se siente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManSymptoms;
