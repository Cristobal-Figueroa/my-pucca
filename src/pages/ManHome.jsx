import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Droplets, Lightbulb, User, RefreshCw, Activity } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { getCyclePhase, CYCLE_PHASES } from '../utils/cycleCalculations';
import { differenceInDays } from 'date-fns';

const ManHome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [cycleDay, setCycleDay] = useState(0);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(0);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState(0);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile && savedProfile.gender === 'man') {
      setProfile(savedProfile);
      // Aquí se cargarían los datos de la pareja desde el backend
      // Por ahora, simulamos datos de la pareja
      const simulatedPartner = {
        name: 'Tu Pareja',
        cycleLength: 28,
        periodLength: 5,
        lastPeriodStart: '2026-07-20'
      };
      setPartnerData(simulatedPartner);
      
      // Calcular fase actual de la pareja
      const today = new Date();
      const lastPeriodStart = new Date(simulatedPartner.lastPeriodStart);
      const phase = getCyclePhase(
        today,
        lastPeriodStart,
        simulatedPartner.cycleLength,
        simulatedPartner.periodLength
      );
      setCurrentPhase(phase);
      
      // Calcular día del ciclo
      const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
      const currentCycleDay = ((daysSinceLastPeriod % simulatedPartner.cycleLength) + simulatedPartner.cycleLength) % simulatedPartner.cycleLength;
      setCycleDay(currentCycleDay + 1);
      
      // Calcular días hasta periodo
      const daysInCycle = simulatedPartner.cycleLength;
      const daysUntilPeriodCalc = daysInCycle - currentCycleDay;
      setDaysUntilPeriod(daysUntilPeriodCalc);
      
      // Calcular días hasta ovulación (cicloLength - 14)
      const ovulationDayIndex = simulatedPartner.cycleLength - 14;
      const daysUntilOvulationCalc = ovulationDayIndex - currentCycleDay;
      setDaysUntilOvulation(daysUntilOvulationCalc);
    } else {
      navigate('/welcome');
    }
  }, []);

  if (!profile || !partnerData) {
    return null;
  }

  const getPhaseColor = (phase) => {
    switch (phase) {
      case CYCLE_PHASES.MENSTRUATION:
        return 'bg-red-500';
      case CYCLE_PHASES.FOLLICULAR:
        return 'bg-green-500';
      case CYCLE_PHASES.OVULATION:
        return 'bg-purple-500';
      case CYCLE_PHASES.LUTEAL:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPhaseName = (phase) => {
    switch (phase) {
      case CYCLE_PHASES.MENSTRUATION:
        return 'Menstruación';
      case CYCLE_PHASES.FOLLICULAR:
        return 'Fase Folicular';
      case CYCLE_PHASES.OVULATION:
        return 'Ovulación';
      case CYCLE_PHASES.LUTEAL:
        return 'Fase Lútea';
      default:
        return 'Desconocido';
    }
  };

  // Calcular porcentajes para el círculo
  const cycleLength = partnerData.cycleLength;
  const periodLength = partnerData.periodLength;
  const ovulationDayIndex = cycleLength - 14;
  
  const menstruationPercent = (periodLength / cycleLength) * 100;
  const follicularPercent = ((ovulationDayIndex - periodLength) / cycleLength) * 100;
  const ovulationPercent = (1 / cycleLength) * 100;
  const lutealPercent = ((cycleLength - ovulationDayIndex - 1) / cycleLength) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-8 h-8 rounded-full mr-2 object-cover" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hola, {profile.name} 👋
              </h1>
              <p className="text-sm text-gray-600">
                Conectado con {partnerData.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <User className="text-gray-600" size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Círculo del ciclo de la pareja */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Ciclo de {partnerData.name}
          </h3>
          <div className="relative w-64 h-64 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Fondo del círculo */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              
              {/* Menstruación */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray={`${menstruationPercent * 2.83} 283`}
                strokeDashoffset="0"
                opacity="0.7"
              />
              
              {/* Fase Folicular */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={`${follicularPercent * 2.83} 283`}
                strokeDashoffset={`-${menstruationPercent * 2.83}`}
                opacity="0.7"
              />
              
              {/* Ovulación */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#a855f7"
                strokeWidth="8"
                strokeDasharray={`${ovulationPercent * 2.83} 283`}
                strokeDashoffset={`-${(menstruationPercent + follicularPercent) * 2.83}`}
                opacity="0.7"
              />
              
              {/* Fase Lútea */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#eab308"
                strokeWidth="8"
                strokeDasharray={`${lutealPercent * 2.83} 283`}
                strokeDashoffset={`-${(menstruationPercent + follicularPercent + ovulationPercent) * 2.83}`}
                opacity="0.7"
              />
            </svg>
            
            {/* Día actual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{cycleDay}</p>
                <p className="text-xs text-gray-600">Día {cycleDay} de {cycleLength}</p>
              </div>
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2 opacity-70"></div>
              <span className="text-gray-700">Menstruación</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 opacity-70"></div>
              <span className="text-gray-700">Folicular</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2 opacity-70"></div>
              <span className="text-gray-700">Ovulación</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 opacity-70"></div>
              <span className="text-gray-700">Lútea</span>
            </div>
          </div>
        </div>

        {/* Tarjeta principal - Fase actual */}
        <div className={`bg-gradient-to-r ${getPhaseColor(currentPhase)} rounded-3xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <Heart size={32} />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Hoy
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {getPhaseName(currentPhase)}
          </h2>
          <p className="text-white/80 mb-4">
            Día {cycleDay} del ciclo
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs text-white/80">Faltan para periodo</p>
              <p className="text-2xl font-bold">{daysUntilPeriod}d</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs text-white/80">Faltan para ovulación</p>
              <p className="text-2xl font-bold">{daysUntilOvulation}d</p>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/man-calendar')}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Calendar className="text-blue-500 mb-2" size={28} />
            <h3 className="font-semibold text-gray-900 text-sm">Calendario</h3>
            <p className="text-xs text-gray-600">Ver ciclo</p>
          </button>
          <button
            onClick={() => navigate('/man-symptoms')}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Activity className="text-pink-500 mb-2" size={28} />
            <h3 className="font-semibold text-gray-900 text-sm">Síntomas</h3>
            <p className="text-xs text-gray-600">Ver estado</p>
          </button>
          <button
            onClick={() => navigate('/man-tips')}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Lightbulb className="text-yellow-500 mb-2" size={28} />
            <h3 className="font-semibold text-gray-900 text-sm">Consejos</h3>
            <p className="text-xs text-gray-600">Cómo apoyar</p>
          </button>
        </div>

        {/* Información de apoyo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="text-pink-500 mr-2" size={20} />
            Cómo apoyar hoy
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <p className="text-sm text-gray-700">
                {currentPhase === CYCLE_PHASES.FOLLICULAR 
                  ? 'Tu pareja tiene más energía. Es buen momento para planes activos juntos.'
                  : currentPhase === CYCLE_PHASES.OVULATION
                  ? 'Tu pareja está en su pico de energía. Aprovechen para momentos especiales.'
                  : currentPhase === CYCLE_PHASES.LUTEAL
                  ? 'Tu energía puede estar más baja. Ofrece apoyo emocional y descanso.'
                  : 'Tu pareja puede necesitar más descanso. Sé paciente y comprensivo.'}
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <p className="text-sm text-gray-700">
                Pregúntale cómo se siente y qué necesita hoy
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 mt-1">•</span>
              <p className="text-sm text-gray-700">
                Ofrece masajes o tiempo de calidad según su energía
              </p>
            </div>
          </div>
        </div>

        {/* Botón de sincronización */}
        <button
          onClick={() => navigate('/partner')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
        >
          <RefreshCw className="text-indigo-500 mr-2" size={20} />
          <span className="font-semibold text-gray-900">Sincronizar datos</span>
        </button>
      </div>
    </div>
  );
};

export default ManHome;
