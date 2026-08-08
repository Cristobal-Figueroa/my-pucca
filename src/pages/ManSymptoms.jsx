import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar as CalendarIcon, Smile, Flame, Utensils, Zap, Moon, AlertCircle, Droplet, Coffee, Headphones } from 'lucide-react';
import { getProfile, getPartnerProfile, getPartnerAllSymptoms, getLocalTodayString } from '../utils/storage';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../components/Layout';

const ManSymptoms = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [symptoms, setSymptoms] = useState(null);
  const [allPartnerSymptoms, setAllPartnerSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const moodOptions = [
    { value: 'happy', label: 'Feliz 😊', color: 'bg-green-100 text-green-800' },
    { value: 'sad', label: 'Triste 😢', color: 'bg-blue-100 text-blue-800' },
    { value: 'anxious', label: 'Ansiosa 😰', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'irritable', label: 'Irritable 😤', color: 'bg-red-100 text-red-800' },
    { value: 'tired', label: 'Cansada 😴', color: 'bg-purple-100 text-purple-800' },
    { value: 'energetic', label: 'Energética ⚡', color: 'bg-orange-100 text-orange-800' },
    { value: 'calm', label: 'Tranquila 😌', color: 'bg-teal-100 text-teal-800' },
    { value: 'stressed', label: 'Estresada 😫', color: 'bg-red-200 text-red-900' },
    { value: 'confident', label: 'Segura 💪', color: 'bg-indigo-100 text-indigo-800' },
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
        
        if (savedProfile && savedProfile.gender === 'man') {
          setProfile(savedProfile);
          
          // Los hombres usan connectedPartnerCode (código de la mujer)
          const partnerCodeToUse = savedProfile.connectedPartnerCode;
          
          // Cargar datos reales de la pareja usando el connectedPartnerCode
          if (partnerCodeToUse) {
            const partnerProfile = await getPartnerProfile(partnerCodeToUse);
            
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              // Cargar todos los síntomas de la pareja usando su partner_code
              const allSymptoms = await getPartnerAllSymptoms(partnerProfile.partner_code);
              setAllPartnerSymptoms(allSymptoms);
              // Filtrar síntomas del día actual
              filterSymptomsByDate(selectedDate, allSymptoms);
            } else {
              setError('No se encontró el perfil de tu pareja. Verifica el código.');
              setPartnerData(null);
            }
          } else {
            setError('No tienes un código de pareja configurado.');
          }
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar los datos. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Filtrar síntomas cuando cambie la fecha seleccionada
  useEffect(() => {
    if (allPartnerSymptoms.length > 0) {
      filterSymptomsByDate(selectedDate, allPartnerSymptoms);
    }
  }, [selectedDate]);

  const filterSymptomsByDate = (date, symptomsList) => {
    // Si date es string, usarlo directamente
    let dateStr;
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateStr = date;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }
    
    const symptomForDate = symptomsList.find(s => s.date === dateStr);
    setSymptoms(symptomForDate || null);
  };

  const getSymptomIcon = (category) => {
    switch (category) {
      case 'mood': return Smile;
      case 'libido': return Flame;
      case 'cravings': return Utensils;
      case 'energy': return Zap;
      case 'sleep': return Moon;
      case 'pain': return AlertCircle;
      case 'skin': return Droplet;
      case 'digestion': return Coffee;
      case 'headache': return Headphones;
      default: return Heart;
    }
  };

  const getSymptomLabel = (category) => {
    switch (category) {
      case 'mood': return 'Estado de ánimo';
      case 'libido': return 'Libido';
      case 'cravings': return 'Antojos';
      case 'energy': return 'Energía';
      case 'sleep': return 'Sueño';
      case 'pain': return 'Dolor';
      case 'skin': return 'Piel';
      case 'digestion': return 'Digestión';
      case 'headache': return 'Dolor de cabeza';
      default: return category;
    }
  };

  const getSymptomDisplay = (category, value) => {
    if (!value) return null;
    
    let options;
    switch (category) {
      case 'mood': options = moodOptions; break;
      case 'libido': options = libidoOptions; break;
      case 'cravings': options = cravingsOptions; break;
      case 'energy': options = energyOptions; break;
      case 'sleep': options = sleepOptions; break;
      case 'pain': options = painOptions; break;
      case 'skin': options = skinOptions; break;
      case 'digestion': options = digestionOptions; break;
      case 'headache': options = headacheOptions; break;
      default: return null;
    }
    
    const option = options.find(opt => opt.value === value);
    return option || null;
  };

  if (loading) {
    return (
      <Layout title="Cargando..." showBackButton={false} showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando síntomas...</p>
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
    <Layout title="Síntomas" showBackButton={true} showSettings={false}>
      <div className="space-y-6">
        {/* Selector de fecha */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar fecha
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              max={getLocalTodayString()}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Síntomas de {partnerData.name}
          </p>
        </div>

        {/* Síntomas del día */}
        {symptoms ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="mr-2 text-pink-500" size={20} />
              Síntomas del {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </h2>

            {/* Estado de ánimo */}
            {symptoms.mood && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Smile className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Estado de ánimo</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {moodOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.mood === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Libido */}
            {symptoms.libido && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Flame className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Libido</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {libidoOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.libido === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Antojos */}
            {symptoms.cravings && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Utensils className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Antojos</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {cravingsOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.cravings === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Energía */}
            {symptoms.energy && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Zap className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Energía</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {energyOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.energy === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sueño */}
            {symptoms.sleep && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Moon className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Sueño</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {sleepOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.sleep === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dolor */}
            {symptoms.pain && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <AlertCircle className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Dolor</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {painOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.pain === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Piel */}
            {symptoms.skin && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Droplet className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Piel</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {skinOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.skin === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digestión */}
            {symptoms.digestion && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Coffee className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Digestión</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {digestionOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.digestion === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dolor de cabeza */}
            {symptoms.headache && (
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <Headphones className="text-pink-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Dolor de cabeza</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {headacheOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 rounded-xl font-medium ${
                        symptoms.headache === option.value
                          ? option.color
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notas */}
            {symptoms.notes && (
              <div className="mt-4 bg-pink-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Heart className="mr-2 text-pink-500" size={16} />
                  Notas
                </h3>
                <p className="text-sm text-gray-700">
                  {symptoms.notes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <Heart className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sin síntomas registrados
            </h3>
            <p className="text-sm text-gray-600">
              {partnerData.name} no ha registrado síntomas para esta fecha.
            </p>
          </div>
        )}

        {/* Información */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Heart className="mr-2 text-pink-500" size={18} />
            Información
          </h3>
          <p className="text-sm text-gray-600">
            Aquí puedes ver los síntomas que {partnerData.name} ha registrado. 
            Esta información es de solo lectura para ayudarte a entender cómo se siente.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ManSymptoms;
