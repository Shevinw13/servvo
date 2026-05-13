import { resolveTerminology, MESSAGES, Terminology } from '../../../src/utils/terminology';

describe('resolveTerminology', () => {
  const terminology: Terminology = { serviceProvider: 'Crew' };

  describe('basic placeholder replacement', () => {
    it('replaces {{provider}} with the configured term', () => {
      const result = resolveTerminology('Your {{provider}} is on the way', terminology);
      expect(result).toBe('Your Crew is on the way');
    });

    it('replaces {{serviceProvider}} with the configured term', () => {
      const result = resolveTerminology('Your {{serviceProvider}} is here', terminology);
      expect(result).toBe('Your Crew is here');
    });
  });

  describe('case handling', () => {
    it('replaces {{Provider}} with capitalized term', () => {
      const result = resolveTerminology('{{Provider}} assigned', terminology);
      expect(result).toBe('Crew assigned');
    });

    it('replaces {{ServiceProvider}} with capitalized term', () => {
      const result = resolveTerminology('{{ServiceProvider}} is ready', terminology);
      expect(result).toBe('Crew is ready');
    });

    it('replaces {{PROVIDER}} with uppercase term', () => {
      const result = resolveTerminology('STATUS: {{PROVIDER}} ARRIVED', terminology);
      expect(result).toBe('STATUS: CREW ARRIVED');
    });

    it('replaces {{SERVICEPROVIDER}} with uppercase term', () => {
      const result = resolveTerminology('{{SERVICEPROVIDER}} COMPLETE', terminology);
      expect(result).toBe('CREW COMPLETE');
    });

    it('handles multi-word terms correctly', () => {
      const multiWord: Terminology = { serviceProvider: 'Service Professional' };
      expect(resolveTerminology('Your {{provider}} is here', multiWord))
        .toBe('Your Service Professional is here');
      expect(resolveTerminology('{{PROVIDER}} ARRIVED', multiWord))
        .toBe('SERVICE PROFESSIONAL ARRIVED');
      expect(resolveTerminology('{{Provider}} assigned', multiWord))
        .toBe('Service Professional assigned');
    });
  });

  describe('multiple placeholders in one string', () => {
    it('replaces all occurrences of the same placeholder', () => {
      const result = resolveTerminology(
        'Your {{provider}} is great. Thank your {{provider}}!',
        terminology,
      );
      expect(result).toBe('Your Crew is great. Thank your Crew!');
    });

    it('replaces mixed placeholder variants in one string', () => {
      const result = resolveTerminology(
        '{{Provider}} update: your {{provider}} ({{PROVIDER}}) is on the way',
        terminology,
      );
      expect(result).toBe('Crew update: your Crew (CREW) is on the way');
    });
  });

  describe('no placeholders (passthrough)', () => {
    it('returns the string unchanged when no placeholders are present', () => {
      const result = resolveTerminology('Hello, welcome back!', terminology);
      expect(result).toBe('Hello, welcome back!');
    });

    it('returns an empty string unchanged', () => {
      const result = resolveTerminology('', terminology);
      expect(result).toBe('');
    });
  });

  describe('MESSAGES constants', () => {
    it('resolves PROVIDER_ON_WAY message', () => {
      const result = resolveTerminology(MESSAGES.PROVIDER_ON_WAY, terminology);
      expect(result).toBe('Your Crew is on the way');
    });

    it('resolves PROVIDER_ARRIVED message', () => {
      const result = resolveTerminology(MESSAGES.PROVIDER_ARRIVED, terminology);
      expect(result).toBe('Your Crew has arrived');
    });

    it('resolves SERVICE_COMPLETED message', () => {
      const result = resolveTerminology(MESSAGES.SERVICE_COMPLETED, terminology);
      expect(result).toBe('Your Crew has completed your service');
    });

    it('resolves PROVIDER_ASSIGNED message', () => {
      const result = resolveTerminology(MESSAGES.PROVIDER_ASSIGNED, terminology);
      expect(result).toBe('A Crew has been assigned to your service');
    });
  });
});
