// Sistema de storage para guardar datos de la app (localStorage + backend)
import { API_BASE_URL, API_ENDPOINTS, apiRequest } from '../config/api';

// Exportar apiRequest para usarlo en otros componentes
export { apiRequest };

const STORAGE_KEYS = {
  PROFILE: 'pucca_profile',
  USER_ID: 'pucca_user_id',
  PERIODS: 'pucca_periods',
  SYMPTOMS: 'pucca_symptoms',
};

// Perfil del usuario
export const saveProfile = async (profile) => {
  try {
    // Guardar en localStorage como backup
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    
    // Guardar user_id por separado
    if (profile.user_id) {
      localStorage.setItem(STORAGE_KEYS.USER_ID, profile.user_id);
    }
    
    // Convertir a formato snake_case para el backend
    const backendProfile = {
      user_id: profile.user_id,
      name: profile.name,
      cycle_length: profile.cycleLength || profile.cycle_length || 28,
      period_length: profile.periodLength || profile.period_length || 5,
      last_period_start: profile.lastPeriodStart || profile.last_period_start || '',
      gender: profile.gender,
      partner_code: profile.partnerCode || profile.partner_code || null
    };
    
    // Enviar al backend
    const response = await apiRequest(API_ENDPOINTS.SAVE_PROFILE, {
      method: 'POST',
      body: JSON.stringify(backendProfile)
    });
    
    if (response.success) {
      // Si el backend generó un partner_code, actualizar el perfil local
      if (response.partner_code) {
        profile.partnerCode = response.partner_code;
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving profile:', error);
    // Si falla el backend, al menos está en localStorage
    return true;
  }
};

export const getProfile = async () => {
  try {
    // Primero intentar del localStorage
    const localProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (localProfile) {
      return JSON.parse(localProfile);
    }
    
    // Si no hay en localStorage, intentar del backend
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId) {
      const response = await apiRequest(`${API_ENDPOINTS.GET_PROFILE}?user_id=${userId}`);
      if (response.success && response.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(response.profile));
        return response.profile;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting profile:', error);
    // Fallback a localStorage
    const localProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return localProfile ? JSON.parse(localProfile) : null;
  }
};

// Función auxiliar para parsear fechas como fecha local (no UTC)
export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  // Si es YYYY-MM-DD, parsear como fecha local
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  // Si no, usar el parseo normal
  return new Date(dateString);
};

export const deleteProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
};

// Periodos - ya no se guardan en localStorage, solo en DB
export const savePeriods = async (periods) => {
  try {
    // Solo guardar en DB, no en localStorage
    return await savePeriodsToDB(periods);
  } catch (error) {
    console.error('Error saving periods:', error);
    return false;
  }
};

// Guardar periodos en DB (bulk)
export const savePeriodsToDB = async (periods) => {
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;
    
    const response = await apiRequest(API_ENDPOINTS.SAVE_PERIODS_BULK, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        periods: periods
      })
    });
    
    return response.success;
  } catch (error) {
    return false;
  }
};

export const getPeriods = async () => {
  try {
    // Obtener periodos desde DB
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return [];

    const response = await apiRequest(`${API_ENDPOINTS.GET_PERIODS}?user_id=${userId}`);
    if (response.success && response.periods) {
      return response.periods;
    }
    return [];
  } catch (error) {
    console.error('Error getting periods:', error);
    return [];
  }
};

export const addPeriod = async (period) => {
  try {
    // Solo enviar al backend, no usar localStorage
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;

    await apiRequest(API_ENDPOINTS.SAVE_PERIOD, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        date: period.date,
        notes: period.notes || ''
      })
    });

    return true;
  } catch (error) {
    console.error('Error adding period:', error);
    return false;
  }
};

export const updatePeriod = async (periodId, updatedPeriod) => {
  try {
    // Solo enviar al backend, no usar localStorage
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;

    await apiRequest(API_ENDPOINTS.SAVE_PERIOD, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        date: updatedPeriod.date,
        notes: updatedPeriod.notes || ''
      })
    });

    return true;
  } catch (error) {
    console.error('Error updating period:', error);
    return false;
  }
};

export const deletePeriod = async (periodId) => {
  try {
    // Nota: No hay endpoint para eliminar periodos en el backend
    // Se maneja actualizando el registro con notas vacías o similar si es necesario
    // Por ahora, solo retornamos true
    return true;
  } catch (error) {
    console.error('Error deleting period:', error);
    return false;
  }
};

// Síntomas - ya no se guardan en localStorage, solo en DB
export const saveSymptoms = async (symptoms) => {
  try {
    // Solo guardar en DB, no en localStorage
    return await saveSymptomsToDB(symptoms);
  } catch (error) {
    console.error('Error saving symptoms:', error);
    return false;
  }
};

// Guardar síntomas en DB (bulk)
export const saveSymptomsToDB = async (symptoms) => {
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;
    
    const response = await apiRequest(API_ENDPOINTS.SAVE_SYMPTOMS_BULK, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        symptoms: symptoms
      })
    });
    
    return response.success;
  } catch (error) {
    return false;
  }
};

export const getSymptoms = async () => {
  try {
    // Obtener síntomas desde DB
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return [];

    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${userId}`);
    if (response.success && response.symptoms) {
      return response.symptoms;
    }
    return [];
  } catch (error) {
    console.error('Error getting symptoms:', error);
    return [];
  }
};

export const addSymptom = async (symptom) => {
  try {
    // Solo enviar al backend, no usar localStorage
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;

    await apiRequest(API_ENDPOINTS.SAVE_SYMPTOM, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        date: symptom.date,
        mood: symptom.mood || null,
        libido: symptom.libido || null,
        cravings: symptom.cravings || null,
        energy: symptom.energy || null,
        sleep: symptom.sleep || null,
        pain: symptom.pain || null,
        skin: symptom.skin || null,
        digestion: symptom.digestion || null,
        headache: symptom.headache || null,
        notes: symptom.notes || ''
      })
    });

    return true;
  } catch (error) {
    console.error('Error adding symptom:', error);
    return false;
  }
};

export const updateSymptom = async (symptomId, updatedSymptom) => {
  try {
    // Solo enviar al backend, no usar localStorage
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;

    await apiRequest(API_ENDPOINTS.SAVE_SYMPTOM, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        date: updatedSymptom.date,
        mood: updatedSymptom.mood || null,
        libido: updatedSymptom.libido || null,
        cravings: updatedSymptom.cravings || null,
        energy: updatedSymptom.energy || null,
        sleep: updatedSymptom.sleep || null,
        pain: updatedSymptom.pain || null,
        skin: updatedSymptom.skin || null,
        digestion: updatedSymptom.digestion || null,
        headache: updatedSymptom.headache || null,
        notes: updatedSymptom.notes || ''
      })
    });

    return true;
  } catch (error) {
    console.error('Error updating symptom:', error);
    return false;
  }
};

export const deleteSymptom = async (symptomId) => {
  try {
    // Nota: No hay endpoint para eliminar síntomas en el backend
    // Se maneja actualizando el registro con valores null si es necesario
    // Por ahora, solo retornamos true
    return true;
  } catch (error) {
    console.error('Error deleting symptom:', error);
    return false;
  }
};

// Obtener síntomas por fecha desde DB
export const getSymptomsByDate = async (date) => {
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return [];

    // Usar fecha local para evitar problemas de zona horaria
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${userId}&date=${dateStr}`);
    if (response.success && response.symptoms) {
      return response.symptoms;
    }
    return [];
  } catch (error) {
    console.error('Error getting symptoms by date:', error);
    return [];
  }
};

// Obtener todos los síntomas del usuario desde DB
export const getAllSymptoms = async () => {
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return [];

    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${userId}`);
    if (response.success && response.symptoms) {
      return response.symptoms;
    }
    return [];
  } catch (error) {
    console.error('Error getting all symptoms:', error);
    return [];
  }
};

// Obtener perfil de la pareja por código
export const getPartnerProfile = async (partnerCode) => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_PARTNER_PROFILE}?partner_code=${partnerCode}`);
    if (response.success && response.profile) {
      return response.profile;
    }
    return null;
  } catch (error) {
    console.error('Error getting partner profile:', error);
    return null;
  }
};

// Obtener síntomas de la pareja por fecha
export const getPartnerSymptomsByDate = async (partnerCode, date) => {
  try {
    // Usar fecha local para evitar problemas de zona horaria
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const response = await apiRequest(`${API_ENDPOINTS.GET_PARTNER_SYMPTOMS}?partner_code=${partnerCode}&date=${dateStr}`);
    if (response.success && response.symptom) {
      return response.symptom;
    }
    return null;
  } catch (error) {
    console.error('Error getting partner symptoms:', error);
    return null;
  }
};

// Obtener todos los síntomas de la pareja
export const getPartnerAllSymptoms = async (partnerCode) => {
  try {
    // Primero obtener el user_id de la pareja
    const partnerProfile = await getPartnerProfile(partnerCode);
    if (!partnerProfile || !partnerProfile.user_id) {
      return [];
    }

    // Usar el endpoint existente get_symptoms con el user_id de la pareja
    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${partnerProfile.user_id}`);
    if (response.success && response.symptoms) {
      return response.symptoms;
    }
    return [];
  } catch (error) {
    console.error('Error getting all partner symptoms:', error);
    return [];
  }
};

// Sincronizar pareja bidireccionalmente
export const syncPartner = async (partnerCode) => {
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) return false;
    
    const response = await apiRequest(API_ENDPOINTS.PARTNER_SYNC, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        partner_code: partnerCode
      })
    });
    
    if (response.success) {
      // Actualizar el perfil local con el código de la pareja conectada
      const profile = await getProfile();
      if (profile) {
        const updatedProfile = {
          ...profile,
          connectedPartnerCode: response.man_partner_code
        };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
      }
    }
    
    return response.success;
  } catch (error) {
    console.error('Error syncing partner:', error);
    return false;
  }
};

// Limpiar todos los datos
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.PERIODS);
    localStorage.removeItem(STORAGE_KEYS.SYMPTOMS);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
