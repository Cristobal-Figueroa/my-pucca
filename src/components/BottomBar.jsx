import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Droplets, Heart, Users, Activity, Lightbulb } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { useState, useEffect } from 'react';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMan, setIsMan] = useState(false);

  useEffect(() => {
    const checkGender = async () => {
      const profile = await getProfile();
      setIsMan(profile && profile.gender === 'man');
    };
    checkGender();
  }, []);

  const navItems = isMan ? [
    { path: '/man-home', icon: Home, label: 'Inicio' },
    { path: '/man-calendar', icon: Calendar, label: 'Calendario' },
    { path: '/man-symptoms', icon: Activity, label: 'Mis Síntomas' },
    { path: '/man-symptoms-partner', icon: Heart, label: 'Ella' },
    { path: '/man-tips', icon: Lightbulb, label: 'Consejos' },
  ] : [
    { path: '/home', icon: Home, label: 'Inicio' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/el', icon: Droplets, label: 'Él' },
    { path: '/ella', icon: Heart, label: 'Ella' },
    { path: '/partner', icon: Users, label: 'Pareja' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={24} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
