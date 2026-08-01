import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProfile, addPeriod, getPeriods, saveProfile } from '../utils/storage';
import { generateCalendarData, CYCLE_PHASES } from '../utils/cycleCalculations';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

const Calendar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      generateCalendar(savedProfile, currentDate);
    } else {
      navigate('/settings');
    }
  }, [currentDate]);

  const generateCalendar = (profileData, date) => {
    const data = generateCalendarData(
      date.getFullYear(),
      date.getMonth(),
      new Date(profileData.lastPeriodStart),
      profileData.cycleLength,
      profileData.periodLength
    );
    setCalendarData(data);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (dayData) => {
    setSelectedDate(dayData);
    setShowAddPeriodModal(true);
  };

  const handleAddPeriod = () => {
    if (selectedDate) {
      const newPeriod = {
        id: Date.now().toString(),
        date: selectedDate.date.toISOString().split('T')[0],
        notes: ''
      };
      
      addPeriod(newPeriod);
      
      // Actualizar el perfil con la nueva fecha de inicio
      const updatedProfile = {
        ...profile,
        lastPeriodStart: newPeriod.date
      };
      setProfile(updatedProfile);
      saveProfile(updatedProfile); // Guardar en storage para que actualice toda la app
      
      // Regenerar calendario
      generateCalendar(updatedProfile, currentDate);
      
      setShowAddPeriodModal(false);
      setModalMessage('Periodo registrado exitosamente');
      setShowModal(true);
      
      // Navegar a Home para forzar recarga de toda la app con el nuevo perfil
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
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

  if (!profile) {
    return null;
  }

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = firstDayOfMonth.getDay();

  return (
    <Layout title={format(currentDate, 'MMMM yyyy', { locale: es })} showBackButton={false}>
      <div className="space-y-6">
        {/* Navegación de meses */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>
        {/* Leyenda */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
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
              <button
                key={dayData.day}
                onClick={() => handleDayClick(dayData)}
                className={`
                  h-12 rounded-lg flex flex-col items-center justify-center relative
                  ${getDayColor(dayData)}
                  ${dayData.isToday ? 'ring-2 ring-pink-500 ring-offset-2' : ''}
                  hover:opacity-80 transition-opacity
                `}
              >
                <span className="text-sm font-medium">{dayData.day}</span>
                <span className="text-xs">{getDayLabel(dayData)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-pink-50 rounded-2xl p-4">
          <p className="text-sm text-pink-900 text-center">
            💡 Toca cualquier día para registrar tu periodo
          </p>
        </div>
      </div>

      {/* Modal de notificación */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Notificación"
      >
        <p className="text-gray-700 text-center">{modalMessage}</p>
        <button
          onClick={() => setShowModal(false)}
          className="w-full mt-4 bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
        >
          Aceptar
        </button>
      </Modal>

      {/* Modal para agregar periodo */}
      <Modal
        isOpen={showAddPeriodModal}
        onClose={() => setShowAddPeriodModal(false)}
        title="Registrar periodo"
      >
        {selectedDate && (
          <>
            <p className="text-gray-700 text-center mb-4">
              ¿Quieres registrar que tu periodo empezó el{' '}
              <strong>{format(selectedDate.date, 'dd/MM/yyyy', { locale: es })}</strong>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddPeriodModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPeriod}
                className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default Calendar;
