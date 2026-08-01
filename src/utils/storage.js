// Sistema de storage para guardar datos de la app (localStorage + backend)
import { API_BASE_URL, API_ENDPOINTS, apiRequest } from '../config/api';

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
    
    return response.success;
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

// Periodos
export const savePeriods = async (periods) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(periods));
    return true;
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
    const periods = localStorage.getItem(STORAGE_KEYS.PERIODS);
    return periods ? JSON.parse(periods) : [];
  } catch (error) {
    console.error('Error getting periods:', error);
    return [];
  }
};

export const addPeriod = async (period) => {
  try {
    const periods = await getPeriods();
    periods.push(period);
    await savePeriods(periods);
    
    // Enviar al backend
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId) {
      await apiRequest(API_ENDPOINTS.SAVE_PERIOD, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          date: period.date,
          notes: period.notes || ''
        })
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error adding period:', error);
    return false;
  }
};

export const updatePeriod = async (periodId, updatedPeriod) => {
  try {
    const periods = await getPeriods();
    const index = periods.findIndex(p => p.id === periodId);
    if (index !== -1) {
      periods[index] = updatedPeriod;
      await savePeriods(periods);
      
      // Enviar al backend
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (userId) {
        await apiRequest(API_ENDPOINTS.SAVE_PERIOD, {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            date: updatedPeriod.date,
            notes: updatedPeriod.notes || ''
          })
        });
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating period:', error);
    return false;
  }
};

export const deletePeriod = async (periodId) => {
  try {
    const periods = await getPeriods();
    const periodToDelete = periods.find(p => p.id === periodId);
    const filteredPeriods = periods.filter(p => p.id !== periodId);
    await savePeriods(filteredPeriods);
    
    // Nota: No hay endpoint para eliminar periodos en el backend
    // Se maneja actualizando el registro con notas vacías o similar si es necesario
    
    return true;
  } catch (error) {
    console.error('Error deleting period:', error);
    return false;
  }
};

// Síntomas
export const saveSymptoms = async (symptoms) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(symptoms));
    return true;
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
    const symptoms = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
    return symptoms ? JSON.parse(symptoms) : [];
  } catch (error) {
    console.error('Error getting symptoms:', error);
    return [];
  }
};

export const addSymptom = async (symptom) => {
  try {
    const symptoms = await getSymptoms();
    symptoms.push(symptom);
    await saveSymptoms(symptoms);
    
    // Enviar al backend
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId) {
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
    }
    
    return true;
  } catch (error) {
    console.error('Error adding symptom:', error);
    return false;
  }
};

export const updateSymptom = async (symptomId, updatedSymptom) => {
  try {
    const symptoms = await getSymptoms();
    const index = symptoms.findIndex(s => s.id === symptomId);
    if (index !== -1) {
      symptoms[index] = updatedSymptom;
      await saveSymptoms(symptoms);
      
      // Enviar al backend
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (userId) {
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
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating symptom:', error);
    return false;
  }
};

export const deleteSymptom = async (symptomId) => {
  try {
    const symptoms = await getSymptoms();
    const filteredSymptoms = symptoms.filter(s => s.id !== symptomId);
    await saveSymptoms(filteredSymptoms);
    
    // Nota: No hay endpoint para eliminar síntomas en el backend
    // Se maneja actualizando el registro con valores null si es necesario
    
    return true;
  } catch (error) {
    console.error('Error deleting symptom:', error);
    return false;
  }
};

// Obtener síntomas por fecha
export const getSymptomsByDate = async (date) => {
  try {
    const symptoms = await getSymptoms();
    const dateStr = date.toISOString().split('T')[0];
    return symptoms.filter(s => s.date === dateStr);
  } catch (error) {
    console.error('Error getting symptoms by date:', error);
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
    const dateStr = date.toISOString().split('T')[0];
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

// Limpiar todos los datos
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PERIODS);
    localStorage.removeItem(STORAGE_KEYS.SYMPTOMS);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
