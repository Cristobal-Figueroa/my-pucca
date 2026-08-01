import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Droplets, Heart, Plus } from 'lucide-react';
import { getProfile, parseLocalDate } from '../utils/storage';
import { 
  getCyclePhase, 
  getPhaseInfo, 
  getDaysUntilNextPeriod,
  getDaysUntilOvulation,
  calculateNextPeriod,
  calculateOvulationDate
} from '../utils/cycleCalculations';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../components/Layout';

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(0);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      if (savedProfile) {
        if (savedProfile.gender === 'man') {
          navigate('/man-home');
          return;
        }
        setProfile(savedProfile);
        
        const today = new Date();
        const lastPeriodStart = parseLocalDate(savedProfile.lastPeriodStart);
        
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
    };
    loadProfile();
  }, []);

  const phaseInfo = currentPhase ? getPhaseInfo(currentPhase) : null;

  if (!profile) {
    return (
      <Layout showSettings={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Círculo de fases del ciclo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Fases del ciclo</h3>
          <div className="relative w-80 h-80 mx-auto">
            {/* Círculo base con proporciones reales */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {(() => {
                const circumference = 2 * Math.PI * 38; // ~238.76
                const periodLength = profile.periodLength; // días de menstruación
                const ovulationDay = profile.cycleLength - 14;
                const fertileStart = ovulationDay - 5;
                const fertileEnd = ovulationDay + 1;
                
                // Calcular proporciones reales según duración correcta de fases
                const menstruationPercent = periodLength / profile.cycleLength;
                const ovulationPercent = 1 / profile.cycleLength; // 1 día de ovulación
                const lutealPercent = 14 / profile.cycleLength; // 14 días fase lútea (después de ovulación)
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
                const lastPeriodStart = new Date(profile.lastPeriodStart);
                const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
                const zeroIndexedDay = ((daysSinceLastPeriod % profile.cycleLength) + profile.cycleLength) % profile.cycleLength; // 0-indexed (0-27)
                const currentDay = zeroIndexedDay + 1; // 1-indexed (1-28)
                
                // Calcular el segmento del día actual
                const daySegmentLength = circumference / profile.cycleLength;
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
                    {Array.from({ length: profile.cycleLength }).map((_, dayIndex) => {
                      // Nota: el <svg> padre ya tiene "-rotate-90", por lo que aquí
                      // NO restamos 90° extra (eso causaba un desfase de ~7 días
                      // entre los números/líneas y los arcos de color).
                      const angle = (dayIndex / profile.cycleLength) * 360;
                      const radians = angle * (Math.PI / 180);
                      const x1 = 50 + innerRadius * Math.cos(radians);
                      const y1 = 50 + innerRadius * Math.sin(radians);
                      const x2 = 50 + outerRadius * Math.cos(radians);
                      const y2 = 50 + outerRadius * Math.sin(radians);
                      
                      // Posición del número (entre líneas)
                      const midAngle = ((dayIndex + 0.5) / profile.cycleLength) * 360;
                      const midRadians = midAngle * (Math.PI / 180);
                      const textX = 50 + textRadius * Math.cos(midRadians);
                      const textY = 50 + textRadius * Math.sin(midRadians);
                      
                      // Determinar si es el día actual (dayIndex es 0-indexed, zeroIndexedDay es 0-indexed)
                      const isCurrentDay = dayIndex === zeroIndexedDay;
                      
                      // Color del número según fase (ovulación es 1 solo día: cycleLength - 14)
                      const ovulationDayIndex = profile.cycleLength - 14;
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
                            stroke="#e5e7eb"
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
                    const lastPeriodStart = new Date(profile.lastPeriodStart);
                    const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
                    const zeroIndexed = ((daysSinceLastPeriod % profile.cycleLength) + profile.cycleLength) % profile.cycleLength;
                    return zeroIndexed + 1;
                  })()} de {profile.cycleLength}
                </p>
              </div>
            </div>
          </div>

          {/* Leyenda con días */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Menstruación {profile.periodLength}d</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Folicular {profile.cycleLength - profile.periodLength - 14}d</span>
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
      </div>
    </Layout>
  );
};

export default Home;
