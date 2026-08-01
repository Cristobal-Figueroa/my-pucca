import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveProfile } from '../utils/storage';
import Modal from '../components/Modal';

const RegisterWoman = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setModalMessage('Por favor ingresa tu nombre');
      setShowModal(true);
      return;
    }

    if (!lastPeriodStart) {
      setModalMessage('Por favor selecciona la fecha de inicio de tu último periodo');
      setShowModal(true);
      return;
    }

    const profile = {
      user_id: 'user_' + Date.now(),
      name: name.trim(),
      cycleLength,
      periodLength,
      lastPeriodStart,
      gender: 'woman'
    };

    const saved = await saveProfile(profile);
    if (saved) {
      navigate('/home');
    } else {
      setModalMessage('Error al guardar el perfil. Intenta nuevamente.');
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm">Volver</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full mb-4 shadow-lg">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola! 👋
          </h1>
          <p className="text-gray-600">
            Cuéntanos un poco sobre ti
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu nombre
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Duración del ciclo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración de tu ciclo (días)
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={cycleLength}
                onChange={(e) => {
                  const value = e.target.value;
                  setCycleLength(value === '' ? '' : parseInt(value));
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value) < 21) {
                    setCycleLength(28);
                  } else if (parseInt(e.target.value) > 35) {
                    setCycleLength(35);
                  }
                }}
                min="21"
                max="35"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Promedio: 28 días (rango normal: 21-35 días)
            </p>
          </div>

          {/* Duración del periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración de tu periodo (días)
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={periodLength}
                onChange={(e) => {
                  const value = e.target.value;
                  setPeriodLength(value === '' ? '' : parseInt(value));
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value) < 2) {
                    setPeriodLength(5);
                  } else if (parseInt(e.target.value) > 7) {
                    setPeriodLength(7);
                  }
                }}
                min="2"
                max="7"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Promedio: 5 días (rango normal: 2-7 días)
            </p>
          </div>

          {/* Fecha de último periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de inicio de tu último periodo
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={lastPeriodStart}
                onChange={(e) => setLastPeriodStart(e.target.value)}
                onClick={(e) => e.target.showPicker?.()}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Botón de continuar */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            Comenzar
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>

        {/* Información */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 Podrás cambiar esta información después en Configuración
          </p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Atención"
      >
        <p className="text-gray-700">{modalMessage}</p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Entendido
        </button>
      </Modal>
    </div>
  );
};

export default RegisterWoman;
