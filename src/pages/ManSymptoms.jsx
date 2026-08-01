import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar as CalendarIcon, Smile, Flame, Utensils, Zap, Moon, AlertCircle, Droplet, Coffee, Headphones } from 'lucide-react';
import { getProfile, getPartnerProfile, getPartnerSymptomsByDate } from '../utils/storage';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Layout from '../components/Layout';

const ManSymptoms = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const savedProfile = await getProfile();
        if (savedProfile && savedProfile.gender === 'man') {
          setProfile(savedProfile);
          
          // Cargar datos reales de la pareja usando el partnerCode
          if (savedProfile.partnerCode) {
            const partnerProfile = await getPartnerProfile(savedProfile.partnerCode);
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              await loadSymptoms(selectedDate);
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
  }, [selectedDate]);

  const loadSymptoms = async (date) => {
    if (!profile || !profile.partnerCode) return;
    
    const partnerSymptoms = await getPartnerSymptomsByDate(profile.partnerCode, date);
    if (partnerSymptoms) {
      setSymptoms(partnerSymptoms);
    } else {
      setSymptoms(null);
    }
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
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              onClick={(e) => e.target.showPicker?.()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
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

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(symptoms).map(([key, value]) => {
                if (key === 'notes') return null;
                const Icon = getSymptomIcon(key);
                return (
                  <div key={key} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Icon className="text-blue-500 mr-2" size={18} />
                      <span className="text-sm font-medium text-gray-700">
                        {getSymptomLabel(key)}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {value || 'No registrado'}
                    </p>
                  </div>
                );
              })}
            </div>

            {symptoms.notes && (
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
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
