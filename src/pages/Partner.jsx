import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Copy, RefreshCw, Heart, Key, CheckCircle, Upload, Cloud } from 'lucide-react';
import { getProfile, saveProfile, getPartnerProfile, savePeriodsToDB, saveSymptomsToDB, getPeriods, getSymptoms } from '../utils/storage';
import Layout from '../components/Layout';

const Partner = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [syncCode, setSyncCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [partnerCode, setPartnerCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
        
        // Si es hombre, cargar el código de pareja ya guardado
        if (savedProfile.gender === 'man' && savedProfile.partnerCode) {
          setPartnerCode(savedProfile.partnerCode);
          // Intentar cargar el nombre de la pareja
          const partnerProfile = await getPartnerProfile(savedProfile.partnerCode);
          if (partnerProfile) {
            setPartnerName(partnerProfile.name);
            setIsValid(true);
          }
        } else if (savedProfile.gender === 'woman') {
          // Si es mujer, usar el código generado por el backend
          if (savedProfile.partnerCode) {
            setSyncCode(savedProfile.partnerCode);
          } else {
            // Si no tiene código, generar uno temporal para mostrar
            const code = generateSyncCode(savedProfile.name, savedProfile.lastPeriodStart);
            setSyncCode(code);
          }
        }
      } else {
        navigate('/settings');
      }
    };
    loadProfile();
  }, []);

  const generateSyncCode = (name, lastPeriodStart) => {
    // Generar un código único basado en el nombre y fecha
    const base = name.replace(/\s/g, '').toLowerCase() + lastPeriodStart;
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      const char = base.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // Convertir a código de 6 caracteres
    const code = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
    return code;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    if (profile && profile.gender === 'woman') {
      // Generar nuevo código
      const newCode = generateSyncCode(profile.name, profile.lastPeriodStart);
      
      // Actualizar el perfil con el nuevo código
      const updatedProfile = {
        ...profile,
        partnerCode: newCode
      };
      
      // Guardar en backend y localStorage
      await saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setSyncCode(newCode);
    }
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
      
      // Guardar el código en el perfil del hombre
      const updatedProfile = {
        ...profile,
        partnerCode: partnerCode.toUpperCase()
      };
      await saveProfile(updatedProfile);
      setProfile(updatedProfile);
    } else {
      setIsValid(false);
    }
    
    setIsValidating(false);
  };

  const handleSyncToDB = async () => {
    setSyncing(true);
    setSyncMessage('');
    
    try {
      // Generar partner_code si la mujer no tiene uno
      let profileToSync = { ...profile };
      if (profile.gender === 'woman' && !profile.partnerCode) {
        const partnerCode = generateSyncCode(profile.name, profile.lastPeriodStart);
        profileToSync = { ...profile, partnerCode };
        setProfile(profileToSync);
      }
      
      // Sincronizar perfil
      const profileSaved = await saveProfile(profileToSync);
      
      if (!profileSaved) {
        setSyncMessage('Error al guardar el perfil. Intenta nuevamente.');
        return;
      }
      
      if (profile.gender === 'woman') {
        // Sincronizar periodos y síntomas si es mujer
        const periods = await getPeriods();
        const periodsSaved = await savePeriodsToDB(periods);
        
        const symptoms = await getSymptoms();
        const symptomsSaved = await saveSymptomsToDB(symptoms);
        
        if (!periodsSaved || !symptomsSaved) {
          setSyncMessage('Error al guardar periodos o síntomas. Intenta nuevamente.');
          return;
        }
      }
      
      setSyncMessage('¡Datos sincronizados exitosamente!');
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error) {
      setSyncMessage('Error al sincronizar. Intenta nuevamente.');
      setTimeout(() => setSyncMessage(''), 3000);
    } finally {
      setSyncing(false);
    }
  };

  if (!profile) {
    return null;
  }

  // Vista para hombre - ingresar código de pareja
  if (profile.gender === 'man') {
    return (
      <Layout title="Sincronizar con Pareja" showBackButton={false}>
        <div className="space-y-6">
          {/* Instrucciones */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <Heart className="mr-2" size={24} />
              <h2 className="text-xl font-bold">Conecta con tu pareja</h2>
            </div>
            <p className="text-sm opacity-90">
              Ingresa el código que tu pareja te compartió para ver su ciclo menstrual y apoyarla mejor.
            </p>
          </div>

          {/* Estado de conexión */}
          {isValid && partnerName ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-600 mr-3" size={32} />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">¡Conectado!</h3>
                  <p className="text-sm text-green-700">Ahora puedes ver el ciclo de {partnerName}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/man-home')}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Ver ciclo de {partnerName}
              </button>
            </div>
          ) : (
            <>
              {/* Formulario para ingresar código */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Ingresa el código de tu pareja
                </h3>
                
                <div className="relative mb-4">
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
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-3xl tracking-wider"
                  />
                </div>

                {/* Estado de validación */}
                {isValid === false && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-800 text-center">
                      Código no encontrado. Verifica con tu pareja.
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePartnerCodeSubmit}
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
                      <Heart className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>

              {/* Instrucciones */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Cómo obtener el código?
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5">1</span>
                    <p>Pide a tu pareja que vaya a la sección "Pareja" en su app</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5">2</span>
                    <p>Ella te mostrará un código de 6 caracteres</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5">3</span>
                    <p>Ingresa ese código aquí para conectar</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Botón de sincronización con DB */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Cloud className="mr-2 text-blue-500" size={20} />
              Sincronizar datos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sube todos tus datos locales a la base de datos para mantenerlos seguros y sincronizados.
            </p>
            <button
              onClick={handleSyncToDB}
              disabled={syncing}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {syncing ? (
                <>
                  <RefreshCw className="mr-2 animate-spin" size={20} />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Subir datos a la nube
                </>
              )}
            </button>
            {syncMessage && (
              <p className={`text-sm mt-3 text-center ${syncMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {syncMessage}
              </p>
            )}
          </div>

          {/* Nota de privacidad */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-sm text-blue-900 text-center">
              🔒 La información de tu pareja se mantiene privada y segura. Solo tú podrás ver su ciclo.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Vista para mujer - mostrar su código
  return (
    <Layout title="Sincronización con Pareja" showBackButton={false}>
      <div className="space-y-6">
        {/* Instrucciones */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center mb-4">
            <Heart className="mr-2" size={24} />
            <h2 className="text-xl font-bold">Comparte tu ciclo con tu pareja</h2>
          </div>
          <p className="text-sm opacity-90">
            Comparte este código con tu pareja para que pueda ver tu ciclo menstrual y apoyarte mejor.
          </p>
        </div>

        {/* Código de sincronización */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Tu código de sincronización
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-mono font-bold text-pink-600 tracking-wider">
                {syncCode}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              <Copy className="mr-2" size={20} />
              {copied ? '¡Copiado!' : 'Copiar código'}
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Instrucciones para la pareja */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5">1</span>
              <p>Comparte este código con tu pareja</p>
            </div>
            <div className="flex items-start">
              <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5">2</span>
              <p>Tu pareja ingresará el código en su app</p>
            </div>
            <div className="flex items-start">
              <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 mt-0.5">3</span>
              <p>¡Listo! Tu pareja podrá ver tu ciclo</p>
            </div>
          </div>
        </div>

        {/* Botón de sincronización con DB */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Cloud className="mr-2 text-pink-500" size={20} />
            Sincronizar datos
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Sube todos tus datos locales a la base de datos para mantenerlos seguros y sincronizados.
          </p>
          <button
            onClick={handleSyncToDB}
            disabled={syncing}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {syncing ? (
              <>
                <RefreshCw className="mr-2 animate-spin" size={20} />
                Sincronizando...
              </>
            ) : (
              <>
                <Upload className="mr-2" size={20} />
                Subir datos a la nube
              </>
            )}
          </button>
          {syncMessage && (
            <p className={`text-sm mt-3 text-center ${syncMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {syncMessage}
            </p>
          )}
        </div>

        {/* Nota de privacidad */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-sm text-blue-900 text-center">
            🔒 Tu información se mantiene privada y segura. Solo tu pareja con el código podrá ver tu ciclo.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Partner;
