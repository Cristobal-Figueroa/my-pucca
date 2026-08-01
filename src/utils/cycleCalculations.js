import { addDays, subDays, differenceInDays, format, isSameDay, isBefore, isAfter } from 'date-fns';

// Fases del ciclo menstrual
export const CYCLE_PHASES = {
  MENSTRUATION: 'menstruation',
  FOLLICULAR: 'follicular',
  OVULATION: 'ovulation',
  LUTEAL: 'luteal',
};

// Calcular la fecha de ovulación basada en el último periodo
export const calculateOvulationDate = (lastPeriodStart, cycleLength) => {
  const ovulationDay = cycleLength - 14;
  return addDays(lastPeriodStart, ovulationDay);
};

// Calcular la ventana fértil (5 días antes de la ovulación hasta 1 día después)
export const calculateFertileWindow = (ovulationDate) => {
  const fertileStart = subDays(ovulationDate, 5);
  const fertileEnd = addDays(ovulationDate, 1);
  return { start: fertileStart, end: fertileEnd };
};

// Calcular la fecha del próximo periodo
export const calculateNextPeriod = (lastPeriodStart, cycleLength) => {
  return addDays(lastPeriodStart, cycleLength);
};

// Determinar en qué fase del ciclo está una fecha específica
export const getCyclePhase = (date, lastPeriodStart, cycleLength, periodLength) => {
  const daysSinceLastPeriod = differenceInDays(date, lastPeriodStart);
  const ovulationDate = calculateOvulationDate(lastPeriodStart, cycleLength);
  const fertileWindow = calculateFertileWindow(ovulationDate);
  const nextPeriod = calculateNextPeriod(lastPeriodStart, cycleLength);

  // Fase menstrual (días 1-5 del ciclo, o según duración del periodo)
  if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < periodLength) {
    return CYCLE_PHASES.MENSTRUATION;
  }

  // Ventana fértil y ovulación
  if (isSameDay(date, ovulationDate)) {
    return CYCLE_PHASES.OVULATION;
  }

  if ((isAfter(date, fertileWindow.start) || isSameDay(date, fertileWindow.start)) &&
      (isBefore(date, fertileWindow.end) || isSameDay(date, fertileWindow.end))) {
    return CYCLE_PHASES.OVULATION;
  }

  // Fase folicular (después del periodo hasta antes de la ovulación)
  if (daysSinceLastPeriod >= periodLength && daysSinceLastPeriod < (cycleLength - 14)) {
    return CYCLE_PHASES.FOLLICULAR;
  }

  // Fase lútea (después de la ovulación hasta el próximo periodo)
  if (daysSinceLastPeriod >= (cycleLength - 14) && daysSinceLastPeriod < cycleLength) {
    return CYCLE_PHASES.LUTEAL;
  }

  // Si está más allá del ciclo actual, calcular fase relativa al próximo ciclo
  const daysIntoCycle = daysSinceLastPeriod % cycleLength;
  
  if (daysIntoCycle < periodLength) {
    return CYCLE_PHASES.MENSTRUATION;
  } else if (daysIntoCycle < (cycleLength - 14)) {
    return CYCLE_PHASES.FOLLICULAR;
  } else {
    return CYCLE_PHASES.LUTEAL;
  }
};

// Obtener información de la fase actual
export const getPhaseInfo = (phase) => {
  const phaseInfo = {
    [CYCLE_PHASES.MENSTRUATION]: {
      name: 'Menstruación',
      description: 'Tu cuerpo está liberando el revestimiento uterino',
      color: 'bg-red-500',
      icon: '🩸',
      tips: ['Descansa cuando lo necesites', 'Mantente hidratada', 'Usa calor para aliviar cólicos']
    },
    [CYCLE_PHASES.FOLLICULAR]: {
      name: 'Fase Folicular',
      description: 'Tu energía está aumentando',
      color: 'bg-green-400',
      icon: '🌱',
      tips: ['Buen momento para ejercicio', 'Inicia nuevos proyectos', 'Aprovecha tu energía']
    },
    [CYCLE_PHASES.OVULATION]: {
      name: 'Ovulación',
      description: 'Estás en tu ventana fértil',
      color: 'bg-purple-500',
      icon: '🥚',
      tips: ['Máxima fertilidad', 'Energía al máximo', 'Buen momento para socializar']
    },
    [CYCLE_PHASES.LUTEAL]: {
      name: 'Fase Lútea',
      description: 'Preparando el posible embarazo',
      color: 'bg-yellow-400',
      icon: '🌙',
      tips: ['Practica autocuidado', 'Reduce el estrés', 'Descansa más']
    }
  };

  return phaseInfo[phase] || phaseInfo[CYCLE_PHASES.FOLLICULAR];
};

// Calcular días hasta el próximo periodo
export const getDaysUntilNextPeriod = (lastPeriodStart, cycleLength) => {
  const nextPeriod = calculateNextPeriod(lastPeriodStart, cycleLength);
  const today = new Date();
  return differenceInDays(nextPeriod, today);
};

// Calcular días hasta la ovulación
export const getDaysUntilOvulation = (lastPeriodStart, cycleLength) => {
  const ovulationDate = calculateOvulationDate(lastPeriodStart, cycleLength);
  const today = new Date();
  return differenceInDays(ovulationDate, today);
};

// Generar datos del calendario para un mes
export const generateCalendarData = (year, month, lastPeriodStart, cycleLength, periodLength) => {
  const calendarData = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const ovulationDate = calculateOvulationDate(lastPeriodStart, cycleLength);
  const fertileWindow = calculateFertileWindow(ovulationDate);
  const nextPeriod = calculateNextPeriod(lastPeriodStart, cycleLength);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDate = new Date(year, month, day);
    const phase = getCyclePhase(currentDate, lastPeriodStart, cycleLength, periodLength);
    
    let specialDay = null;
    
    if (isSameDay(currentDate, ovulationDate)) {
      specialDay = 'ovulation';
    } else if ((isAfter(currentDate, fertileWindow.start) || isSameDay(currentDate, fertileWindow.start)) &&
               (isBefore(currentDate, fertileWindow.end) || isSameDay(currentDate, fertileWindow.end))) {
      specialDay = 'fertile';
    } else if (isSameDay(currentDate, nextPeriod)) {
      specialDay = 'predicted_period';
    }

    calendarData.push({
      date: currentDate,
      day,
      phase,
      specialDay,
      isToday: isSameDay(currentDate, new Date())
    });
  }

  return calendarData;
};
