// Configuración centralizada de API
// Para conectar con backend, cambiar esta URL según sea necesario
export const API_BASE_URL = 'http://localhost:8000';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Perfil
  GET_PROFILE: '/api/profile',
  UPDATE_PROFILE: '/api/profile',
  
  // Ciclo menstrual
  GET_CYCLE: '/api/cycle',
  UPDATE_CYCLE: '/api/cycle',
  GET_PERIODS: '/api/periods',
  ADD_PERIOD: '/api/periods',
  UPDATE_PERIOD: '/api/periods',
  DELETE_PERIOD: '/api/periods',
  
  // Síntomas
  GET_SYMPTOMS: '/api/symptoms',
  ADD_SYMPTOM: '/api/symptoms',
  UPDATE_SYMPTOM: '/api/symptoms',
  DELETE_SYMPTOM: '/api/symptoms',
  
  // Predicciones
  GET_PREDICTIONS: '/api/predictions',
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
