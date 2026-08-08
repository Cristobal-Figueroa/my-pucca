import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Calendar, Clock, Trash2, LogOut, Key, CheckCircle, Users } from 'lucide-react';
import { saveProfile, getProfile, clearAllData, getPartnerProfile, syncPartner } from '../utils/storage';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: '',
    gender: 'woman',
    partnerCode: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [partnerCode, setPartnerCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
        
        // Si es hombre, cargar el código de pareja ya guardado (connectedPartnerCode)
        if (savedProfile.gender === 'man' && savedProfile.connectedPartnerCode) {
          setPartnerCode(savedProfile.connectedPartnerCode);
          // Intentar cargar el nombre de la pareja
          try {
            const partnerProfile = await getPartnerProfile(savedProfile.connectedPartnerCode);
            if (partnerProfile) {
              setPartnerName(partnerProfile.name);
              setIsValid(true);
            } else {
              // Si no se encuentra el perfil, marcar como no válido
              setIsValid(false);
            }
          } catch (err) {
            console.error('Error loading partner profile:', err);
            setIsValid(false);
          }
        }
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile.name) {
      setModalMessage('Por favor ingresa tu nombre');
      setShowModal(true);
      return;
    }

    if (!profile.lastPeriodStart && profile.gender !== 'man') {
      setModalMessage('Por favor selecciona la fecha de inicio de tu último periodo');
      setShowModal(true);
      return;
    }

    const saved = await saveProfile(profile);
    if (saved) {
      // Recargar el perfil para obtener el partner_code generado por el backend
      const updatedProfile = await getProfile();
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      setModalMessage('¡Perfil guardado exitosamente!');
      setShowModal(true);
      
      // Navegar a Home para forzar recarga de toda la app con el nuevo perfil
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      setModalMessage('Error al guardar el perfil. Intenta nuevamente.');
      setShowModal(true);
    }
  };

  const handleDeleteData = () => {
    clearAllData();
    setProfile({
      name: '',
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: '',
      gender: 'woman',
      partnerCode: '',
    });
    setShowDeleteModal(false);
    setModalMessage('Todos los datos han sido eliminados');
    setShowModal(true);
  };

  const handleLogout = () => {
    clearAllData();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handlePartnerCodeSubmit = async () => {
    if (!partnerCode.trim()) {
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    const partnerProfile = await getPartnerProfile(partnerCode.toUpperCase());
    
    if (partnerProfile) {
      setIsValid(true);
      setPartnerName(partnerProfile.name);
      
      // Sincronizar bidireccionalmente en el backend
      const syncResult = await syncPartner(partnerCode.toUpperCase());
      
      if (syncResult) {
        // Recargar el perfil para obtener datos actualizados
        const updatedProfile = await getProfile();
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        setModalMessage('¡Código de pareja guardado exitosamente! Sincronización completada.');
        setShowModal(true);
        
        // Navegar a man-home para forzar recarga de toda la app con el nuevo perfil
        setTimeout(() => {
          navigate('/man-home');
        }, 1500);
      } else {
        setModalMessage('Error al sincronizar. Intenta nuevamente.');
        setShowModal(true);
      }
    } else {
      setIsValid(false);
      setModalMessage('Código no encontrado. Verifica que sea correcto.');
      setShowModal(true);
    }
    
    setIsValidating(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
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

        {/* Opciones solo para mujeres */}
        {profile.gender !== 'man' && (
          <>
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
                max={new Date().toISOString().split('T')[0]}
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
          </>
        )}

        {/* Opciones solo para hombres - Código de pareja */}
        {profile.gender === 'man' && (
          <>
            {/* Código de pareja */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Users className="text-blue-500 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">Conectar con tu pareja</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Ingresa el código que tu pareja te dio para ver sus síntomas y ciclo
              </p>
              
              {isValid && partnerName ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <div>
                      <p className="font-medium text-green-900">Conectado con {partnerName}</p>
                      <p className="text-sm text-green-700">Código: {partnerCode}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      value={partnerCode}
                      onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      placeholder="Código de 6 caracteres"
                      maxLength={6}
                    />
                    <button
                      onClick={handlePartnerCodeSubmit}
                      disabled={isValidating}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isValidating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Key size={20} />
                      )}
                    </button>
                  </div>
                  
                  {isValid === false && (
                    <p className="text-sm text-red-600">
                      Código no válido. Pídele a tu pareja que te dé su código.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Botón cerrar sesión */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
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

      {/* Modal de confirmación de cierre de sesión */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="¿Cerrar sesión?"
      >
        <p className="text-gray-700 text-center mb-4">
          Se cerrará tu sesión y se eliminarán los datos locales.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
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
    </Layout>
  );
};

export default Settings;
