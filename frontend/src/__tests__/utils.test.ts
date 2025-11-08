// Simple utility tests
describe('Utility Functions', () => {
  it('should add two numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should concatenate strings', () => {
    const result = 'Hello' + ' ' + 'World';
    expect(result).toBe('Hello World');
  });

  it('should check if array includes item', () => {
    const arr = [1, 2, 3];
    expect(arr.includes(2)).toBe(true);
    expect(arr.includes(4)).toBe(false);
  });

  it('should format date correctly', () => {
    const date = new Date('2025-01-01');
    expect(date.getFullYear()).toBe(2025);
  });
});

