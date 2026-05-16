/**
 * Greeting utility functions for the Servvo app.
 * Provides time-of-day-aware personalized greetings.
 */

import { IndustryConfig } from '@/config/industry.types';

/**
 * Returns the time-of-day segment based on the hour (0-23).
 * - 5-11: morning
 * - 12-16: afternoon
 * - 17-23 and 0-4: evening
 */
export function getTimeOfDayGreeting(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'afternoon';
  return 'evening';
}

/**
 * Builds a personalized greeting string containing the user's first name
 * and a time-of-day-appropriate message.
 */
export function buildGreeting(firstName: string, hour: number): string {
  const timeOfDay = getTimeOfDayGreeting(hour);

  switch (timeOfDay) {
    case 'morning':
      return `Good morning, ${firstName}`;
    case 'afternoon':
      return `Good afternoon, ${firstName}`;
    case 'evening':
      return `Your lawn is looking incredible this evening, ${firstName}`;
  }
}

/**
 * Builds an industry-aware personalized greeting.
 * Uses the industry config's hero greeting line for evening hours.
 */
export function buildIndustryGreeting(
  config: IndustryConfig,
  firstName: string,
  hour: number
): string {
  const timeOfDay = getTimeOfDayGreeting(hour);

  switch (timeOfDay) {
    case 'morning':
      return `Good morning, ${firstName}`;
    case 'afternoon':
      return `Good afternoon, ${firstName}`;
    case 'evening':
      return `${config.hero.greetingLine}, ${firstName}`;
  }
}
