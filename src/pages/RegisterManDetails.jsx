import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, CheckCircle, XCircle } from 'lucide-react';
import { getPartnerProfile, apiRequest, setUserId } from '../utils/storage';
import { API_ENDPOINTS } from '../config/api';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

const RegisterManDetails = () => {
  const navigate = useNavigate();
  const [partnerCode, setPartnerCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('temp_register_data');
    if (!data) {
      navigate('/register-man');
      return;
    }
    setTempData(JSON.parse(data));
  }, [navigate]);

  const handleSubmit = async (skipCode = false) => {
    if (!skipCode && !partnerCode.trim()) {
      setModalMessage('Por favor ingresa el código de tu pareja');
      setShowModal(true);
      return;
    }

    if (!tempData) {
      setModalMessage('Error al cargar los datos. Por favor regístrate nuevamente.');
      setShowModal(true);
      return;
    }

    setIsValidating(true);
    
    // Si no salta el código, validar contra el backend
    if (!skipCode) {
      const partnerProfile = await getPartnerProfile(partnerCode.toUpperCase());
      
      if (!partnerProfile) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }
      setIsValid(true);
    }
    
    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          name: tempData.name,
          email: tempData.email,
          password: tempData.password,
          gender: 'man',
          partnerCode: skipCode ? null : partnerCode.toUpperCase()
        })
      });

      if (response.success) {
        // Guardar solo user_id para sesión
        setUserId(response.user_id);
        
        // Limpiar datos temporales
        localStorage.removeItem('temp_register_data');
        localStorage.removeItem('selected_gender');
        setTimeout(() => {
          navigate('/man-home');
        }, 1000);
      } else {
        setModalMessage(response.message || 'Error al registrar. Intenta nuevamente.');
        setShowModal(true);
        setIsValid(false);
        setIsValidating(false);
      }
    } catch (error) {
      setModalMessage('Error de conexión. Intenta nuevamente.');
      setShowModal(true);
      setIsValid(false);
      setIsValidating(false);
    }
  };

  const handleRefresh = () => {
    setPartnerCode('');
    setIsValid(null);
  };

  if (!tempData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full mb-4 shadow-lg">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {tempData.name}! 👋
          </h1>
          <p className="text-gray-600">
            Conecta con tu pareja
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
          {/* Código de pareja */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de tu pareja
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={partnerCode}
                onChange={(e) => {
                  setPartnerCode(e.target.value.toUpperCase());
                  setIsValid(null);
                }}
                placeholder="XXXXXX"
                maxLength={6}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-2xl tracking-wider"
              />
              <button
                onClick={handleRefresh}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pide a tu pareja que te comparta su código desde la sección Pareja
            </p>
          </div>

          {/* Estado de validación */}
          {isValid !== null && (
            <div className={`p-4 rounded-xl ${
              isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${
                isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {isValid ? '✓ Código válido. Conectando...' : '✗ Código inválido. Verifica con tu pareja.'}
              </p>
            </div>
          )}

          {/* Botón de continuar */}
          <button
            onClick={handleSubmit}
            disabled={isValidating}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isValidating ? (
              <>
                <RefreshCw className="mr-2 animate-spin" size={20} />
                Validando...
              </>
            ) : (
              <>
                Conectar
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>

          {/* Opción de continuar sin código */}
          <button
            onClick={() => handleSubmit(true)}
            className="w-full text-gray-600 py-3 rounded-xl font-medium hover:text-gray-800 transition-all"
          >
            Continuar sin código de pareja
          </button>
        </div>

        {/* Información */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 Tu pareja puede encontrar su código en la sección Pareja de la app
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
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Entendido
        </button>
      </Modal>
    </div>
  );
};

export default RegisterManDetails;
