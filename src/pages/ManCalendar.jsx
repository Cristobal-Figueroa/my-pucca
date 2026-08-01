import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { getProfile, getPartnerProfile, parseLocalDate } from '../utils/storage';
import { generateCalendarData, CYCLE_PHASES } from '../utils/cycleCalculations';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../components/Layout';

const ManCalendar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const savedProfile = await getProfile();
        if (savedProfile && savedProfile.gender === 'man') {
          setProfile(savedProfile);
          
          if (savedProfile.partnerCode) {
            const partnerProfile = await getPartnerProfile(savedProfile.partnerCode);
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              generateCalendar(partnerProfile, currentDate);
            } else {
              setError('No se encontró el perfil de tu pareja. Verifica el código.');
              setPartnerData(null);
            }
          } else {
            setError('No tienes un código de pareja configurado.');
          }
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar los datos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [currentDate]);

  const generateCalendar = (partnerProfile, date) => {
    const data = generateCalendarData(
      date.getFullYear(),
      date.getMonth(),
      parseLocalDate(partnerProfile.last_period_start),
      partnerProfile.cycle_length,
      partnerProfile.period_length
    );
    setCalendarData(data);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getDayColor = (dayData) => {
    if (dayData.specialDay === 'ovulation') {
      return 'bg-purple-500 text-white';
    }
    if (dayData.specialDay === 'fertile') {
      return 'bg-purple-200 text-purple-900';
    }
    if (dayData.specialDay === 'predicted_period') {
      return 'bg-red-200 text-red-900';
    }
    if (dayData.phase === CYCLE_PHASES.MENSTRUATION) {
      return 'bg-red-100 text-red-900';
    }
    if (dayData.phase === CYCLE_PHASES.FOLLICULAR) {
      return 'bg-green-100 text-green-900';
    }
    if (dayData.phase === CYCLE_PHASES.LUTEAL) {
      return 'bg-yellow-100 text-yellow-900';
    }
    return 'bg-gray-50 text-gray-900';
  };

  const getDayLabel = (dayData) => {
    if (dayData.specialDay === 'ovulation') return '🥚';
    if (dayData.specialDay === 'fertile') return '💧';
    if (dayData.specialDay === 'predicted_period') return '🩸';
    if (dayData.phase === CYCLE_PHASES.MENSTRUATION) return '🩸';
    return '';
  };

  if (loading) {
    return (
      <Layout title="Cargando..." showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando calendario...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile || !partnerData) {
    return (
      <Layout title="Error" showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p className="text-gray-600">No se pudieron cargar los datos.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = firstDayOfMonth.getDay();

  return (
    <Layout title={format(currentDate, 'MMMM yyyy', { locale: es })} showBackButton={true} showSettings={false}>
      <div className="space-y-6">
        {/* Navegación de meses */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <p className="text-sm text-gray-600">
              Ciclo de {partnerData.name}
            </p>
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1">
            {/* Espacios vacíos antes del primer día */}
            {Array.from({ length: startDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-12"></div>
            ))}

            {/* Días del calendario */}
            {calendarData.map((dayData) => (
              <div
                key={dayData.day}
                className={`
                  h-12 rounded-lg flex flex-col items-center justify-center relative
                  ${getDayColor(dayData)}
                  ${dayData.isToday ? 'ring-2 ring-pink-500 ring-offset-2' : ''}
                `}
              >
                <span className="text-sm font-medium">{dayData.day}</span>
                <span className="text-xs">{getDayLabel(dayData)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Leyenda</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
              <span>Menstruación</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
              <span>Fase folicular</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
              <span>Ovulación</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-200 rounded mr-2"></div>
              <span>Ventana fértil</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
              <span>Fase lútea</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
              <span>Periodo previsto</span>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="bg-pink-50 rounded-2xl p-4">
          <div className="flex items-center justify-center">
            <Heart className="mr-2 text-pink-500" size={18} />
            <p className="text-sm text-pink-900 text-center">
              Calendario de {partnerData.name} (solo lectura)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManCalendar;
