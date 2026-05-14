export const mockUser = {
  name: 'Alex Thompson',
  propertyImageUri: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
};

export const mockAppointment = {
  id: '1',
  date: 'Wed, May 22',
  time: '8:00 AM',
  serviceType: 'Weekly Lawn Mowing',
  providerName: 'Marcus J.',
  providerAvatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  status: 'confirmed' as const,
};

export const mockEvents = [
  { id: '1', title: 'Lawn Mowing Completed', timestamp: new Date('2024-05-15T14:00:00'), status: 'completed' as const },
  { id: '2', title: 'Provider uploaded photos', timestamp: new Date('2024-05-15T14:30:00'), status: 'completed' as const },
  { id: '3', title: 'Next service scheduled', timestamp: new Date('2024-05-16T09:00:00'), status: 'scheduled' as const },
  { id: '4', title: 'Invoice paid — $45.00', timestamp: new Date('2024-05-15T15:00:00'), status: 'completed' as const },
  { id: '5', title: 'Seasonal fertilization recommended', timestamp: new Date('2024-05-14T10:00:00'), status: 'scheduled' as const },
];

export const mockProperty = {
  healthStatus: 'thriving' as const,
  lastServiceDate: '2024-05-15',
};
