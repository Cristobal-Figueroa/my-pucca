import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, setUserId } from '../utils/storage';
import { API_ENDPOINTS } from '../config/api';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

const RegisterWomanDetails = () => {
  const navigate = useNavigate();
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('temp_register_data');
    if (!data) {
      navigate('/register-woman');
      return;
    }
    setTempData(JSON.parse(data));
  }, [navigate]);

  const handleSubmit = async () => {
    if (!lastPeriodStart) {
      setModalMessage('Por favor selecciona la fecha de inicio de tu último periodo');
      setShowModal(true);
      return;
    }

    if (!tempData) {
      setModalMessage('Error al cargar los datos. Por favor regístrate nuevamente.');
      setShowModal(true);
      return;
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          name: tempData.name,
          email: tempData.email,
          password: tempData.password,
          cycleLength,
          periodLength,
          lastPeriodStart,
          gender: 'woman'
        })
      });

      if (response.success) {
        // Guardar solo user_id para sesión
        setUserId(response.user_id);
        
        // Limpiar datos temporales
        localStorage.removeItem('temp_register_data');
        localStorage.removeItem('selected_gender');
        navigate('/home');
      } else {
        setModalMessage(response.message || 'Error al registrar. Intenta nuevamente.');
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage('Error de conexión. Intenta nuevamente.');
      setShowModal(true);
    }
  };

  if (!tempData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
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
            ¡Hola, {tempData.name}! 👋
          </h1>
          <p className="text-gray-600">
            Cuéntanos sobre tu ciclo
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
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

export default RegisterWomanDetails;
