import {
  calculateTax,
  calculateSIPProjection,
  formatIndianCurrency,
} from '../src/utils/calculations';

describe('calculations', () => {
  it('calculates tax and post-tax salary for a standard salary', () => {
    const result = calculateTax(1200000);
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.postTaxSalary).toBeCloseTo(1145400, 0);
    expect(result.monthlyPostTax).toBeCloseTo(result.postTaxSalary / 12, 6);
  });

  it('builds SIP projection with user-controlled step-up and salary plateau', () => {
    const projection = calculateSIPProjection(
      1000000,
      10000,
      12,
      3,
      15, // annual step up
      1100000, // salary plateau
      6,
      30,
      200000
    );

    expect(projection).toHaveLength(3);
    expect(projection[0].sipAmount).toBe(10000);
    expect(projection[1].sipAmount).toBeCloseTo(11500, 2);
    expect(projection[2].sipAmount).toBeCloseTo(11500, 2);
    expect(projection[2].preTaxSalary).toBeLessThanOrEqual(1100000);
  });

  it('formats Indian currency into K, L, Cr units', () => {
    expect(formatIndianCurrency(950)).toBe('₹950');
    expect(formatIndianCurrency(12345)).toBe('₹12.35K');
    expect(formatIndianCurrency(500000)).toBe('₹5.00L');
    expect(formatIndianCurrency(15000000)).toBe('₹1.50Cr');
  });
});
