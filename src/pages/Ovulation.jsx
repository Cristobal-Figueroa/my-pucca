import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Droplets, Egg, Calendar, Info } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { 
  calculateOvulationDate, 
  calculateFertileWindow,
  getDaysUntilOvulation,
  getDaysUntilNextPeriod
} from '../utils/cycleCalculations';
import { format, addDays, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const Ovulation = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [fertileWindow, setFertileWindow] = useState(null);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState(0);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState(0);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      
      const lastPeriodStart = new Date(savedProfile.lastPeriodStart);
      const ovDate = calculateOvulationDate(lastPeriodStart, savedProfile.cycleLength);
      const fertileW = calculateFertileWindow(ovDate);
      
      setOvulationDate(ovDate);
      setFertileWindow(fertileW);
      setDaysUntilOvulation(getDaysUntilOvulation(lastPeriodStart, savedProfile.cycleLength));
      setDaysUntilPeriod(getDaysUntilNextPeriod(lastPeriodStart, savedProfile.cycleLength));
    } else {
      navigate('/settings');
    }
  }, []);

  if (!profile || !ovulationDate || !fertileWindow) {
    return null;
  }

  const isFertileToday = daysUntilOvulation >= -1 && daysUntilOvulation <= 5;
  const isOvulationToday = daysUntilOvulation === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <Home size={20} className="mr-2" />
            Inicio
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Ovulación y Fertilidad</h1>
          <p className="text-gray-600 mt-1">Tu ventana fértil</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Estado actual */}
        <div className={`rounded-2xl p-6 shadow-lg ${
          isOvulationToday 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
            : isFertileToday 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
              : 'bg-white text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {isOvulationToday ? (
                <Egg size={40} className="mr-3" />
              ) : isFertileToday ? (
                <Droplets size={40} className="mr-3" />
              ) : (
                <Calendar size={40} className="mr-3 text-purple-500" />
              )}
              <div>
                <p className="text-sm opacity-90">Estado actual</p>
                <p className="text-xl font-bold">
                  {isOvulationToday 
                    ? '¡Día de ovulación!' 
                    : isFertileToday 
                      ? 'Ventana fértil' 
                      : 'Fuera de ventana fértil'}
                </p>
              </div>
            </div>
          </div>
          {isFertileToday && (
            <p className="text-sm opacity-90">
              {isOvulationToday 
                ? 'Hoy es tu día más fértil del ciclo' 
                : 'Estás en tus días más fértiles'}
            </p>
          )}
        </div>

        {/* Fecha de ovulación */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Egg className="text-purple-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Fecha de ovulación</h3>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-purple-600 text-center">
              {format(ovulationDate, 'dd/MM/yyyy', { locale: es })}
            </p>
            <p className="text-sm text-purple-700 text-center mt-2">
              {daysUntilOvulation > 0 
                ? `Faltan ${daysUntilOvulation} días` 
                : daysUntilOvulation === 0 
                  ? '¡Es hoy!' 
                  : `Hace ${Math.abs(daysUntilOvulation)} días`}
            </p>
          </div>
        </div>

        {/* Ventana fértil */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Droplets className="text-pink-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Ventana fértil</h3>
          </div>
          <div className="bg-pink-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-center">
                <p className="text-xs text-pink-700 mb-1">Inicio</p>
                <p className="text-lg font-bold text-pink-600">
                  {format(fertileWindow.start, 'dd/MM', { locale: es })}
                </p>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-pink-300 mx-4"></div>
              <div className="text-center">
                <p className="text-xs text-pink-700 mb-1">Fin</p>
                <p className="text-lg font-bold text-pink-600">
                  {format(fertileWindow.end, 'dd/MM', { locale: es })}
                </p>
              </div>
            </div>
            <p className="text-sm text-pink-700 text-center mt-3">
              {differenceInDays(fertileWindow.end, fertileWindow.start) + 1} días de ventana fértil
            </p>
          </div>
        </div>

        {/* Próximo periodo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Próximo periodo</h3>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-red-600 text-center">
              {daysUntilPeriod > 0 ? daysUntilPeriod : '¡Hoy!'}
            </p>
            <p className="text-sm text-red-700 text-center mt-2">
              {daysUntilPeriod > 0 ? 'días restantes' : 'día del periodo'}
            </p>
          </div>
        </div>

        {/* Información sobre fertilidad */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
          <div className="flex items-start">
            <Info className="text-purple-600 mr-3 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Sobre la ventana fértil</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• La ventana fértil son los 6 días alrededor de la ovulación</li>
                <li>• El óvulo vive 12-24 horas después de la ovulación</li>
                <li>• Los espermatozoides pueden vivir hasta 5 días</li>
                <li>• Es el mejor momento para concebir si lo deseas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips de fertilidad */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips para tu fertilidad</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🥗</span>
              <div>
                <p className="font-medium text-gray-900">Alimentación balanceada</p>
                <p className="text-sm text-gray-600">Consume alimentos ricos en ácido fólico y antioxidantes</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">💧</span>
              <div>
                <p className="font-medium text-gray-900">Hidratación</p>
                <p className="text-sm text-gray-600">Bebe suficiente agua para mantener tu cuerpo saludable</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">🧘‍♀️</span>
              <div>
                <p className="font-medium text-gray-900">Manejo del estrés</p>
                <p className="text-sm text-gray-600">El estrés puede afectar tu ciclo menstrual</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-3">😴</span>
              <div>
                <p className="font-medium text-gray-900">Buen descanso</p>
                <p className="text-sm text-gray-600">Dormir bien es fundamental para tu salud reproductiva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ovulation;
