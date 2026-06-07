import { IndustryConfig } from '../industry.types';

export const pestControlConfig: IndustryConfig = {
  vertical: 'pest_control',
  displayName: 'Quality Pest Control',

  colors: {
    primary: '#2D2D2D',
    primaryLight: '#404040',
    accent: '#6B8A5A',
    accentLight: '#8DAF7D',
    background: '#F8F7F4',
    success: '#4A7A4A',
    warning: '#8A6B2A',
  },
  gradients: {
    heroOverlay: ['transparent', 'rgba(248,247,244,0.0)', 'rgba(248,247,244,0.85)', '#F8F7F4'],
    buttonPrimary: ['#2D2D2D', '#222222'],
  },

  terminology: {
    serviceProvider: 'Specialist',
    propertyNoun: 'home',
    serviceNoun: 'treatment',
  },

  hero: {
    greetingLine: 'Your home feels protected and peaceful',
    imageUri: require('../../../assets/providers/pest-hero.png'),
  },

  insightCards: [
    {
      id: 'protection-status',
      icon: 'shield',
      iconColor: '#5A8A5A',
      label: 'Protection Status',
      value: 'Active',
      backgroundTint: 'rgba(90, 138, 90, 0.06)',
    },
    {
      id: 'last-treatment',
      icon: 'calendar',
      iconColor: '#4A4A4A',
      label: 'Last Treatment',
      value: 'May 8',
    },
    {
      id: 'seasonal-risk',
      icon: 'alert-triangle',
      iconColor: '#8A6B2A',
      label: 'Seasonal Risk',
      value: '',
    },
  ],

  serviceTypes: [
    { id: 'perimeter', name: 'Perimeter Treatment', duration: 45 },
    { id: 'interior', name: 'Interior Inspection', duration: 60 },
    { id: 'prevention', name: 'Prevention Service', duration: 75 },
    { id: 'termite', name: 'Termite Inspection', duration: 90 },
  ],

  mockAppointment: {
    serviceType: 'Perimeter Treatment',
    providerName: 'Sarah K.',
    date: 'Friday, May 24',
    time: '9:00 AM',
  },

  mockEvents: [
    { id: '1', title: 'Perimeter Treatment Completed', timestamp: new Date('2024-05-08T10:00:00'), status: 'completed' },
    { id: '2', title: 'Specialist uploaded inspection photos', timestamp: new Date('2024-05-08T10:30:00'), status: 'completed' },
    { id: '3', title: 'Next treatment scheduled', timestamp: new Date('2024-05-22T09:00:00'), status: 'scheduled' },
    { id: '4', title: 'Invoice paid — $95.00', timestamp: new Date('2024-05-08T11:00:00'), status: 'completed' },
    { id: '5', title: 'Quarterly interior inspection due', timestamp: new Date('2024-06-01T08:00:00'), status: 'scheduled' },
  ],

  seasonalTips: {
    1: 'Seal cracks and gaps',
    2: 'Inspect attic spaces',
    3: 'Watch for ant trails',
    4: 'Termite swarm season',
    5: 'Eliminate standing water',
    6: 'Keep food sealed tight',
    7: 'Maintain perimeter barrier',
    8: 'Check for wasp nests',
    9: 'Rodents seeking shelter',
    10: 'Seal pipes and entries',
    11: 'Move firewood away',
    12: 'Check stored items',
  },
};
