// Sistema directo a DB - sin localStorage (excepto user_id para sesión)
import { API_BASE_URL, API_ENDPOINTS, apiRequest } from '../config/api';

export { apiRequest };

const USER_ID_KEY = 'pucca_user_id';

// Función helper para obtener fecha local actual en formato YYYY-MM-DD
export const getLocalTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Guardar user_id para sesión
export const setUserId = (userId) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const clearUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.clear();
};

// Perfil - directo a DB
export const saveProfile = async (profile) => {
  if (profile.user_id) setUserId(profile.user_id);
  
  const backendProfile = {
    user_id: profile.user_id,
    name: profile.name,
    cycle_length: profile.cycleLength || 28,
    period_length: profile.periodLength || 5,
    last_period_start: profile.lastPeriodStart || '',
    gender: profile.gender,
    partner_code: profile.gender === 'man' ? null : (profile.partnerCode || null),
    connected_partner_code: profile.connectedPartnerCode || null
  };
  
  const response = await apiRequest(API_ENDPOINTS.SAVE_PROFILE, {
    method: 'POST',
    body: JSON.stringify(backendProfile)
  });
  
  return response.success;
};

export const getProfile = async () => {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_PROFILE}?user_id=${userId}`);
    if (response.success && response.profile) {
      return {
        user_id: response.profile.user_id,
        name: response.profile.name,
        email: response.profile.email,
        cycleLength: response.profile.cycle_length,
        periodLength: response.profile.period_length,
        lastPeriodStart: response.profile.last_period_start,
        gender: response.profile.gender,
        partnerCode: response.profile.partner_code,
        connectedPartnerCode: response.profile.connected_partner_code
      };
    }
  } catch (error) {
    if (error.message?.includes('404')) clearUserId();
  }
  return null;
};

export const parseLocalDate = (dateString) => {
  if (!dateString) return null;
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
};

// Periodos - directo a DB
export const getPeriods = async () => {
  const userId = getUserId();
  if (!userId) return [];
  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_PERIODS}?user_id=${userId}`);
    return response.success && response.periods ? response.periods : [];
  } catch { return []; }
};

export const addPeriod = async (period) => {
  const userId = getUserId();
  if (!userId) return false;
  try {
    await apiRequest(API_ENDPOINTS.SAVE_PERIOD, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, date: period.date, notes: period.notes || '' })
    });
    return true;
  } catch { return false; }
};

// Síntomas - directo a DB
export const getSymptoms = async () => {
  const userId = getUserId();
  if (!userId) return [];
  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${userId}`);
    return response.success && response.symptoms ? response.symptoms : [];
  } catch { return []; }
};

export const getSymptomsByDate = async (date) => {
  const userId = getUserId();
  if (!userId) return [];
  try {
    // Si date es un string en formato YYYY-MM-DD, usarlo directamente
    // Si es un objeto Date, convertirlo correctamente evitando problemas de zona horaria
    let dateStr;
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateStr = date;
    } else {
      // Convertir Date a string local sin problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }
    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${userId}&date=${dateStr}`);
    return response.success && response.symptom ? [response.symptom] : [];
  } catch (error) {
    console.error('getSymptomsByDate - error:', error);
    return [];
  }
};

export const addSymptom = async (symptom) => {
  const userId = getUserId();
  if (!userId) return false;
  try {
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
  } catch { return false; }
};

export const deleteSymptom = async () => true;

// Pareja - directo a DB
export const getPartnerProfile = async (partnerCode) => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_PARTNER_PROFILE}?partner_code=${partnerCode}`);
    return response.success && response.profile ? response.profile : null;
  } catch { return null; }
};

export const getPartnerProfileByUserId = async (userId) => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_PROFILE}?user_id=${userId}`);
    return response.success && response.profile ? response.profile : null;
  } catch { return null; }
};

export const getPartnerAllSymptoms = async (partnerCode) => {
  try {
    const partnerProfile = await getPartnerProfile(partnerCode);
    if (!partnerProfile?.user_id) return [];
    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${partnerProfile.user_id}`);
    return response.success && response.symptoms ? response.symptoms : [];
  } catch { return []; }
};

export const getSymptomsByUserId = async (userId) => {
  try {
    const response = await apiRequest(`${API_ENDPOINTS.GET_SYMPTOMS}?user_id=${userId}`);
    return response.success && response.symptoms ? response.symptoms : [];
  } catch { return []; }
};

export const syncPartner = async (partnerCode) => {
  const userId = getUserId();
  if (!userId) return false;
  try {
    const response = await apiRequest(API_ENDPOINTS.PARTNER_SYNC, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, partner_code: partnerCode })
    });
    return response.success;
  } catch { return false; }
};

export const clearAllData = () => clearUserId();
