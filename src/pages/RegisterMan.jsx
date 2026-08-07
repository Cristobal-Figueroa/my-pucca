import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveProfile } from '../utils/storage';
import Modal from '../components/Modal';

const RegisterMan = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setModalMessage('Por favor ingresa tu nombre');
      setShowModal(true);
      return;
    }

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

    if (password.length < 6) {
      setModalMessage('La contraseña debe tener al menos 6 caracteres');
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage('Las contraseñas no coinciden');
      setShowModal(true);
      return;
    }

    // Guardar datos temporales para el siguiente paso
    localStorage.setItem('temp_register_data', JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
      gender: 'man'
    }));

    navigate('/register-man-details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full mb-4 shadow-lg">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola! 👋
          </h1>
          <p className="text-gray-600">
            Conecta con tu pareja
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botón de continuar */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            Continuar
            <ArrowRight className="ml-2" size={20} />
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

export default RegisterMan;
