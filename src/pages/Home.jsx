import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Droplets, Heart, Settings, Plus } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { 
  getCyclePhase, 
  getPhaseInfo, 
  getDaysUntilNextPeriod,
  getDaysUntilOvulation,
  calculateNextPeriod,
  calculateOvulationDate
} from '../utils/cycleCalculations';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(0);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState(0);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      
      const today = new Date();
      const lastPeriodStart = new Date(savedProfile.lastPeriodStart);
      
      const phase = getCyclePhase(
        today,
        lastPeriodStart,
        savedProfile.cycleLength,
        savedProfile.periodLength
      );
      setCurrentPhase(phase);
      
      setDaysUntilPeriod(getDaysUntilNextPeriod(lastPeriodStart, savedProfile.cycleLength));
      setDaysUntilOvulation(getDaysUntilOvulation(lastPeriodStart, savedProfile.cycleLength));
    }
  }, []);

  const phaseInfo = currentPhase ? getPhaseInfo(currentPhase) : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Bienvenida! 💕</h2>
          <p className="text-gray-600 mb-6">
            Para comenzar a trackear tu ciclo, necesitamos configurar tu perfil.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Configurar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hola, {profile.name} 👋
            </h1>
            <p className="text-gray-600 text-sm">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="text-gray-600" size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Fase actual */}
        {phaseInfo && (
          <div className={`${phaseInfo.color} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{phaseInfo.icon}</span>
              <div className="text-right">
                <p className="text-sm opacity-90">Fase actual</p>
                <p className="text-2xl font-bold">{phaseInfo.name}</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4">{phaseInfo.description}</p>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs font-semibold mb-2">💡 Tips para hoy:</p>
              <ul className="text-xs space-y-1">
                {phaseInfo.tips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Contadores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center mb-3">
              <Calendar className="text-pink-500 mr-2" size={20} />
              <p className="text-sm text-gray-600">Próximo periodo</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {daysUntilPeriod > 0 ? daysUntilPeriod : '¡Hoy!'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {daysUntilPeriod > 0 ? 'días restantes' : 'día del periodo'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center mb-3">
              <Droplets className="text-purple-500 mr-2" size={20} />
              <p className="text-sm text-gray-600">Ovulación</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {daysUntilOvulation > 0 ? daysUntilOvulation : '¡Hoy!'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {daysUntilOvulation > 0 ? 'días restantes' : 'día de ovulación'}
            </p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/calendar')}
              className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-center">
                <Calendar className="text-pink-500 mr-3" size={20} />
                <span className="font-medium text-gray-900">Ver calendario</span>
              </div>
              <span className="text-pink-500">→</span>
            </button>

            <button
              onClick={() => navigate('/symptoms')}
              className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center">
                <Heart className="text-purple-500 mr-3" size={20} />
                <span className="font-medium text-gray-900">Registrar síntomas</span>
              </div>
              <span className="text-purple-500">→</span>
            </button>

            <button
              onClick={() => navigate('/ovulation')}
              className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center">
                <Droplets className="text-green-500 mr-3" size={20} />
                <span className="font-medium text-gray-900">Ventana fértil</span>
              </div>
              <span className="text-green-500">→</span>
            </button>
          </div>
        </div>

        {/* Información del ciclo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu ciclo</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duración del ciclo</span>
              <span className="font-semibold text-gray-900">{profile.cycleLength} días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duración del periodo</span>
              <span className="font-semibold text-gray-900">{profile.periodLength} días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Último periodo</span>
              <span className="font-semibold text-gray-900">
                {format(new Date(profile.lastPeriodStart), 'dd/MM/yyyy', { locale: es })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
