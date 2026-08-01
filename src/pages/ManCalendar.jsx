import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Heart } from 'lucide-react';
import { getProfile, getPartnerProfile } from '../utils/storage';
import { getCyclePhase, CYCLE_PHASES } from '../utils/cycleCalculations';
import { differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../components/Layout';

const ManCalendar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

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
              generateCalendar(partnerProfile, currentDate);
            } else {
              // Usar datos simulados si no se encuentra
              const simulatedPartner = {
                name: 'Tu Pareja',
                cycle_length: 28,
                period_length: 5,
                last_period_start: new Date().toISOString().split('T')[0]
              };
              setPartnerData(simulatedPartner);
              generateCalendar(simulatedPartner, currentDate);
            }
          } catch (error) {
            console.error('Error loading partner profile:', error);
            // Usar datos simulados en caso de error
            const simulatedPartner = {
              name: 'Tu Pareja',
              cycle_length: 28,
              period_length: 5,
              last_period_start: new Date().toISOString().split('T')[0]
            };
            setPartnerData(simulatedPartner);
            generateCalendar(simulatedPartner, currentDate);
          }
        }
      } else {
        navigate('/');
      }
    };
    loadProfile();
  }, [currentDate]);

  const generateCalendar = (partner, date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const calendarDaysWithPhases = days.map(day => {
      const phase = getCyclePhase(
        day,
        new Date(partner.last_period_start),
        partner.cycle_length,
        partner.period_length
      );
      
      const daysSinceLastPeriod = differenceInDays(day, new Date(partner.last_period_start));
      const cycleDay = ((daysSinceLastPeriod % partner.cycle_length) + partner.cycle_length) % partner.cycle_length;
      
      return {
        date: day,
        phase,
        cycleDay: cycleDay + 1,
        isToday: isSameDay(day, new Date())
      };
    });
    
    setCalendarDays(calendarDaysWithPhases);
  };

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
        return 'bg-gray-200';
    }
  };

  const getPhaseName = (phase) => {
    switch (phase) {
      case CYCLE_PHASES.MENSTRUATION:
        return 'Menstruación';
      case CYCLE_PHASES.FOLLICULAR:
        return 'Folicular';
      case CYCLE_PHASES.OVULATION:
        return 'Ovulación';
      case CYCLE_PHASES.LUTEAL:
        return 'Lútea';
      default:
        return '';
    }
  };

  if (!profile || !partnerData) {
    return null;
  }

  const monthName = format(currentDate, 'MMMM yyyy', { locale: es });

  return (
    <Layout title="Calendario" showBackButton={true} showSettings={false}>
      <div className="space-y-4">
        {/* Header del calendario */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {monthName}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} className="transform rotate-180" />
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Ciclo de {partnerData.name}
          </p>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer
                  ${getPhaseColor(day.phase)} ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                  hover:opacity-80 transition-opacity
                `}
              >
                <span className="text-sm font-medium text-white">
                  {format(day.date, 'd')}
                </span>
                <span className="text-xs text-white/80">
                  {day.cycleDay}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CalendarIcon className="mr-2" size={18} />
            Leyenda
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-700">Menstruación</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-700">Folicular</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-purple-500 mr-2"></div>
              <span className="text-sm text-gray-700">Ovulación</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-700">Lútea</span>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Heart className="mr-2 text-pink-500" size={18} />
            Información
          </h3>
          <p className="text-sm text-gray-600">
            Este calendario muestra el ciclo menstrual de {partnerData.name}. 
            Los colores indican la fase del ciclo en cada día.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ManCalendar;
