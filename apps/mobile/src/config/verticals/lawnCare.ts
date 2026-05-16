import { IndustryConfig } from '../industry.types';

export const lawnCareConfig: IndustryConfig = {
  vertical: 'lawn_care',
  displayName: 'Lawn Care',

  colors: {
    primary: '#1F3D1F',
    primaryLight: '#2D5A2D',
    accent: '#4A7A3D',
    accentLight: '#7BAF6A',
    background: '#F9F8F4',
    success: '#1F5A1F',
    warning: '#9A6B1A',
  },
  gradients: {
    heroOverlay: ['transparent', 'rgba(249,248,244,0.0)', 'rgba(249,248,244,0.85)', '#F9F8F4'],
    buttonPrimary: ['#1F3D1F', '#1A331A'],
  },

  terminology: {
    serviceProvider: 'Service Professional',
    propertyNoun: 'property',
    serviceNoun: 'service',
  },

  hero: {
    greetingLine: 'Your lawn is looking incredible',
    imageUri: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
  },

  insightCards: [
    {
      id: 'health',
      icon: 'feather',
      iconColor: '#2D6A2D',
      label: 'Lawn Health',
      value: 'Thriving',
      backgroundTint: 'rgba(31, 90, 31, 0.04)',
    },
    {
      id: 'last-service',
      icon: 'calendar',
      iconColor: '#4A4A4A',
      label: 'Last Service',
      value: 'May 15',
    },
    {
      id: 'seasonal-tip',
      icon: 'sun',
      iconColor: '#9A6B1A',
      label: 'Seasonal Tip',
      value: '',
    },
  ],

  serviceTypes: [
    { id: 'mowing', name: 'Weekly Lawn Mowing', duration: 45 },
    { id: 'fertilization', name: 'Fertilization Treatment', duration: 30 },
    { id: 'aeration', name: 'Core Aeration', duration: 60 },
    { id: 'overseeding', name: 'Overseeding', duration: 45 },
  ],

  mockAppointment: {
    serviceType: 'Weekly Lawn Mowing',
    providerName: 'Joe L.',
    providerAvatarUri:
      'https://media.licdn.com/dms/image/v2/D4E03AQE1gDVudB1VsQ/profile-displayphoto-scale_400_400/B4EZvRdKuqJUAg-/0/1768745643528?e=2147483647&v=beta&t=MI9KbDg3zFleMKSzx0SM0OfwrD4JR3YXjQ0-7dWOw4w',
    date: 'Wednesday, May 22',
    time: '8:00 AM',
  },

  mockEvents: [
    { id: '1', title: 'Lawn Mowing Completed', timestamp: new Date('2024-05-15T14:00:00'), status: 'completed' },
    { id: '2', title: 'Provider uploaded photos', timestamp: new Date('2024-05-15T14:30:00'), status: 'completed' },
    { id: '3', title: 'Next service scheduled', timestamp: new Date('2024-05-16T09:00:00'), status: 'scheduled' },
    { id: '4', title: 'Invoice paid — $45.00', timestamp: new Date('2024-05-15T15:00:00'), status: 'completed' },
    { id: '5', title: 'Seasonal fertilization recommended', timestamp: new Date('2024-05-14T10:00:00'), status: 'scheduled' },
  ],

  seasonalTips: {
    1: 'Keep off frozen grass to prevent damage to dormant turf.',
    2: 'Plan your spring lawn care schedule and sharpen mower blades.',
    3: 'Apply pre-emergent herbicide before soil temperatures rise above 55°F.',
    4: 'Begin regular mowing — never cut more than one-third of blade height.',
    5: 'Water deeply but infrequently to encourage deep root growth.',
    6: 'Raise your mowing height to help grass withstand summer heat.',
    7: 'Water early in the morning to reduce evaporation and fungal risk.',
    8: 'Watch for heat stress — footprints that stay visible mean it\u2019s time to water.',
    9: 'Overseed thin areas and apply fall fertilizer for a strong root system.',
    10: 'Continue mowing until growth stops and remove fallen leaves promptly.',
    11: 'Apply winterizer fertilizer to strengthen roots before dormancy.',
    12: 'Minimize foot traffic on dormant lawns and plan next year\u2019s care schedule.',
  },
};
