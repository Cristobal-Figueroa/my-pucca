import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

const AuthChoice = () => {
  const navigate = useNavigate();
  const selectedGender = localStorage.getItem('selected_gender');

  const handleRegister = () => {
    if (selectedGender === 'woman') {
      navigate('/register-woman');
    } else {
      navigate('/register-man');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Título */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Qué deseas hacer?
          </h2>
          <p className="text-gray-600">
            Elige una opción para continuar
          </p>
        </div>

        {/* Botón de Registro */}
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
        >
          <UserPlus size={24} />
          <span className="text-lg">Registrarse</span>
        </button>

        {/* Botón de Login */}
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white text-gray-700 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 flex items-center justify-center space-x-3"
        >
          <LogIn size={24} />
          <span className="text-lg">Iniciar Sesión</span>
        </button>

        {/* Información */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <p className="text-sm text-blue-800 text-center">
            Si ya tienes una cuenta, inicia sesión. Si es tu primera vez, regístrate para crear tu cuenta.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AuthChoice;
