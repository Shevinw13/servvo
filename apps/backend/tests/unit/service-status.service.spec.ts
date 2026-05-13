import { ServiceStatusService } from '../../src/modules/service-status/service-status.service';
import { ServiceStatus } from '../../src/common/enums';

describe('ServiceStatusService', () => {
  describe('parseSmsStatus', () => {
    it('should map "1" to ON_THE_WAY', () => {
      expect(ServiceStatusService.parseSmsStatus('1')).toBe(
        ServiceStatus.ON_THE_WAY,
      );
    });

    it('should map "2" to ARRIVED', () => {
      expect(ServiceStatusService.parseSmsStatus('2')).toBe(
        ServiceStatus.ARRIVED,
      );
    });

    it('should map "3" to COMPLETED', () => {
      expect(ServiceStatusService.parseSmsStatus('3')).toBe(
        ServiceStatus.COMPLETED,
      );
    });

    it('should handle whitespace around valid codes', () => {
      expect(ServiceStatusService.parseSmsStatus(' 1 ')).toBe(
        ServiceStatus.ON_THE_WAY,
      );
      expect(ServiceStatusService.parseSmsStatus(' 2 ')).toBe(
        ServiceStatus.ARRIVED,
      );
      expect(ServiceStatusService.parseSmsStatus(' 3 ')).toBe(
        ServiceStatus.COMPLETED,
      );
    });

    it('should return undefined for unrecognized input', () => {
      expect(ServiceStatusService.parseSmsStatus('0')).toBeUndefined();
      expect(ServiceStatusService.parseSmsStatus('4')).toBeUndefined();
      expect(ServiceStatusService.parseSmsStatus('hello')).toBeUndefined();
      expect(ServiceStatusService.parseSmsStatus('')).toBeUndefined();
    });

    it('should return undefined for partial matches', () => {
      expect(ServiceStatusService.parseSmsStatus('12')).toBeUndefined();
      expect(ServiceStatusService.parseSmsStatus('1a')).toBeUndefined();
      expect(ServiceStatusService.parseSmsStatus('a1')).toBeUndefined();
    });
  });
});
