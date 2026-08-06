import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Flame, Utensils, Moon, Zap, Droplet, Activity, Headphones, Heart } from 'lucide-react';
import { getProfile, getPartnerProfile, parseLocalDate } from '../utils/storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../components/Layout';

const El = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [partnerSymptoms, setPartnerSymptoms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const moodOptions = [
    { value: 'happy', label: 'Feliz 😊', color: 'bg-green-100 text-green-800' },
    { value: 'sad', label: 'Triste 😢', color: 'bg-blue-100 text-blue-800' },
    { value: 'anxious', label: 'Ansioso 😰', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'irritable', label: 'Irritable 😤', color: 'bg-red-100 text-red-800' },
    { value: 'tired', label: 'Cansado 😴', color: 'bg-purple-100 text-purple-800' },
    { value: 'energetic', label: 'Energético ⚡', color: 'bg-orange-100 text-orange-800' },
    { value: 'calm', label: 'Tranquilo 😌', color: 'bg-teal-100 text-teal-800' },
    { value: 'stressed', label: 'Estresado 😫', color: 'bg-red-200 text-red-900' },
    { value: 'confident', label: 'Seguro 💪', color: 'bg-indigo-100 text-indigo-800' },
  ];

  const libidoOptions = [
    { value: 'very_high', label: 'Muy alta 🔥🔥', color: 'bg-red-200 text-red-900' },
    { value: 'high', label: 'Alta 🔥', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Media 💕', color: 'bg-pink-100 text-pink-800' },
    { value: 'low', label: 'Baja 💤', color: 'bg-gray-100 text-gray-800' },
    { value: 'very_low', label: 'Muy baja 😴', color: 'bg-gray-200 text-gray-900' },
  ];

  const cravingsOptions = [
    { value: 'sweet', label: 'Dulces 🍫', color: 'bg-amber-100 text-amber-800' },
    { value: 'salty', label: 'Salados 🍟', color: 'bg-blue-100 text-blue-800' },
    { value: 'spicy', label: 'Picantes 🌶️', color: 'bg-red-100 text-red-800' },
    { value: 'chocolate', label: 'Chocolate 🍫', color: 'bg-amber-200 text-amber-900' },
    { value: 'carbs', label: 'Carbohidratos 🍞', color: 'bg-orange-100 text-orange-800' },
    { value: 'acidic', label: 'Ácidos 🍋', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'none', label: 'Ninguno ✅', color: 'bg-green-100 text-green-800' },
  ];

  const energyOptions = [
    { value: 'very_high', label: 'Muy alta ⚡⚡', color: 'bg-green-200 text-green-900' },
    { value: 'high', label: 'Alta ⚡', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Media 🔄', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Baja 🪫', color: 'bg-red-100 text-red-800' },
    { value: 'very_low', label: 'Muy baja 😴', color: 'bg-red-200 text-red-900' },
  ];

  const sleepOptions = [
    { value: 'excellent', label: 'Excelente 😴', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'good', label: 'Buena 😊', color: 'bg-blue-100 text-blue-800' },
    { value: 'fair', label: 'Regular 😐', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'poor', label: 'Mala 😫', color: 'bg-orange-100 text-orange-800' },
    { value: 'terrible', label: 'Terrible 😱', color: 'bg-red-100 text-red-800' },
  ];

  const painOptions = [
    { value: 'none', label: 'Ninguno ✅', color: 'bg-green-100 text-green-800' },
    { value: 'mild', label: 'Leve 😣', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'moderate', label: 'Moderado 😖', color: 'bg-orange-100 text-orange-800' },
    { value: 'severe', label: 'Severo 😫', color: 'bg-red-100 text-red-800' },
  ];

  const skinOptions = [
    { value: 'normal', label: 'Normal ✨', color: 'bg-green-100 text-green-800' },
    { value: 'dry', label: 'Seca 🏜️', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'oily', label: 'Grasosa 💧', color: 'bg-orange-100 text-orange-800' },
    { value: 'sensitive', label: 'Sensible 🥺', color: 'bg-red-100 text-red-800' },
    { value: 'acne', label: 'Con acné 😷', color: 'bg-purple-100 text-purple-800' },
  ];

  const digestionOptions = [
    { value: 'excellent', label: 'Excelente 😋', color: 'bg-green-100 text-green-800' },
    { value: 'good', label: 'Buena 😊', color: 'bg-blue-100 text-blue-800' },
    { value: 'bloating', label: 'Hinchazón 🎈', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'indigestion', label: 'Indigestión 🤢', color: 'bg-orange-100 text-orange-800' },
    { value: 'nausea', label: 'Náuseas 🤮', color: 'bg-red-100 text-red-800' },
  ];

  const headacheOptions = [
    { value: 'none', label: 'Ninguno ✅', color: 'bg-green-100 text-green-800' },
    { value: 'mild', label: 'Leve 😣', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'moderate', label: 'Moderado 😖', color: 'bg-orange-100 text-orange-800' },
    { value: 'severe', label: 'Severo 😫', color: 'bg-red-100 text-red-800' },
    { value: 'migraine', label: 'Migraña 🤯', color: 'bg-purple-100 text-purple-800' },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const savedProfile = await getProfile();
        if (savedProfile && savedProfile.gender === 'woman') {
          setProfile(savedProfile);
          
          if (savedProfile.partnerCode) {
            const partnerProfile = await getPartnerProfile(savedProfile.partnerCode);
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              loadPartnerSymptomsForDate(selectedDate, savedProfile.partnerCode);
            } else {
              setError('No se encontró el perfil de tu pareja. Verifica el código.');
              setPartnerData(null);
            }
          } else {
            setError('No tienes un código de pareja configurado. Ve a la sección Pareja para conectar.');
          }
        } else {
          navigate('/man-home');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar los datos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [selectedDate]);

  const loadPartnerSymptomsForDate = async (date, partnerCode) => {
    // Aquí cargaríamos los síntomas del hombre desde el backend
    // Por ahora, mostraremos un mensaje indicando que necesita implementarse
    setPartnerSymptoms(null);
  };

  if (loading) {
    return (
      <Layout title="Cargando..." showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando síntomas de tu pareja...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile || !partnerData) {
    return (
      <Layout title="Error" showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p className="text-gray-600">No se pudieron cargar los datos.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Él - ${partnerData.name}`} showBackButton={false}>
      <div className="space-y-6">
        {/* Selector de fecha */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onClick={(e) => e.target.showPicker?.()}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-pointer"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Información */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
          <div className="flex items-center mb-4">
            <Heart className="mr-2" size={24} />
            <h2 className="text-xl font-bold">Síntomas de {partnerData.name}</h2>
          </div>
          <p className="text-sm opacity-90">
            Aquí podrás ver cómo se siente tu pareja. Los síntomas que él registre aparecerán aquí.
          </p>
        </div>

        {/* Mensaje de implementación pendiente */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🚧</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Funcionalidad en desarrollo</h3>
              <p className="text-sm text-yellow-800">
                Tu pareja necesita registrar sus síntomas primero. Pídele que vaya a la sección "Síntomas" en su app para empezar a trackear cómo se siente.
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder para cuando haya síntomas */}
        {partnerSymptoms ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Síntomas registrados</h3>
            {/* Aquí se mostrarán los síntomas del hombre */}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-600">
              No hay síntomas registrados para esta fecha.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default El;
