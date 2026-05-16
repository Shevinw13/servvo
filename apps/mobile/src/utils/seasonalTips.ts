/**
 * Seasonal tips utilities.
 * Supports both the legacy lawn-care-only tips and industry-aware tips.
 */

import { IndustryConfig } from '@/config/industry.types';

const tips: Record<number, string> = {
  1: 'Keep off frozen grass to prevent damage to dormant turf.',
  2: 'Plan your spring lawn care schedule and sharpen mower blades.',
  3: 'Apply pre-emergent herbicide before soil temperatures rise above 55 degrees.',
  4: 'Begin regular mowing as growth picks up and never cut more than one-third of blade height.',
  5: 'Water deeply but infrequently to encourage deep root growth.',
  6: 'Raise your mowing height to help grass withstand summer heat.',
  7: 'Water early in the morning to reduce evaporation and fungal risk.',
  8: 'Watch for signs of heat stress. Footprints that stay visible mean it is time to water.',
  9: 'Overseed thin areas and apply fall fertilizer for a strong root system.',
  10: 'Continue mowing until growth stops and remove fallen leaves promptly.',
  11: 'Apply winterizer fertilizer to strengthen roots before dormancy.',
  12: 'Minimize foot traffic on dormant lawns and plan next year\'s care schedule.',
};

/**
 * Returns a seasonal lawn care tip for the given month (1-12).
 * Always returns a non-empty string.
 */
export function getSeasonalTip(month: number): string {
  return tips[month] || 'Keep your lawn healthy with regular care and attention.';
}

/**
 * Returns an industry-specific seasonal tip for the given month.
 * Reads from the config's seasonalTips map. Falls back to a generic tip
 * if the month has no entry.
 */
export function getIndustrySeasonalTip(config: IndustryConfig, month: number): string {
  return config.seasonalTips[month] || 'Keep your home healthy with regular care and attention.';
}
