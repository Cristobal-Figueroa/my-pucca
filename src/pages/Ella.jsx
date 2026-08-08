import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Smile, Flame, Utensils, Coffee, Trash2, Moon, Zap, Droplet, Activity, Headphones } from 'lucide-react';
import { getProfile, addSymptom, getSymptomsByDate, deleteSymptom, getPartnerProfile, getPartnerAllSymptoms, getLocalTodayString } from '../utils/storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

const Ella = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [isManViewing, setIsManViewing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [symptoms, setSymptoms] = useState({
    mood: '',
    libido: '',
    cravings: '',
    energy: '',
    sleep: '',
    pain: '',
    skin: '',
    digestion: '',
    headache: '',
    notes: ''
  });
  const [savedSymptoms, setSavedSymptoms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [symptomToDelete, setSymptomToDelete] = useState(null);

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
      const savedProfile = await getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
        
        // Detectar si es hombre viendo la página de Ella
        if (savedProfile.gender === 'man') {
          setIsManViewing(true);
          // Cargar perfil de la pareja usando connectedPartnerCode (código de la mujer)
          const partnerCodeToUse = savedProfile.connectedPartnerCode;
          if (partnerCodeToUse) {
            const partnerProfile = await getPartnerProfile(partnerCodeToUse);
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              // Cargar síntomas usando el partnerCode de la mujer (su propio código)
              loadSymptomsForDate(selectedDate, partnerProfile.partner_code);
            } else {
              // Si no hay partnerData, mostrar error
              setModalMessage('No se encontró el perfil de tu pareja. Verifica el código de sincronización.');
              setShowModal(true);
              loadSymptomsForDate(selectedDate, null);
            }
          } else {
            // Si no hay partnerCode, mostrar error
            setModalMessage('No tienes una pareja sincronizada. Ve a configuración para sincronizarte.');
            setShowModal(true);
            loadSymptomsForDate(selectedDate, null);
          }
        } else {
          setIsManViewing(false);
          // Si es mujer, cargar sus propios síntomas
          loadSymptomsForDate(selectedDate, null);
        }
      } else {
        navigate('/settings');
      }
    };
    loadProfile();
  }, [selectedDate]);

  const loadSymptomsForDate = async (date, partnerCode = null) => {
    let symptomsForDate = [];
    
    if (isManViewing && partnerCode) {
      // Si es hombre, cargar síntomas de la pareja usando el partnerCode de la mujer
      const allPartnerSymptoms = await getPartnerAllSymptoms(partnerCode);
      const dateStr = date; // selectedDate ya viene en formato 'yyyy-MM-dd'
      symptomsForDate = allPartnerSymptoms.filter(s => s.date === dateStr);
    } else {
      // Si es mujer, cargar sus propios síntomas
      symptomsForDate = await getSymptomsByDate(date); // date ya es string 'yyyy-MM-dd'
    }
    
    setSavedSymptoms(symptomsForDate);
    
    if (symptomsForDate.length > 0) {
      const latestSymptom = symptomsForDate[symptomsForDate.length - 1];
      setSymptoms({
        mood: latestSymptom.mood || '',
        libido: latestSymptom.libido || '',
        cravings: latestSymptom.cravings || '',
        energy: latestSymptom.energy || '',
        sleep: latestSymptom.sleep || '',
        pain: latestSymptom.pain || '',
        skin: latestSymptom.skin || '',
        digestion: latestSymptom.digestion || '',
        headache: latestSymptom.headache || '',
        notes: latestSymptom.notes || ''
      });
    } else {
      setSymptoms({
        mood: '',
        libido: '',
        cravings: '',
        energy: '',
        sleep: '',
        pain: '',
        skin: '',
        digestion: '',
        headache: '',
        notes: ''
      });
    }
  };

  const handleSave = async () => {
    if (!symptoms.mood && !symptoms.libido && !symptoms.cravings && !symptoms.energy && 
        !symptoms.sleep && !symptoms.pain && !symptoms.skin && !symptoms.digestion && 
        !symptoms.headache && !symptoms.notes) {
      setModalMessage('Por favor selecciona al menos un síntoma');
      setShowModal(true);
      return;
    }

    const newSymptom = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: symptoms.mood,
      libido: symptoms.libido,
      cravings: symptoms.cravings,
      energy: symptoms.energy,
      sleep: symptoms.sleep,
      pain: symptoms.pain,
      skin: symptoms.skin,
      digestion: symptoms.digestion,
      headache: symptoms.headache,
      notes: symptoms.notes,
      timestamp: new Date().toISOString()
    };

    await addSymptom(newSymptom);
    await loadSymptomsForDate(selectedDate);
    
    setModalMessage('¡Síntomas guardados exitosamente!');
    setShowModal(true);
  };

  const handleDelete = (symptom) => {
    setSymptomToDelete(symptom);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (symptomToDelete) {
      await deleteSymptom(symptomToDelete.id);
      await loadSymptomsForDate(selectedDate);
      setShowDeleteModal(false);
      setSymptomToDelete(null);
      setModalMessage('Síntoma eliminado');
      setShowModal(true);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Layout title="Ella" showBackButton={false}>
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
            max={getLocalTodayString()}
          />
        </div>

        {isManViewing && partnerData && (
          <div className="bg-pink-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-pink-800">
              Viendo síntomas de <span className="font-semibold">{partnerData.name}</span>
            </p>
          </div>
        )}

        {/* Estado de ánimo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Smile className="text-pink-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Estado de ánimo</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, mood: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.mood === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, libido: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.libido === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, cravings: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.cravings === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, energy: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.energy === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, sleep: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.sleep === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, pain: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.pain === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, skin: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.skin === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, digestion: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.digestion === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                onClick={() => !isManViewing && setSymptoms({ ...symptoms, headache: option.value })}
                disabled={isManViewing}
                className={`p-3 rounded-xl font-medium transition-all ${
                  symptoms.headache === option.value
                    ? `${option.color} ring-2 ring-pink-500 ring-offset-2`
                    : isManViewing
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales
          </label>
          <textarea
            value={symptoms.notes}
            onChange={(e) => !isManViewing && setSymptoms({ ...symptoms, notes: e.target.value })}
            disabled={isManViewing}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
              isManViewing ? 'bg-gray-50 text-gray-400' : ''
            }`}
            rows={3}
            placeholder="Agrega cualquier nota adicional..."
          />
        </div>

        {/* Botón guardar */}
        {!isManViewing && (
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <Heart size={20} />
            <span>Guardar Síntomas</span>
          </button>
        )}

        {/* Síntomas guardados del día */}
        {savedSymptoms.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Síntomas guardados hoy</h3>
            <div className="space-y-3">
              {savedSymptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="bg-gray-50 rounded-xl p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {symptom.mood && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {moodOptions.find(o => o.value === symptom.mood)?.label}
                        </span>
                      )}
                      {symptom.libido && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                          {libidoOptions.find(o => o.value === symptom.libido)?.label}
                        </span>
                      )}
                      {symptom.cravings && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                          {cravingsOptions.find(o => o.value === symptom.cravings)?.label}
                        </span>
                      )}
                      {symptom.energy && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {energyOptions.find(o => o.value === symptom.energy)?.label}
                        </span>
                      )}
                    </div>
                    {symptom.notes && (
                      <p className="text-sm text-gray-600">{symptom.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(symptom)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
        title="¿Eliminar síntoma?"
      >
        <p className="text-gray-700 text-center mb-4">
          ¿Estás segura de que quieres eliminar este registro?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Ella;
