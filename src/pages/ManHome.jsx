import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Droplets, Lightbulb, User, RefreshCw, Activity } from 'lucide-react';
import { getProfile, getPartnerProfile } from '../utils/storage';
import { getCyclePhase, CYCLE_PHASES } from '../utils/cycleCalculations';
import { differenceInDays } from 'date-fns';
import Layout from '../components/Layout';

const ManHome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [cycleDay, setCycleDay] = useState(0);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(0);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      if (savedProfile && savedProfile.gender === 'man') {
        setProfile(savedProfile);
        
        // Cargar datos reales de la pareja usando el partnerCode
        if (savedProfile.partnerCode) {
          try {
            const partnerProfile = await getPartnerProfile(savedProfile.partnerCode);
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              
              // Calcular fase actual de la pareja
              const today = new Date();
              const phase = getCyclePhase(
                today,
                new Date(partnerProfile.last_period_start),
                partnerProfile.cycle_length,
                partnerProfile.period_length
              );
              setCurrentPhase(phase);
              
              // Calcular día del ciclo
              const daysSinceLastPeriod = differenceInDays(today, new Date(partnerProfile.last_period_start));
              const currentCycleDay = ((daysSinceLastPeriod % partnerProfile.cycle_length) + partnerProfile.cycle_length) % partnerProfile.cycle_length;
              setCycleDay(currentCycleDay + 1);
              
              // Calcular días hasta periodo
              const daysInCycle = partnerProfile.cycle_length;
              const daysUntilPeriodCalc = daysInCycle - currentCycleDay;
              setDaysUntilPeriod(daysUntilPeriodCalc);
              
              // Calcular días hasta ovulación (cicloLength - 14)
              const ovulationDayIndex = partnerProfile.cycle_length - 14;
              const daysUntilOvulationCalc = ovulationDayIndex - currentCycleDay;
              setDaysUntilOvulation(daysUntilOvulationCalc);
            } else {
              // Si no se encuentra la pareja, usar datos simulados
              setPartnerData({
                name: 'Tu Pareja',
                cycle_length: 28,
                period_length: 5,
                last_period_start: new Date().toISOString().split('T')[0]
              });
            }
          } catch (error) {
            console.error('Error loading partner profile:', error);
            // Usar datos simulados en caso de error
            setPartnerData({
              name: 'Tu Pareja',
              cycle_length: 28,
              period_length: 5,
              last_period_start: new Date().toISOString().split('T')[0]
            });
          }
        }
      } else if (savedProfile && savedProfile.gender !== 'man') {
        navigate('/home');
      } else {
        navigate('/');
      }
    };
    loadProfile();
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

  const cycleLength = partnerData.cycle_length;
  const periodLength = partnerData.period_length;
  const ovulationDayIndex = cycleLength - 14;
  
  const menstruationPercent = (periodLength / cycleLength) * 100;
  const follicularPercent = ((ovulationDayIndex - periodLength) / cycleLength) * 100;
  const ovulationPercent = (1 / cycleLength) * 100;
  const lutealPercent = ((cycleLength - ovulationDayIndex - 1) / cycleLength) * 100;

  return (
    <Layout title={`Hola, ${profile.name}`} showBackButton={false} showSettings={true}>
      <div className="space-y-6">
        {/* Círculo del ciclo de la pareja */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Fases del ciclo de {partnerData.name}</h3>
          <div className="relative w-80 h-80 mx-auto">
            {/* Círculo base con proporciones reales */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {(() => {
                const circumference = 2 * Math.PI * 38; // ~238.76
                const periodLength = partnerData.period_length; // días de menstruación
                const ovulationDay = partnerData.cycle_length - 14;
                
                // Calcular proporciones reales según duración correcta de fases
                const menstruationPercent = periodLength / partnerData.cycle_length;
                const ovulationPercent = 1 / partnerData.cycle_length; // 1 día de ovulación
                const lutealPercent = 14 / partnerData.cycle_length; // 14 días fase lútea (después de ovulación)
                const follicularPercent = 1 - menstruationPercent - ovulationPercent - lutealPercent;
                
                const menstruationLength = circumference * menstruationPercent;
                const follicularLength = circumference * follicularPercent;
                const ovulationLength = circumference * ovulationPercent;
                const lutealLength = circumference * lutealPercent;
                
                const menstruationOffset = 0;
                const follicularOffset = -menstruationLength;
                const ovulationOffset = -(menstruationLength + follicularLength);
                const lutealOffset = -(menstruationLength + follicularLength + ovulationLength);
                
                // Líneas divisorias internas (para separar)
                const innerRadius = 32; // borde interno del círculo de colores
                const outerRadius = 44; // borde externo del círculo de colores (líneas más cortas)
                const textRadius = 38; // radio para los números (entre líneas)
                
                // Calcular día actual usando differenceInDays (igual que getCyclePhase en cycleCalculations.js)
                const today = new Date();
                const lastPeriodStart = new Date(partnerData.last_period_start);
                const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
                const zeroIndexedDay = ((daysSinceLastPeriod % partnerData.cycle_length) + partnerData.cycle_length) % partnerData.cycle_length; // 0-indexed (0-27)
                const currentDay = zeroIndexedDay + 1; // 1-indexed (1-28)
                
                // Calcular el segmento del día actual
                const daySegmentLength = circumference / partnerData.cycle_length;
                const daySegmentOffset = -(zeroIndexedDay * daySegmentLength);
                
                // Color del día actual (rosa fijo)
                const currentDayColor = '#ec4899';
                
                return (
                  <>
                    {/* Círculos de colores (base) con transparencia */}
                    {/* Menstruación */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeDasharray={`${menstruationLength} ${circumference}`}
                      strokeDashoffset={menstruationOffset}
                      opacity="0.7"
                    />
                    {/* Folicular */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="14"
                      strokeDasharray={`${follicularLength} ${circumference}`}
                      strokeDashoffset={follicularOffset}
                      opacity="0.7"
                    />
                    {/* Ovulación */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="14"
                      strokeDasharray={`${ovulationLength} ${circumference}`}
                      strokeDashoffset={ovulationOffset}
                      opacity="0.7"
                    />
                    {/* Lútea */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="14"
                      strokeDasharray={`${lutealLength} ${circumference}`}
                      strokeDashoffset={lutealOffset}
                      opacity="0.7"
                    />
                    
                    {/* Segmento del día actual (pintado completo) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke={currentDayColor}
                      strokeWidth="16"
                      strokeDasharray={`${daySegmentLength} ${circumference}`}
                      strokeDashoffset={daySegmentOffset}
                    />
                    
                    {/* Líneas divisorias para cada día (ligeras y grises) */}
                    {Array.from({ length: partnerData.cycle_length }).map((_, dayIndex) => {
                      const angle = (dayIndex / partnerData.cycle_length) * 360;
                      const radians = angle * (Math.PI / 180);
                      const x1 = 50 + innerRadius * Math.cos(radians);
                      const y1 = 50 + innerRadius * Math.sin(radians);
                      const x2 = 50 + outerRadius * Math.cos(radians);
                      const y2 = 50 + outerRadius * Math.sin(radians);
                      
                      // Posición del número (entre líneas)
                      const midAngle = ((dayIndex + 0.5) / partnerData.cycle_length) * 360;
                      const midRadians = midAngle * (Math.PI / 180);
                      const textX = 50 + textRadius * Math.cos(midRadians);
                      const textY = 50 + textRadius * Math.sin(midRadians);
                      
                      // Determinar si es el día actual (dayIndex es 0-indexed, zeroIndexedDay es 0-indexed)
                      const isCurrentDay = dayIndex === zeroIndexedDay;
                      
                      // Color del número según fase (ovulación es 1 solo día: cycleLength - 14)
                      const ovulationDayIndex = partnerData.cycle_length - 14;
                      let numberColor = '#ffffff';
                      if (dayIndex < periodLength) {
                        numberColor = '#fff1f2';
                      } else if (dayIndex < ovulationDayIndex) {
                        numberColor = '#f0fdf4';
                      } else if (dayIndex === ovulationDayIndex) {
                        numberColor = '#faf5ff';
                      } else {
                        numberColor = '#fefce8';
                      }
                      
                      return (
                        <g key={dayIndex}>
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#ffffff"
                            strokeWidth="0.5"
                            opacity="0.5"
                          />
                          {/* Número del día (entre líneas) */}
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="5"
                            fontWeight={isCurrentDay ? "bold" : "normal"}
                            fill={isCurrentDay ? "#ffffff" : numberColor}
                            transform={`rotate(${midAngle} ${textX} ${textY})`}
                          >
                            {dayIndex + 1}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
            
            {/* Centro con fase actual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-1">
                  {currentPhase === 'menstruation' ? '🩸' : 
                   currentPhase === 'follicular' ? '🌱' : 
                   currentPhase === 'ovulation' ? '🥚' : '🌙'}
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  {currentPhase === 'menstruation' ? 'Menstruación' : 
                   currentPhase === 'follicular' ? 'Folicular' : 
                   currentPhase === 'ovulation' ? 'Ovulación' : 'Lútea'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Día {(() => {
                    const today = new Date();
                    const lastPeriodStart = new Date(partnerData.last_period_start);
                    const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
                    const zeroIndexed = ((daysSinceLastPeriod % partnerData.cycle_length) + partnerData.cycle_length) % partnerData.cycle_length;
                    return zeroIndexed + 1;
                  })()} de {partnerData.cycle_length}
                </p>
              </div>
            </div>
          </div>

          {/* Leyenda con días */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Menstruación {partnerData.period_length}d</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Folicular {partnerData.cycle_length - partnerData.period_length - 14}d</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Ovulación 1d</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Lútea 14d</span>
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
    </Layout>
  );
};

export default ManHome;
