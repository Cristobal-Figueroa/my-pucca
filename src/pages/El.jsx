import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Flame, Utensils, Moon, Zap, Droplet, Activity, Headphones, FileText } from 'lucide-react';
import { getProfile, getPartnerProfile, getPartnerAllSymptoms } from '../utils/storage';
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
          
          // Usar connected_partner_code para buscar al hombre conectado
          const partnerCodeToUse = savedProfile.connectedPartnerCode || savedProfile.partnerCode;
          
          if (partnerCodeToUse) {
            const partnerProfile = await getPartnerProfile(partnerCodeToUse);
            if (partnerProfile && partnerProfile.gender === 'man') {
              setPartnerData(partnerProfile);
              loadPartnerSymptomsForDate(selectedDate, partnerCodeToUse);
            } else {
              setError('Tu pareja aún no se ha conectado. Pídele que ingrese tu código en Ajustes.');
              setPartnerData(null);
            }
          } else {
            setError('Tu pareja aún no se ha conectado. Pídele que ingrese tu código en Ajustes.');
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
    try {
      const allSymptoms = await getPartnerAllSymptoms(partnerCode);
      const symptomForDate = allSymptoms.find(s => s.date === date);
      setPartnerSymptoms(symptomForDate || null);
    } catch (error) {
      console.error('Error loading partner symptoms:', error);
      setPartnerSymptoms(null);
    }
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
    <Layout title="Él" showBackButton={false}>
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

        {/* Estado de ánimo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Smile className="text-blue-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Estado de ánimo</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.mood === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Libido */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Flame className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Libido</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {libidoOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.libido === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Antojos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Utensils className="text-orange-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Antojos</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {cravingsOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.cravings === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nivel de energía */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Zap className="text-amber-600 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Nivel de energía</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {energyOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.energy === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calidad de sueño */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Moon className="text-indigo-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Calidad de sueño</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sleepOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.sleep === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dolor */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Activity className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Dolor</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {painOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.pain === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Piel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Droplet className="text-blue-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Piel</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {skinOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.skin === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Digestión */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Utensils className="text-green-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Digestión</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {digestionOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.digestion === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dolor de cabeza */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Headphones className="text-purple-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Dolor de cabeza</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {headacheOptions.map((option) => (
              <button
                key={option.value}
                disabled
                className={`p-3 rounded-xl font-medium transition-all ${
                  partnerSymptoms?.headache === option.value
                    ? `${option.color} ring-2 ring-blue-500 ring-offset-2`
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <FileText className="text-green-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Notas adicionales</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-700">
              {partnerSymptoms?.notes || 'Sin notas'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default El;
