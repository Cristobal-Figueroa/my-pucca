import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import { saveProfile, getProfile, clearAllData } from '../utils/storage';
import Modal from '../components/Modal';

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleSave = () => {
    if (!profile.name) {
      setModalMessage('Por favor ingresa tu nombre');
      setShowModal(true);
      return;
    }

    if (!profile.lastPeriodStart) {
      setModalMessage('Por favor selecciona la fecha de inicio de tu último periodo');
      setShowModal(true);
      return;
    }

    saveProfile(profile);
    setModalMessage('¡Perfil guardado exitosamente!');
    setShowModal(true);
  };

  const handleDeleteData = () => {
    clearAllData();
    setProfile({
      name: '',
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: '',
    });
    setShowDeleteModal(false);
    setModalMessage('Todos los datos han sido eliminados');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Personaliza tu perfil</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Nombre */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu nombre
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Ingresa tu nombre"
          />
        </div>

        {/* Duración del ciclo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Clock className="text-pink-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Duración del ciclo</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Promedio de días entre el inicio de un periodo y el siguiente
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="21"
              max="35"
              value={profile.cycleLength}
              onChange={(e) => setProfile({ ...profile, cycleLength: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <span className="text-2xl font-bold text-pink-600 w-12 text-center">
              {profile.cycleLength}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">días</p>
        </div>

        {/* Duración del periodo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Calendar className="text-pink-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Duración del periodo</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Cuántos días dura tu menstruación
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="2"
              max="7"
              value={profile.periodLength}
              onChange={(e) => setProfile({ ...profile, periodLength: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <span className="text-2xl font-bold text-pink-600 w-12 text-center">
              {profile.periodLength}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">días</p>
        </div>

        {/* Fecha del último periodo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de inicio del último periodo
          </label>
          <input
            type="date"
            value={profile.lastPeriodStart}
            onChange={(e) => setProfile({ ...profile, lastPeriodStart: e.target.value })}
            onClick={(e) => e.target.showPicker?.()}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
          />
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
        >
          <Save size={20} />
          <span>Guardar Configuración</span>
        </button>

        {/* Botón eliminar datos */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-100 transition-all flex items-center justify-center space-x-2"
        >
          <Trash2 size={20} />
          <span>Eliminar todos los datos</span>
        </button>
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

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="¿Eliminar todos los datos?"
      >
        <p className="text-gray-700 text-center mb-4">
          Esta acción eliminará permanentemente todos tus datos y no se puede deshacer.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteData}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
