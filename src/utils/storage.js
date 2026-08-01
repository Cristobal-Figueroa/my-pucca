// Sistema de localStorage para guardar datos de la app

const STORAGE_KEYS = {
  PROFILE: 'pucca_profile',
  PERIODS: 'pucca_periods',
  SYMPTOMS: 'pucca_symptoms',
};

// Perfil del usuario
export const saveProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

export const getProfile = () => {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
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
export const savePeriods = (periods) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(periods));
    return true;
  } catch (error) {
    console.error('Error saving periods:', error);
    return false;
  }
};

export const getPeriods = () => {
  try {
    const periods = localStorage.getItem(STORAGE_KEYS.PERIODS);
    return periods ? JSON.parse(periods) : [];
  } catch (error) {
    console.error('Error getting periods:', error);
    return [];
  }
};

export const addPeriod = (period) => {
  try {
    const periods = getPeriods();
    periods.push(period);
    savePeriods(periods);
    return true;
  } catch (error) {
    console.error('Error adding period:', error);
    return false;
  }
};

export const updatePeriod = (periodId, updatedPeriod) => {
  try {
    const periods = getPeriods();
    const index = periods.findIndex(p => p.id === periodId);
    if (index !== -1) {
      periods[index] = updatedPeriod;
      savePeriods(periods);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating period:', error);
    return false;
  }
};

export const deletePeriod = (periodId) => {
  try {
    const periods = getPeriods();
    const filteredPeriods = periods.filter(p => p.id !== periodId);
    savePeriods(filteredPeriods);
    return true;
  } catch (error) {
    console.error('Error deleting period:', error);
    return false;
  }
};

// Síntomas
export const saveSymptoms = (symptoms) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(symptoms));
    return true;
  } catch (error) {
    console.error('Error saving symptoms:', error);
    return false;
  }
};

export const getSymptoms = () => {
  try {
    const symptoms = localStorage.getItem(STORAGE_KEYS.SYMPTOMS);
    return symptoms ? JSON.parse(symptoms) : [];
  } catch (error) {
    console.error('Error getting symptoms:', error);
    return [];
  }
};

export const addSymptom = (symptom) => {
  try {
    const symptoms = getSymptoms();
    symptoms.push(symptom);
    saveSymptoms(symptoms);
    return true;
  } catch (error) {
    console.error('Error adding symptom:', error);
    return false;
  }
};

export const updateSymptom = (symptomId, updatedSymptom) => {
  try {
    const symptoms = getSymptoms();
    const index = symptoms.findIndex(s => s.id === symptomId);
    if (index !== -1) {
      symptoms[index] = updatedSymptom;
      saveSymptoms(symptoms);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating symptom:', error);
    return false;
  }
};

export const deleteSymptom = (symptomId) => {
  try {
    const symptoms = getSymptoms();
    const filteredSymptoms = symptoms.filter(s => s.id !== symptomId);
    saveSymptoms(filteredSymptoms);
    return true;
  } catch (error) {
    console.error('Error deleting symptom:', error);
    return false;
  }
};

// Obtener síntomas por fecha
export const getSymptomsByDate = (date) => {
  try {
    const symptoms = getSymptoms();
    const dateStr = date.toISOString().split('T')[0];
    return symptoms.filter(s => s.date === dateStr);
  } catch (error) {
    console.error('Error getting symptoms by date:', error);
    return [];
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
