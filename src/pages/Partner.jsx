import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Copy, RefreshCw, Heart } from 'lucide-react';
import { getProfile } from '../utils/storage';
import Layout from '../components/Layout';

const Partner = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [syncCode, setSyncCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      // Generar código de sincronización basado en el nombre y fecha de inicio
      const code = generateSyncCode(savedProfile.name, savedProfile.lastPeriodStart);
      setSyncCode(code);
    } else {
      navigate('/settings');
    }
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

  const handleRefresh = () => {
    if (profile) {
      const newCode = generateSyncCode(profile.name, profile.lastPeriodStart);
      setSyncCode(newCode);
    }
  };

  if (!profile) {
    return null;
  }

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
