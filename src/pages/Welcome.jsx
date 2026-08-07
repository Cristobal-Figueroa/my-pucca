import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Sparkles, ArrowLeft } from 'lucide-react';
import { getProfile } from '../utils/storage';

const Welcome = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const savedProfile = await getProfile();
      if (savedProfile) {
        if (savedProfile.gender === 'man') {
          navigate('/man-home');
        } else {
          navigate('/home');
        }
      } else {
        setCheckingProfile(false);
      }
    };
    checkProfile();
  }, []);

  if (checkingProfile) {
    return null;
  }

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    localStorage.setItem('selected_gender', gender);
    setTimeout(() => {
      navigate('/auth-choice');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-full mb-4 shadow-lg">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-16 h-16 rounded-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mi Pucca
          </h1>
          <p className="text-gray-600 text-lg">
            Tu compañera de ciclo menstrual
          </p>
        </div>

        {/* Selección de género */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            ¿Quién eres?
          </h2>

          {/* Opción Mujer */}
          <button
            onClick={() => handleGenderSelect('woman')}
            className={`w-full bg-white rounded-3xl p-6 shadow-lg border-2 transition-all transform hover:scale-105 ${
              selectedGender === 'woman'
                ? 'border-pink-500 ring-4 ring-pink-200'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl mr-4 ${
                selectedGender === 'woman' ? 'bg-pink-500' : 'bg-pink-100'
              }`}>
                <User className={selectedGender === 'woman' ? 'text-white' : 'text-pink-500'} size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Mujer
                </h3>
                <p className="text-sm text-gray-600">
                  Rastrea tu ciclo menstrual y recibe consejos personalizados
                </p>
              </div>
            </div>
          </button>

          {/* Opción Hombre */}
          <button
            onClick={() => handleGenderSelect('man')}
            className={`w-full bg-white rounded-3xl p-6 shadow-lg border-2 transition-all transform hover:scale-105 ${
              selectedGender === 'man'
                ? 'border-blue-500 ring-4 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-4 rounded-2xl mr-4 ${
                selectedGender === 'man' ? 'bg-blue-500' : 'bg-blue-100'
              }`}>
                <User className={selectedGender === 'man' ? 'text-white' : 'text-blue-500'} size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Hombre
                </h3>
                <p className="text-sm text-gray-600">
                  Conecta con tu pareja y apóyala en su ciclo
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-sm">
            <Sparkles className="text-yellow-500 mr-2" size={20} />
            <span className="text-sm text-gray-700">
              Tu información es privada y segura
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
