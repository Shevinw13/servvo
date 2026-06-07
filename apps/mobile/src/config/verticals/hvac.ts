import { IndustryConfig } from '../industry.types';

export const hvacConfig: IndustryConfig = {
  vertical: 'hvac',
  displayName: 'Unique Heating & Air',

  colors: {
    primary: '#1E2D42',
    primaryLight: '#2A3D52',
    accent: '#5B8AB0',
    accentLight: '#8BB5D4',
    background: '#F7F8FA',
    success: '#2D7A4F',
    warning: '#C4841A',
  },
  gradients: {
    heroOverlay: ['transparent', 'rgba(247,248,250,0.0)', 'rgba(247,248,250,0.85)', '#F7F8FA'],
    buttonPrimary: ['#1E2D42', '#182436'],
  },

  terminology: {
    serviceProvider: 'Technician',
    propertyNoun: 'home',
    serviceNoun: 'maintenance',
  },

  hero: {
    greetingLine: 'Your home feels perfect today',
    imageUri: require('../../../assets/providers/hvac-hero.webp'),
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
    1: 'Circulate warm air evenly',
    2: 'Schedule AC inspection',
    3: 'Replace air filters now',
    4: 'Test AC before heat hits',
    5: 'Set thermostat to 78°F',
    6: 'Keep vents unblocked',
    7: 'Clean condenser coils',
    8: 'Check refrigerant levels',
    9: 'Schedule furnace tune-up',
    10: 'Seal any duct leaks',
    11: 'Fresh filter for winter',
    12: 'Set thermostat to 68°F',
  },
};
