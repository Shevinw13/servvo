import { IndustryConfig } from '../industry.types';

export const hvacConfig: IndustryConfig = {
  vertical: 'hvac',
  displayName: 'HVAC',

  colors: {
    primary: '#1A2744',
    primaryLight: '#2A3D5C',
    accent: '#4A90D9',
    accentLight: '#7AB3E8',
    background: '#F5F7FA',
    success: '#2D7A4F',
    warning: '#C4841A',
  },
  gradients: {
    heroOverlay: ['transparent', 'rgba(245,247,250,0.0)', 'rgba(245,247,250,0.85)', '#F5F7FA'],
    buttonPrimary: ['#1A2744', '#152038'],
  },

  terminology: {
    serviceProvider: 'Technician',
    propertyNoun: 'home',
    serviceNoun: 'maintenance',
  },

  hero: {
    greetingLine: 'Your home comfort is running perfectly',
    imageUri: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  },

  insightCards: [
    {
      id: 'air-quality',
      icon: 'wind',
      iconColor: '#4A90D9',
      label: 'Air Quality',
      value: 'Excellent',
      backgroundTint: 'rgba(74, 144, 217, 0.06)',
    },
    {
      id: 'filter-health',
      icon: 'filter',
      iconColor: '#2D7A4F',
      label: 'Filter Health',
      value: '87%',
    },
    {
      id: 'energy-efficiency',
      icon: 'zap',
      iconColor: '#C4841A',
      label: 'Energy Efficiency',
      value: '',
    },
  ],

  serviceTypes: [
    { id: 'tune-up', name: 'System Tune-Up', duration: 90 },
    { id: 'filter-replacement', name: 'Filter Replacement', duration: 30 },
    { id: 'seasonal-maintenance', name: 'Seasonal Maintenance', duration: 120 },
    { id: 'duct-cleaning', name: 'Duct Cleaning', duration: 180 },
  ],

  mockAppointment: {
    serviceType: 'Seasonal Maintenance',
    providerName: 'Mike R.',
    date: 'Thursday, May 23',
    time: '10:00 AM',
  },

  mockEvents: [
    { id: '1', title: 'AC Tune-Up Completed', timestamp: new Date('2024-05-10T11:00:00'), status: 'completed' },
    { id: '2', title: 'Technician uploaded inspection report', timestamp: new Date('2024-05-10T11:45:00'), status: 'completed' },
    { id: '3', title: 'Filter replacement scheduled', timestamp: new Date('2024-05-20T09:00:00'), status: 'scheduled' },
    { id: '4', title: 'Invoice paid — $185.00', timestamp: new Date('2024-05-10T12:00:00'), status: 'completed' },
    { id: '5', title: 'Seasonal maintenance reminder', timestamp: new Date('2024-05-18T08:00:00'), status: 'scheduled' },
  ],

  seasonalTips: {
    1: 'Run your furnace fan on low to circulate warm air evenly.',
    2: 'Schedule a pre-spring AC inspection before the rush.',
    3: 'Replace filters now — spring allergens are about to spike.',
    4: 'Test your AC before the first hot day to catch issues early.',
    5: 'Set your thermostat to 78°F when home for optimal efficiency.',
    6: 'Keep vents clear of furniture to maintain proper airflow.',
    7: 'Clean outdoor condenser coils to maintain peak cooling.',
    8: 'Check refrigerant levels if cooling seems weak.',
    9: 'Schedule fall furnace maintenance before heating season.',
    10: 'Seal duct leaks to prevent heat loss this winter.',
    11: 'Switch to a clean filter before running your furnace full-time.',
    12: 'Keep your thermostat at 68°F to balance comfort and efficiency.',
  },
};
