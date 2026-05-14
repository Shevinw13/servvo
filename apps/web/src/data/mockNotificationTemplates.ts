import { NotificationTemplate, MessagingTone } from '@/types/brand';

type TemplatesByTone = Record<MessagingTone, NotificationTemplate[]>;

export const NOTIFICATION_TEMPLATES: TemplatesByTone = {
  professional: [
    {
      id: 'prof-confirm',
      type: 'appointment_confirmation',
      subject: 'Appointment Confirmed',
      body: 'Your service appointment has been confirmed for {{date}} at {{time}}. Your {{provider}} will arrive as scheduled. Please ensure access to the property.',
    },
    {
      id: 'prof-progress',
      type: 'service_in_progress',
      subject: 'Service In Progress',
      body: 'Your {{provider}} has arrived and service is now underway at {{address}}. Estimated completion: {{estimatedTime}}.',
    },
    {
      id: 'prof-complete',
      type: 'service_complete',
      subject: 'Service Complete',
      body: 'Your service at {{address}} has been completed. Please review the attached photos documenting the work performed.',
    },
    {
      id: 'prof-review',
      type: 'review_request',
      subject: 'How Was Your Service?',
      body: 'We value your feedback. Please take a moment to rate your recent service experience. Your review helps us maintain our high standards.',
    },
  ],
  friendly: [
    {
      id: 'friend-confirm',
      type: 'appointment_confirmation',
      subject: "You're All Set! 🌿",
      body: "Great news! Your appointment is locked in for {{date}} at {{time}}. Your {{provider}} is looking forward to making your lawn look amazing!",
    },
    {
      id: 'friend-progress',
      type: 'service_in_progress',
      subject: "We're On It! 🏡",
      body: "Hey there! Your {{provider}} just got started at {{address}}. Sit back and relax — we've got this covered!",
    },
    {
      id: 'friend-complete',
      type: 'service_complete',
      subject: 'All Done! ✨',
      body: "Your lawn is looking fresh! Check out the before & after photos — we think you're going to love it.",
    },
    {
      id: 'friend-review',
      type: 'review_request',
      subject: 'How Did We Do? 🌟',
      body: "We'd love to hear how things went! A quick rating helps us keep delivering the best service for you.",
    },
  ],
  luxury: [
    {
      id: 'lux-confirm',
      type: 'appointment_confirmation',
      subject: 'Your Appointment Is Confirmed',
      body: 'We are pleased to confirm your exclusive service appointment for {{date}} at {{time}}. Your dedicated {{provider}} will attend to your property with the utmost care.',
    },
    {
      id: 'lux-progress',
      type: 'service_in_progress',
      subject: 'Service Has Commenced',
      body: 'Your dedicated {{provider}} has commenced work at {{address}}. Every detail is being attended to with precision and care.',
    },
    {
      id: 'lux-complete',
      type: 'service_complete',
      subject: 'Service Excellence Delivered',
      body: 'Your property at {{address}} has been meticulously serviced. We invite you to review the curated gallery of our work.',
    },
    {
      id: 'lux-review',
      type: 'review_request',
      subject: 'Your Experience Matters',
      body: 'We strive for nothing less than excellence. We would be honored to receive your candid assessment of our service.',
    },
  ],
  modern: [
    {
      id: 'mod-confirm',
      type: 'appointment_confirmation',
      subject: 'Appointment Locked In',
      body: "Confirmed: {{date}} at {{time}}. Your {{provider}} is scheduled and ready. You'll get a heads-up when they're en route.",
    },
    {
      id: 'mod-progress',
      type: 'service_in_progress',
      subject: 'Service Started',
      body: 'Your {{provider}} is now on-site at {{address}}. Track progress in real-time through your dashboard.',
    },
    {
      id: 'mod-complete',
      type: 'service_complete',
      subject: 'Done & Documented',
      body: 'Service complete at {{address}}. Photos are in your timeline. Next service recommendation available in your dashboard.',
    },
    {
      id: 'mod-review',
      type: 'review_request',
      subject: 'Quick Rating',
      body: 'One tap — how was your service? Your feedback directly shapes your future experience.',
    },
  ],
};

export function getTemplatesForTone(tone: MessagingTone): NotificationTemplate[] {
  return NOTIFICATION_TEMPLATES[tone];
}
