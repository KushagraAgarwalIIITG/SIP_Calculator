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

    expect(projection).toHaveLength(4); // baseline + 3 years
    expect(projection[0].year).toBe(0);
    expect(projection[1].sipAmount).toBe(10000);
    expect(projection[2].sipAmount).toBeCloseTo(11500, 2);
    expect(projection[3].sipAmount).toBeCloseTo(11500, 2);
    expect(projection[3].preTaxSalary).toBeLessThanOrEqual(1100000);
  });

  it('keeps all projection formulas internally consistent for every year', () => {
    const inflationRate = 6;
    const projection = calculateSIPProjection(
      1500000,
      50000,
      12,
      10,
      7,
      7000000,
      inflationRate,
      26,
      2600000
    );

    // Baseline row should reflect exact starting values at current age.
    expect(projection[0].year).toBe(0);
    expect(projection[0].age).toBe(26);
    expect(projection[0].netWorthNominal).toBe(2600000);
    expect(projection[0].netWorthReal).toBe(2600000);

    for (const row of projection) {
      const inflationFactor = Math.pow(1 + inflationRate / 100, row.year);

      if (row.year === 0) {
        expect(row.yearlyInvestment).toBe(0);
      } else {
        expect(row.yearlyInvestment).toBeCloseTo(row.sipAmount * 12, 6);
      }
      expect(row.totalNominalValue).toBeCloseTo(
        row.sipNominalValue + row.netWorthNominal,
        6
      );
      expect(row.totalRealValue).toBeCloseTo(
        row.sipRealValue + row.netWorthReal,
        6
      );
      expect(row.sipRealValue).toBeCloseTo(row.sipNominalValue / inflationFactor, 6);
      expect(row.netWorthReal).toBeCloseTo(row.netWorthNominal / inflationFactor, 6);
    }
  });

  it('formats Indian currency into K, L, Cr units', () => {
    expect(formatIndianCurrency(950)).toBe('₹950');
    expect(formatIndianCurrency(12345)).toBe('₹12.35K');
    expect(formatIndianCurrency(500000)).toBe('₹5.00L');
    expect(formatIndianCurrency(15000000)).toBe('₹1.50Cr');
  });
});
