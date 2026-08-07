import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveProfile, apiRequest, clearAllData } from '../utils/storage';
import { API_ENDPOINTS } from '../config/api';
import Modal from '../components/Modal';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setModalMessage('Por favor ingresa tu correo electrónico');
      setShowModal(true);
      return;
    }

    if (!email.includes('@')) {
      setModalMessage('Por favor ingresa un correo válido');
      setShowModal(true);
      return;
    }

    if (!password) {
      setModalMessage('Por favor ingresa tu contraseña');
      setShowModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      if (response.success && response.user) {
        // Limpiar datos anteriores antes de guardar nuevo perfil
        clearAllData();

        // Guardar perfil localmente
        const profile = {
          user_id: response.user.user_id,
          name: response.user.name,
          email: response.user.email,
          cycleLength: response.user.cycle_length,
          periodLength: response.user.period_length,
          lastPeriodStart: response.user.last_period_start,
          gender: response.user.gender,
          partnerCode: response.user.gender === 'woman' ? response.user.partner_code : null,
          connectedPartnerCode: response.user.connected_partner_code
        };

        await saveProfile(profile);

        // Redirigir según el género
        if (response.user.gender === 'man') {
          navigate('/man-home');
        } else {
          navigate('/home');
        }
      } else {
        // Mensajes específicos según el error
        if (response.message && response.message.includes('No se encontró')) {
          setModalMessage('No existe una cuenta con ese correo. Por favor regístrate primero.');
        } else if (response.message && response.message.includes('Contraseña incorrecta')) {
          setModalMessage('Contraseña incorrecta. Por favor intenta nuevamente.');
        } else {
          setModalMessage(response.message || 'Error al iniciar sesión');
        }
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage('Error de conexión. Intenta nuevamente.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
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
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mb-4 shadow-lg">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de nuevo! 👋
          </h1>
          <p className="text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
          {/* Correo electrónico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botón de continuar */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="mr-2 animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </div>

        {/* Información */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta? <span onClick={() => navigate('/auth-choice')} className="text-purple-600 font-semibold cursor-pointer hover:underline">Regístrate</span>
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
          className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Entendido
        </button>
      </Modal>
    </div>
  );
};

export default Login;
