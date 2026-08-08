import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Lightbulb, Calendar, Droplets, Utensils, Sparkles } from 'lucide-react';
import { getProfile, getPartnerProfile, parseLocalDate } from '../utils/storage';
import { getCyclePhase, CYCLE_PHASES } from '../utils/cycleCalculations';
import { differenceInDays } from 'date-fns';
import Layout from '../components/Layout';

const ManTips = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
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
          
          // Los hombres usan connectedPartnerCode (código de la mujer)
          const partnerCodeToUse = savedProfile.connectedPartnerCode;
          
          // Cargar datos reales de la pareja usando el connectedPartnerCode
          if (partnerCodeToUse) {
            const partnerProfile = await getPartnerProfile(partnerCodeToUse);
            if (partnerProfile) {
              setPartnerData(partnerProfile);
              
              // Calcular fase actual
              const today = new Date();
              const phase = getCyclePhase(
                today,
                parseLocalDate(partnerProfile.last_period_start),
                partnerProfile.cycle_length,
                partnerProfile.period_length
              );
              setCurrentPhase(phase);
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

  const tipsByPhase = {
    [CYCLE_PHASES.MENSTRUATION]: {
      title: 'Menstruación',
      subtitle: 'Días de descanso y cuidado',
      color: 'from-red-500 to-pink-500',
      categories: [
        {
          icon: Heart,
          title: 'Apoyo Emocional',
          color: 'bg-red-100 text-red-600',
          tips: [
            { title: 'Sé paciente y comprensivo', description: 'Tu pareja puede estar más sensible. Escucha sus necesidades sin juzgar.' },
            { title: 'Ofrece descanso', description: 'Ayuda con tareas domésticas para que pueda descansar más.' },
            { title: 'Mimos y caricias', description: 'El contacto físico suave puede ayudar a aliviar el malestar.' }
          ]
        },
        {
          icon: Droplets,
          title: 'Alivio del Dolor',
          color: 'bg-pink-100 text-pink-600',
          tips: [
            { title: 'Compresas calientes', description: 'Prepara compresas calientes para el abdomen o espalda baja.' },
            { title: 'Masajes suaves', description: 'Masajes en la zona lumbar pueden ayudar con el dolor.' },
            { title: 'Té de hierbas', description: 'Prepara té de manzanilla o jengibre que ayuda con el dolor.' }
          ]
        },
        {
          icon: Utensils,
          title: 'Nutrición',
          color: 'bg-orange-100 text-orange-600',
          tips: [
            { title: 'Alimentos ricos en hierro', description: 'Espinales, lentejas y carnes rojas ayudan a reponer hierro.' },
            { title: 'Hidratación', description: 'Asegúrate de que beba suficiente agua durante estos días.' },
            { title: 'Chocolate negro', description: 'Un poco de chocolate negro puede mejorar el ánimo.' }
          ]
        },
        {
          icon: Sparkles,
          title: 'Intimidad',
          color: 'bg-purple-100 text-purple-600',
          tips: [
            { title: 'Respeto al espacio', description: 'Respeta si no desea intimidad física durante estos días.' },
            { title: 'Tiempo de calidad', description: 'Pasa tiempo juntos sin presión, viendo una película o leyendo.' },
            { title: 'Comunicación', description: 'Pregunta qué necesita y cómo puedes apoyarla mejor.' }
          ]
        }
      ]
    },
    [CYCLE_PHASES.FOLLICULAR]: {
      title: 'Fase Folicular',
      subtitle: 'Energía en aumento',
      color: 'from-green-500 to-emerald-500',
      categories: [
        {
          icon: Heart,
          title: 'Apoyo Emocional',
          color: 'bg-green-100 text-green-600',
          tips: [
            { title: 'Planes activos', description: 'Es buen momento para actividades físicas juntos.' },
            { title: 'Proyectos nuevos', description: 'Su energía es ideal para iniciar nuevos proyectos o planes.' },
            { title: 'Socialización', description: 'Aprovechen para salir con amigos o hacer planes sociales.' }
          ]
        },
        {
          icon: Calendar,
          title: 'Actividades',
          color: 'bg-emerald-100 text-emerald-600',
          tips: [
            { title: 'Ejercicio juntos', description: 'Caminar, correr o hacer yoga juntos es excelente.' },
            { title: 'Nuevas experiencias', description: 'Prueben actividades nuevas que ambos disfruten.' },
            { title: 'Planeación', description: 'Es buen momento para planificar viajes o eventos futuros.' }
          ]
        },
        {
          icon: Utensils,
          title: 'Nutrición',
          color: 'bg-teal-100 text-teal-600',
          tips: [
            { title: 'Proteínas', description: 'Incluye más proteínas para apoyar la energía creciente.' },
            { title: 'Vegetales frescos', description: 'Ensaladas y vegetales crudos son ideales en esta fase.' },
            { title: 'Vitaminas B', description: 'Alimentos ricos en vitaminas B ayudan con la energía.' }
          ]
        },
        {
          icon: Sparkles,
          title: 'Intimidad',
          color: 'bg-lime-100 text-lime-600',
          tips: [
            { title: 'Mayor libido', description: 'La libido suele aumentar en esta fase.' },
            { title: 'Momentos especiales', description: 'Aprovechen para momentos románticos y especiales.' },
            { title: 'Comunicación abierta', description: 'Hablen sobre sus deseos y expectativas.' }
          ]
        }
      ]
    },
    [CYCLE_PHASES.OVULATION]: {
      title: 'Ovulación',
      subtitle: 'Pico de energía y confianza',
      color: 'from-purple-500 to-violet-500',
      categories: [
        {
          icon: Heart,
          title: 'Apoyo Emocional',
          color: 'bg-purple-100 text-purple-600',
          tips: [
            { title: 'Celebra su energía', description: 'Aprovecha su energía positiva y confianza.' },
            { title: 'Planes especiales', description: 'Es el momento perfecto para citas románticas.' },
            { title: 'Apoyo en metas', description: 'Apóyala en proyectos que requiera confianza.' }
          ]
        },
        {
          icon: Calendar,
          title: 'Actividades',
          color: 'bg-violet-100 text-violet-600',
          tips: [
            { title: 'Eventos sociales', description: 'Es excelente para eventos sociales y reuniones.' },
            { title: 'Deportes', description: 'Su rendimiento físico está en su punto máximo.' },
            { title: 'Presentaciones', description: 'Buen momento para presentaciones o hablar en público.' }
          ]
        },
        {
          icon: Utensils,
          title: 'Nutrición',
          color: 'bg-fuchsia-100 text-fuchsia-600',
          tips: [
            { title: 'Antioxidantes', description: 'Frutas y vegetales ricos en antioxidantes.' },
            { title: 'Grasas saludables', description: 'Aguacate, nueces y aceite de oliva son ideales.' },
            { title: 'Proteínas magras', description: 'Pescado y pollo son excelentes opciones.' }
          ]
        },
        {
          icon: Sparkles,
          title: 'Intimidad',
          color: 'bg-pink-100 text-pink-600',
          tips: [
            { title: 'Libido máxima', description: 'La libido está en su punto más alto.' },
            { title: 'Conexión profunda', description: 'Momentos de intimidad pueden ser muy especiales.' },
            { title: 'Romance', description: 'Gestos románticos son especialmente apreciados.' }
          ]
        }
      ]
    },
    [CYCLE_PHASES.LUTEAL]: {
      title: 'Fase Lútea',
      subtitle: 'Preparación y reflexión',
      color: 'from-yellow-500 to-amber-500',
      categories: [
        {
          icon: Heart,
          title: 'Apoyo Emocional',
          color: 'bg-yellow-100 text-yellow-600',
          tips: [
            { title: 'Paciencia extra', description: 'Puede haber cambios de humor. Sé paciente.' },
            { title: 'Escucha activa', description: 'Escucha sus preocupaciones sin intentar "arreglar" todo.' },
            { title: 'Validación', description: 'Valida sus sentimientos, incluso si no los entiendes.' }
          ]
        },
        {
          icon: Calendar,
          title: 'Actividades',
          color: 'bg-amber-100 text-amber-600',
          tips: [
            { title: 'Actividades tranquilas', description: 'Prefiere actividades más relajadas y en casa.' },
            { title: 'Organización', description: 'Buen momento para organizar y planificar.' },
            { title: 'Reflexión', description: 'Es un buen momento para reflexionar sobre el mes.' }
          ]
        },
        {
          icon: Utensils,
          title: 'Nutrición',
          color: 'bg-orange-100 text-orange-600',
          tips: [
            { title: 'Carbohidratos complejos', description: 'Avena, arroz integral y legumbres ayudan con el ánimo.' },
            { title: 'Magnesio', description: 'Nueces, semillas y chocolate oscuro tienen magnesio.' },
            { title: 'Evita cafeína', description: 'Reduce el consumo de cafeína que puede aumentar ansiedad.' }
          ]
        },
        {
          icon: Sparkles,
          title: 'Intimidad',
          color: 'bg-rose-100 text-rose-600',
          tips: [
            { title: 'Comodidad', description: 'Prefiere actividades más cómodas y relajantes.' },
            { title: 'Contacto no sexual', description: 'Abrazos y caricias son muy apreciados.' },
            { title: 'Comunicación', description: 'Habla sobre cómo se siente y qué necesita.' }
          ]
        }
      ]
    }
  };

  if (loading) {
    return (
      <Layout showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando consejos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showSettings={false}>
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

  if (!profile || !partnerData || !currentPhase) {
    return (
      <Layout showSettings={false}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p className="text-gray-600">No se pudieron cargar los datos.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentTips = tipsByPhase[currentPhase];

  return (
    <Layout showSettings={false}>
      <div className="space-y-6">
            {/* Hero Section */}
            <div className={`bg-gradient-to-r ${currentTips.color} rounded-3xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Lightbulb size={40} />
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {partnerData.name}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {currentTips.title}
              </h2>
              <p className="text-white/80 mb-4">
                {currentTips.subtitle}
              </p>
              <p className="text-sm text-white/70">
                Estos consejos te ayudarán a apoyar a tu pareja durante esta fase de su ciclo.
              </p>
            </div>

            {/* Categorías de consejos */}
            {currentTips.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl mr-3 ${category.color}`}>
                    <category.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="border-l-4 border-pink-300 pl-4 py-2">
                      <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Nota informativa */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start">
                <Lightbulb className="text-yellow-300 mr-3 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-white mb-2">Recuerda</h3>
                  <p className="text-sm text-white/90">
                    Cada mujer es diferente. Estos consejos son generales y pueden no aplicarse a todas. 
                    Lo más importante es comunicarte con tu pareja y preguntarle qué necesita en cada momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      );
    }

export default ManTips;
