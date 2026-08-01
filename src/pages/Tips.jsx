import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Heart, Flame, Moon, Zap, Utensils, Droplet, Activity, Coffee, Sparkles, Star, CheckCircle, ArrowRight } from 'lucide-react';
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
      subtitle: 'Tiempo de renovación y descanso',
      icon: Heart,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      description: 'Tu cuerpo está trabajando duro renovándose. Es momento de escucharlo, descansar y cuidarte con amor.',
      tips: [
        {
          category: 'Alivio del Dolor y Cólicos',
          icon: Activity,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          description: 'Estrategias naturales y médicas para aliviar el malestar menstrual.',
          items: [
            {
              title: 'Compresas Calientes',
              detail: 'Aplica compresas calientes en el abdomen bajo durante 15-20 minutos. El calor relaja los músculos uterinos y mejora el flujo sanguíneo.',
              icon: CheckCircle
            },
            {
              title: 'Masaje Abdominal',
              detail: 'Masajea suavemente el abdomen en movimientos circulares en sentido de las agujas del reloj. Usa aceites esenciales de lavanda o romero.',
              icon: CheckCircle
            },
            {
              title: 'Infusiones Naturales',
              detail: 'Toma té de jengibre, manzanilla o canela. Tienen propiedades antiinflamatorias y antiespasmódicas naturales.',
              icon: CheckCircle
            },
            {
              title: 'Yoga Suave',
              detail: 'Practica posturas de yoga restaurativas como la postura del niño o la postura del gato-vaca. Estiran la zona lumbar y relajan el cuerpo.',
              icon: CheckCircle
            },
            {
              title: 'Medicación',
              detail: 'Si el dolor es intenso, considera analgésicos de venta libre como ibuprofeno. Siempre consulta con tu médico.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Energía y Descanso',
          icon: Moon,
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-50',
          description: 'Tu energía está en su punto más bajo. Prioriza el descanso y la recuperación.',
          items: [
            {
              title: 'Descanso Activo',
              detail: 'No te sientas culpable por descansar. Tu cuerpo está trabajando duro en la renovación celular y hormonal.',
              icon: CheckCircle
            },
            {
              title: 'Sueño de Calidad',
              detail: 'Duerme al menos 7-8 horas. El sueño profundo ayuda a regular las hormonas y reduce la fatiga.',
              icon: CheckCircle
            },
            {
              title: 'Ejercicio Suave',
              detail: 'Evita ejercicios intensos. Opta por caminatas suaves, natación ligera o estiramientos.',
              icon: CheckCircle
            },
            {
              title: 'Hidratación',
              detail: 'Bebe agua con electrolitos para reponer los minerales perdidos y mantener la energía.',
              icon: CheckCircle
            },
            {
              title: 'Reducción de Estrés',
              detail: 'Practica meditación, respiración profunda o mindfulness. El estrés puede intensificar los cólicos.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Nutrición Inteligente',
          icon: Utensils,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          description: 'Alimentos que nutren tu cuerpo y alivian los síntomas menstruales.',
          items: [
            {
              title: 'Hierro y Nutrientes',
              detail: 'Consume espinacas, lentejas, carne roja magra y frijoles para reponer el hierro perdido.',
              icon: CheckCircle
            },
            {
              title: 'Chocolate Negro',
              detail: 'Come chocolate negro (70% cacao) para mejorar el ánimo y reducir los antojos.',
              icon: CheckCircle
            },
            {
              title: 'Reducción de Sodio',
              detail: 'Evita el exceso de sal para reducir la retención de líquidos y la hinchazón abdominal.',
              icon: CheckCircle
            },
            {
              title: 'Vitamina C',
              detail: 'Come naranjas, fresas, kiwi y pimientos para mejorar la absorción de hierro.',
              icon: CheckCircle
            },
            {
              title: 'Limitar Estimulantes',
              detail: 'Reduce la cafeína y el alcohol, ya que pueden intensificar los cólicos y alterar el sueño.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Intimidad y Conexión',
          icon: Flame,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          description: 'Mantén la conexión con tu pareja de formas que respeten tu energía actual.',
          items: [
            {
              title: 'Comunicación Abierta',
              detail: 'Explícale a tu pareja cómo te sientes físicamente y emocionalmente. La comprensión fortalece la relación.',
              icon: CheckCircle
            },
            {
              title: 'Intimidad No Sexual',
              detail: 'Explora masajes, abrazos, besos o simplemente tiempo juntos. La intimidad no siempre es sexual.',
              icon: CheckCircle
            },
            {
              title: 'Comodidad',
              detail: 'Usa toallas higiénicas cómodas y transpirables. La comodidad física mejora tu bienestar general.',
              icon: CheckCircle
            },
            {
              title: 'Higiene Íntima',
              detail: 'Mantén una buena higiene íntima con productos suaves y sin fragancias para evitar irritaciones.',
              icon: CheckCircle
            },
            {
              title: 'Sin Culpa',
              detail: 'No te sientas culpable por no tener ganas de intimidad sexual. Es completamente normal.',
              icon: CheckCircle
            }
          ]
        }
      ]
    },
    follicular: {
      title: 'Fase Folicular',
      subtitle: 'Renovación y crecimiento',
      icon: Sparkles,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900',
      description: 'Tu energía está aumentando. Es el momento perfecto para nuevos comienzos y proyectos.',
      tips: [
        {
          category: 'Energía y Ejercicio',
          icon: Zap,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          description: 'Aprovecha tu energía aumentada para actividades físicas y deportes.',
          items: [
            {
              title: 'Entrenamiento de Fuerza',
              detail: 'Es el mejor momento para entrenamientos de fuerza. Tu cuerpo responde mejor al estímulo muscular.',
              icon: CheckCircle
            },
            {
              title: 'Cardio Intenso',
              detail: 'Prueba HIIT, correr o spinning. Tu resistencia cardiovascular está en su punto máximo.',
              icon: CheckCircle
            },
            {
              title: 'Nuevos Deportes',
              detail: 'Inicia actividades deportivas que siempre quisiste probar. Tu coordinación está mejorada.',
              icon: CheckCircle
            },
            {
              title: 'Clases Grupales',
              detail: 'Participa en clases de baile, spinning o yoga. La energía social está en su punto máximo.',
              icon: CheckCircle
            },
            {
              title: 'Recuperación',
              detail: 'Aunque tengas mucha energía, no olvides descansar y recuperarte adecuadamente.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Productividad Mental',
          icon: Coffee,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          description: 'Tu mente está alerta y creativa. Aprovecha para proyectos importantes.',
          items: [
            {
              title: 'Proyectos Nuevos',
              detail: 'Inicia proyectos importantes que requieran concentración y creatividad.',
              icon: CheckCircle
            },
            {
              title: 'Aprendizaje',
              detail: 'Es ideal para aprender nuevas habilidades, idiomas o tomar cursos.',
              icon: CheckCircle
            },
            {
              title: 'Planificación',
              detail: 'Planifica y organiza tus metas a largo plazo. Tu visión está más clara.',
              icon: CheckCircle
            },
            {
              title: 'Decisiones',
              detail: 'Toma decisiones importantes durante esta fase. Tu juicio está más equilibrado.',
              icon: CheckCircle
            },
            {
              title: 'Networking',
              detail: 'Asiste a eventos profesionales o sociales. Tu carisma está aumentado.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Nutrición Energética',
          icon: Utensils,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          description: 'Alimentos que potencian tu energía y apoyan el crecimiento celular.',
          items: [
            {
              title: 'Proteínas Magras',
              detail: 'Consume pollo, pescado, tofu y legumbres para apoyar el crecimiento muscular.',
              icon: CheckCircle
            },
            {
              title: 'Grasas Saludables',
              detail: 'Incluye aguacate, nueces, semillas y aceite de oliva para la salud hormonal.',
              icon: CheckCircle
            },
            {
              title: 'Vegetales Verdes',
              detail: 'Come espinacas, kale y brócoli para obtener vitaminas y minerales esenciales.',
              icon: CheckCircle
            },
            {
              title: 'Dieta Equilibrada',
              detail: 'Mantén una dieta variada con todos los grupos alimenticios para energía sostenida.',
              icon: CheckCircle
            },
            {
              title: 'Hidratación',
              detail: 'Bebe al menos 2-3 litros de agua para optimizar tu energía y función cognitiva.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Intimidad Renovada',
          icon: Flame,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          description: 'Tu libido comienza a aumentar. Es momento de explorar y conectar.',
          items: [
            {
              title: 'Libido Creciente',
              detail: 'Tu deseo sexual comienza a aumentar gradualmente. Aprovecha esta energía.',
              icon: CheckCircle
            },
            {
              title: 'Nuevas Experiencias',
              detail: 'Es un buen momento para explorar nuevas experiencias con tu pareja.',
              icon: CheckCircle
            },
            {
              title: 'Comunicación',
              detail: 'Comunica tus deseos y fantasías a tu pareja. La confianza está en su punto máximo.',
              icon: CheckCircle
            },
            {
              title: 'Energía Física',
              detail: 'La energía física puede mejorar la experiencia sexual y la resistencia.',
              icon: CheckCircle
            },
            {
              title: 'Conexión Emocional',
              detail: 'Aprovecha para fortalecer la conexión emocional y física con tu pareja.',
              icon: CheckCircle
            }
          ]
        }
      ]
    },
    ovulation: {
      title: 'Ovulación',
      subtitle: 'Pico de energía y fertilidad',
      icon: Droplet,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-900',
      description: 'Estás en tu punto máximo de energía, confianza y fertilidad. ¡Aprovecha!',
      tips: [
        {
          category: 'Fertilidad y Concepción',
          icon: Heart,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          description: 'Estás en tu ventana fértil máxima. Información clave si planeas concebir.',
          items: [
            {
              title: 'Ventana Fértil',
              detail: 'Estás en tu ventana fértil máxima. Si planeas concebir, este es el momento ideal.',
              icon: CheckCircle
            },
            {
              title: 'Temperatura Basal',
              detail: 'La temperatura basal puede estar ligeramente elevada. Úsala como indicador.',
              icon: CheckCircle
            },
            {
              title: 'Flujo Cervical',
              detail: 'El flujo cervical es más elástico y claro, similar a clara de huevo. Signo de ovulación.',
              icon: CheckCircle
            },
            {
              title: 'Libido Máxima',
              detail: 'Puedes sentir un aumento significativo en la libido. Es una respuesta natural.',
              icon: CheckCircle
            },
            {
              title: 'Planificación',
              detail: 'Si no planeas concebir, usa protección adicional durante estos días.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Energía y Confianza',
          icon: Sparkles,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          description: 'Tu energía y confianza están en su punto máximo. Aprovecha para destacar.',
          items: [
            {
              title: 'Confidencia Máxima',
              detail: 'Tu energía y confianza están en su punto máximo. Aprovecha para destacar.',
              icon: CheckCircle
            },
            {
              title: 'Presentaciones',
              detail: 'Es el mejor momento para presentaciones, entrevistas o eventos importantes.',
              icon: CheckCircle
            },
            {
              title: 'Piel Radiante',
              detail: 'Tu piel puede verse más radiante y luminosa debido a los picos de estrógeno.',
              icon: CheckCircle
            },
            {
              title: 'Olfato Agudo',
              detail: 'El olfato está más agudo. Úsalo para disfrutar más de los aromas.',
              icon: CheckCircle
            },
            {
              title: 'Sociabilidad',
              detail: 'Te sientes más comunicativa y sociable. Es ideal para networking y eventos.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Nutrición Antioxidante',
          icon: Utensils,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          description: 'Alimentos ricos en antioxidantes para apoyar la ovulación y la salud.',
          items: [
            {
              title: 'Antioxidantes',
              detail: 'Consume bayas, granadas, té verde y cacao para combatir el estrés oxidativo.',
              icon: CheckCircle
            },
            {
              title: 'Grasas Saludables',
              detail: 'Incluye grasas saludables para apoyar la producción hormonal equilibrada.',
              icon: CheckCircle
            },
            {
              title: 'Frutas Frescas',
              detail: 'Come frutas y verduras frescas de temporada para máxima nutrición.',
              icon: CheckCircle
            },
            {
              title: 'Hidratación',
              detail: 'Mantén una buena hidratación para optimizar la función celular y hormonal.',
              icon: CheckCircle
            },
            {
              title: 'Evitar Procesados',
              detail: 'Evita alimentos procesados y azúcares refinados que pueden afectar la ovulación.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Intimidad Apasionada',
          icon: Flame,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          description: 'Tu libido está en su punto máximo. Momento ideal para intimidad.',
          items: [
            {
              title: 'Libido Máxima',
              detail: 'Tu libido está en su punto máximo. Es el momento ideal para intimidad con tu pareja.',
              icon: CheckCircle
            },
            {
              title: 'Sensibilidad',
              detail: 'La sensibilidad física está aumentada, lo que puede intensificar el placer.',
              icon: CheckCircle
            },
            {
              title: 'Comunicación',
              detail: 'Comunica claramente tus deseos y necesidades. La confianza está en su punto máximo.',
              icon: CheckCircle
            },
            {
              title: 'Experiencia',
              detail: 'Disfruta de la conexión emocional y física intensa con tu pareja.',
              icon: CheckCircle
            },
            {
              title: 'Exploración',
              detail: 'Es el momento ideal para explorar nuevas experiencias y fantasies con tu pareja.',
              icon: CheckCircle
            }
          ]
        }
      ]
    },
    luteal: {
      title: 'Fase Lútea',
      subtitle: 'Preparación y reflexión',
      icon: Moon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      description: 'Tu energía disminuye gradualmente. Es momento de prepararte y reflexionar.',
      tips: [
        {
          category: 'Síntomas PMS y Dolor',
          icon: Activity,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          description: 'Prepara el inicio de posibles síntomas PMS y maneja el malestar.',
          items: [
            {
              title: 'Preparación PMS',
              detail: 'Prepara el inicio de posibles síntomas PMS. Ten a mano tus remedios favoritos.',
              icon: CheckCircle
            },
            {
              title: 'Compresas Calientes',
              detail: 'Usa compresas calientes para cólicos y molestias abdominales.',
              icon: CheckCircle
            },
            {
              title: 'Magnesio',
              detail: 'Toma suplementos de magnesio si es necesario para reducir calambres y mejorar el sueño.',
              icon: CheckCircle
            },
            {
              title: 'Relajación',
              detail: 'Practica técnicas de relajación como yoga restaurativo o meditación.',
              icon: CheckCircle
            },
            {
              title: 'Registro de Síntomas',
              detail: 'Mantén un registro de tus síntomas para identificar patrones y anticipar necesidades.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Energía y Descanso',
          icon: Moon,
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-50',
          description: 'Tu energía disminuye. Prioriza el descanso y la recuperación.',
          items: [
            {
              title: 'Energía Disminuyendo',
              detail: 'Tu energía comienza a disminuir gradualmente. Acepta este cambio natural.',
              icon: CheckCircle
            },
            {
              title: 'Priorizar Descanso',
              detail: 'Prioriza el descanso y la recuperación. No te sobreexijas.',
              icon: CheckCircle
            },
            {
              title: 'Ejercicio Suave',
              detail: 'Reduce la intensidad de los ejercicios. Opta por caminatas, yoga o pilates.',
              icon: CheckCircle
            },
            {
              title: 'Más Sueño',
              detail: 'Duerme más para compensar la fatiga natural de esta fase.',
              icon: CheckCircle
            },
            {
              title: 'Evitar Agotamiento',
              detail: 'Evita compromisos sociales que te agoten. Es momento de introvertirse.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Nutrición Equilibradora',
          icon: Utensils,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          description: 'Alimentos que estabilizan el ánimo y reducen los síntomas PMS.',
          items: [
            {
              title: 'Carbohidratos Complejos',
              detail: 'Consume carbohidratos complejos para estabilizar el ánimo y reducir antojos.',
              icon: CheckCircle
            },
            {
              title: 'Triptófano',
              detail: 'Incluye alimentos ricos en triptófano como plátanos, nueces y pavo.',
              icon: CheckCircle
            },
            {
              title: 'Reducir Sodio',
              detail: 'Reduce el consumo de sal para minimizar la hinchazón y retención de líquidos.',
              icon: CheckCircle
            },
            {
              title: 'Chocolate Negro',
              detail: 'Come chocolate negro para mejorar el ánimo y reducir antojos de azúcar.',
              icon: CheckCircle
            },
            {
              title: 'Limitar Estimulantes',
              detail: 'Evita el exceso de azúcar y cafeína que pueden intensificar los síntomas PMS.',
              icon: CheckCircle
            }
          ]
        },
        {
          category: 'Intimidad Consciente',
          icon: Flame,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          description: 'La libido puede disminuir. Mantén la conexión de formas conscientes.',
          items: [
            {
              title: 'Libido Disminuyendo',
              detail: 'La libido puede disminuir gradualmente. Es completamente normal.',
              icon: CheckCircle
            },
            {
              title: 'Comunicación',
              detail: 'Comunica tus cambios a tu pareja para mantener la comprensión mutua.',
              icon: CheckCircle
            },
            {
              title: 'Intimidad Suave',
              detail: 'Explora formas de intimidad que no requieran mucho esfuerzo físico.',
              icon: CheckCircle
            },
            {
              title: 'Conexión Emocional',
              detail: 'Prioriza la conexión emocional sobre la física. Fortalece el vínculo afectivo.',
              icon: CheckCircle
            },
            {
              title: 'Sin Culpa',
              detail: 'No te sientas culpable por tener menos energía o deseo sexual.',
              icon: CheckCircle
            }
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
      <div className="space-y-6 pb-20">
        {/* Hero Section */}
        <div className={`${currentTips.bgColor} rounded-3xl p-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className={`${currentTips.color} p-4 rounded-2xl mr-4 shadow-lg`}>
                <Icon className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {currentTips.title}
                </h1>
                <p className={`text-lg ${currentTips.textColor} font-medium`}>
                  {currentTips.subtitle}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed mt-4">
              {currentTips.description}
            </p>

            <div className="flex items-center mt-6">
              <Star className="text-yellow-500 mr-2" size={20} />
              <span className="text-sm font-medium text-gray-700">
                Consejos personalizados para tu fase actual
              </span>
            </div>
          </div>
        </div>

        {/* Consejos por categoría */}
        {currentTips.tips.map((category, index) => {
          const CategoryIcon = category.icon;
          return (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm">
              <div className={`${category.bgColor} rounded-2xl p-4 mb-4`}>
                <div className="flex items-center">
                  <CategoryIcon className={`${category.color} mr-3`} size={28} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {category.category}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {category.items.map((tip, tipIndex) => {
                  const TipIcon = tip.icon;
                  return (
                    <div key={tipIndex} className="border-l-4 border-pink-200 pl-4 py-2">
                      <div className="flex items-start">
                        <TipIcon className="text-pink-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {tip.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {tip.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Nota informativa */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
          <div className="flex items-start">
            <Lightbulb className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Importante
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Estos consejos son generales y educativos. Consulta siempre con un profesional de salud para consejos personalizados según tu situación específica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tips;
