/**
 * Smoke test to verify the mobile testing infrastructure is working.
 */
describe('Mobile Test Infrastructure', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to fast-check', () => {
    const fc = require('fast-check');
    expect(fc).toBeDefined();
    expect(fc.assert).toBeDefined();
  });
});
