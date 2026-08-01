import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Heart, Flame, Moon, Zap, Utensils, Droplet, Activity, Coffee, Sparkles } from 'lucide-react';
import { getProfile } from '../utils/storage';
import { getCyclePhase } from '../utils/cycleCalculations';
import Layout from '../components/Layout';

const Tips = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      const today = new Date();
      const lastPeriodStart = new Date(savedProfile.lastPeriodStart);
      const phase = getCyclePhase(
        today,
        lastPeriodStart,
        savedProfile.cycleLength,
        savedProfile.periodLength
      );
      setCurrentPhase(phase);
    } else {
      navigate('/settings');
    }
  }, []);

  const tipsByPhase = {
    menstruation: {
      title: 'Menstruación',
      icon: Heart,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      tips: [
        {
          category: 'Dolor y Cólicos',
          icon: Activity,
          items: [
            'Usa compresas calientes en el abdomen bajo',
            'Masajea suavemente el abdomen en movimientos circulares',
            'Toma infusiones de jengibre o manzanilla',
            'Practica yoga suave o estiramientos',
            'Considera analgésicos de venta libre si es necesario'
          ]
        },
        {
          category: 'Energía y Descanso',
          icon: Moon,
          items: [
            'Descansa cuando lo necesites, tu cuerpo está trabajando',
            'Duerme al menos 7-8 horas para recuperar energía',
            'Evita ejercicios intensos, opta por caminatas suaves',
            'Mantente hidratada con agua y electrolitos',
            'Reduce el estrés con meditación o respiración profunda'
          ]
        },
        {
          category: 'Alimentación',
          icon: Utensils,
          items: [
            'Consume alimentos ricos en hierro (espinacas, lentejas)',
            'Incluye chocolate negro (70% cacao) para mejorar el ánimo',
            'Evita el exceso de sal para reducir la retención de líquidos',
            'Come frutas ricas en vitamina C (naranjas, fresas)',
            'Limita la cafeína y el alcohol'
          ]
        },
        {
          category: 'Intimidad',
          icon: Flame,
          items: [
            'Comunica tus necesidades a tu pareja',
            'Explora otras formas de intimidad no sexual',
            'Usa toallas higiénicas cómodas y transpirables',
            'Mantén una buena higiene íntima',
            'No te sientas culpable por no tener ganas de intimidad'
          ]
        }
      ]
    },
    follicular: {
      title: 'Fase Folicular',
      icon: Sparkles,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      tips: [
        {
          category: 'Energía y Ejercicio',
          icon: Zap,
          items: [
            'Aprovecha tu energía aumentada para ejercicio',
            'Prueba entrenamientos de fuerza o cardio',
            'Es el mejor momento para iniciar nuevos proyectos',
            'Tu resistencia física está en su punto máximo',
            'Participa en actividades sociales y grupales'
          ]
        },
        {
          category: 'Productividad',
          icon: Coffee,
          items: [
            'Inicia proyectos importantes que requieran concentración',
            'Tu creatividad y memoria están mejoradas',
            'Es ideal para aprender nuevas habilidades',
            'Planifica y organiza tus metas',
            'Toma decisiones importantes durante esta fase'
          ]
        },
        {
          category: 'Alimentación',
          icon: Utensils,
          items: [
            'Consume proteínas magras para apoyar el crecimiento muscular',
            'Incluye grasas saludables (aguacate, nueces)',
            'Come vegetales de hoja verde para nutrientes',
            'Mantén una dieta equilibrada y variada',
            'Hidrátate bien para optimizar tu energía'
          ]
        },
        {
          category: 'Intimidad',
          icon: Flame,
          items: [
            'Tu libido comienza a aumentar gradualmente',
            'Es un buen momento para explorar nuevas experiencias',
            'Comunica tus deseos a tu pareja',
            'La energía física puede mejorar la experiencia',
            'Aprovecha para fortalecer la conexión emocional'
          ]
        }
      ]
    },
    ovulation: {
      title: 'Ovulación',
      icon: Droplet,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      tips: [
        {
          category: 'Fertilidad',
          icon: Heart,
          items: [
            'Estás en tu ventana fértil máxima',
            'Si planeas concebir, este es el momento ideal',
            'La temperatura basal puede estar ligeramente elevada',
            'El flujo cervical es más elástico y claro',
            'Puedes sentir un aumento en la libido'
          ]
        },
        {
          category: 'Energía y Confianza',
          icon: Sparkles,
          items: [
            'Tu energía y confianza están en su punto máximo',
            'Es el mejor momento para presentaciones o eventos sociales',
            'Tu piel puede verse más radiante',
            'El olfato está más agudo',
            'Te sientes más comunicativa y sociable'
          ]
        },
        {
          category: 'Alimentación',
          icon: Utensils,
          items: [
            'Consume alimentos ricos en antioxidantes',
            'Incluye grasas saludables para apoyar la hormona',
            'Come frutas y verduras frescas',
            'Mantén una buena hidratación',
            'Evita alimentos procesados y azúcares refinados'
          ]
        },
        {
          category: 'Intimidad',
          icon: Flame,
          items: [
            'Tu libido está en su punto máximo',
            'Es el momento ideal para intimidad con tu pareja',
            'La sensibilidad física está aumentada',
            'Comunica claramente tus deseos',
            'Disfruta de la conexión emocional y física'
          ]
        }
      ]
    },
    luteal: {
      title: 'Fase Lútea',
      icon: Moon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      tips: [
        {
          category: 'Dolor y Síntomas PMS',
          icon: Activity,
          items: [
            'Prepara el inicio de posibles síntomas PMS',
            'Usa compresas calientes para cólicos',
            'Toma suplementos de magnesio si es necesario',
            'Practica técnicas de relajación',
            'Mantén un registro de tus síntomas'
          ]
        },
        {
          category: 'Energía y Descanso',
          icon: Moon,
          items: [
            'Tu energía comienza a disminuir gradualmente',
            'Prioriza el descanso y la recuperación',
            'Reduce la intensidad de los ejercicios',
            'Duerme más para compensar la fatiga',
            'Evita compromisos sociales que te agoten'
          ]
        },
        {
          category: 'Alimentación',
          icon: Utensils,
          items: [
            'Consume carbohidratos complejos para estabilizar el ánimo',
            'Incluye alimentos ricos en triptófano (plátanos, nueces)',
            'Reduce el consumo de sal para minimizar la hinchazón',
            'Come chocolate negro para mejorar el ánimo',
            'Evita el exceso de azúcar y cafeína'
          ]
        },
        {
          category: 'Intimidad',
          icon: Flame,
          items: [
            'La libido puede disminuir gradualmente',
            'Comunica tus cambios a tu pareja',
            'Explora formas de intimidad que no requieran mucho esfuerzo',
            'Prioriza la conexión emocional sobre la física',
            'No te sientas culpable por tener menos energía'
          ]
        }
      ]
    }
  };

  if (!profile || !currentPhase) {
    return null;
  }

  const currentTips = tipsByPhase[currentPhase];
  const Icon = currentTips.icon;

  return (
    <Layout title="Consejos" showBackButton={false}>
      <div className="space-y-6">
        {/* Fase actual */}
        <div className={`${currentTips.bgColor} rounded-2xl p-6`}>
          <div className="flex items-center mb-4">
            <div className={`${currentTips.color} p-3 rounded-full mr-4`}>
              <Icon className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Estás en: {currentTips.title}
              </h2>
              <p className={`text-sm ${currentTips.textColor} mt-1`}>
                Consejos personalizados para esta fase
              </p>
            </div>
          </div>
        </div>

        {/* Consejos por categoría */}
        {currentTips.tips.map((category, index) => {
          const CategoryIcon = category.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <CategoryIcon className="text-pink-500 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.category}
                </h3>
              </div>
              <ul className="space-y-3">
                {category.items.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start">
                    <span className="text-pink-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Nota informativa */}
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-sm text-blue-900 text-center">
            💡 Estos consejos son generales. Consulta siempre con un profesional de salud para consejos personalizados.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Tips;
