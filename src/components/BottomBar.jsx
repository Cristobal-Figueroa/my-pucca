import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Droplets, Heart, Settings } from 'lucide-react';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/ovulation', icon: Droplets, label: 'Ovulación' },
    { path: '/symptoms', icon: Heart, label: 'Síntomas' },
    { path: '/settings', icon: Settings, label: 'Config' },
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
