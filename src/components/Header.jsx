import { useNavigate } from 'react-router-dom';
import { Settings, Lightbulb } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';

const Header = ({ showSettings = true, showTips = true }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await getProfile();
      setProfile(savedProfile);
    };
    loadProfile();
  }, []);

  // No mostrar header si no hay sesión
  if (!profile) {
    return null;
  }

  // Ocultar consejos si el usuario es hombre
  const shouldShowTips = showTips && profile?.gender !== 'man';

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleTips = () => {
    navigate('/tips');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Mi Pucca" className="w-8 h-8 rounded-full mr-2 object-cover" />
            {profile ? (
              <>
                <h1 className="text-xl font-bold text-gray-900">
                  Hola, {profile.name} 👋
                </h1>
                <p className="text-gray-600 text-xs">
                  {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
              </>
            ) : (
              <h1 className="text-xl font-bold text-gray-900">Mi Pucca</h1>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {shouldShowTips && (
              <button
                onClick={handleTips}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Lightbulb className="text-amber-500" size={24} />
              </button>
            )}
            {showSettings && (
              <button
                onClick={handleSettings}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings className="text-gray-600" size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
