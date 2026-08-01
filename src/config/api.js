// Configuración centralizada de API
// URL del backend
export const API_BASE_URL = 'https://al.codeclandresell.com/backend';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Perfil
  SAVE_PROFILE: '/save_profile.php',
  GET_PROFILE: '/get_profile.php',
  GET_PARTNER_PROFILE: '/get_partner_profile.php',
  
  // Periodos
  SAVE_PERIOD: '/save_period.php',
  SAVE_PERIODS_BULK: '/save_periods_bulk.php',
  GET_PERIODS: '/get_periods.php',
  
  // Síntomas
  SAVE_SYMPTOM: '/save_symptom.php',
  SAVE_SYMPTOMS_BULK: '/save_symptoms_bulk.php',
  GET_SYMPTOMS: '/get_symptoms.php',
  GET_PARTNER_SYMPTOMS: '/get_partner_symptoms.php',
  
  // Sincronización de pareja
  PARTNER_SYNC: '/partner_sync.php',
};

// Función helper para hacer peticiones a la API
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
