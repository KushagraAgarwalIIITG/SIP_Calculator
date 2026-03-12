export interface TaxCalculation {
  taxableIncome: number;
  totalTax: number;
  effectiveTaxRate: number;
  postTaxSalary: number;
  monthlyPostTax: number;
}

export interface SIPProjection {
  year: number;
  age: number;
  preTaxSalary: number;
  postTaxSalary: number;
  sipAmount: number;
  yearlyInvestment: number;
  cumulativeInvestment: number;
  nominalValue: number;
  realValue: number;
}

export function calculateTax(annualSalary: number): TaxCalculation {
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, annualSalary - standardDeduction);

  let tax = 0;
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 }
  ];

  let previousLimit = 0;
  for (const slab of slabs) {
    if (taxableIncome > previousLimit) {
      const taxableInSlab = Math.min(taxableIncome, slab.limit) - previousLimit;
      tax += taxableInSlab * slab.rate;
      previousLimit = slab.limit;
    } else {
      break;
    }
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const postTaxSalary = annualSalary - totalTax;
  const effectiveTaxRate = annualSalary > 0 ? (totalTax / annualSalary) * 100 : 0;

  return {
    taxableIncome,
    totalTax,
    effectiveTaxRate,
    postTaxSalary,
    monthlyPostTax: postTaxSalary / 12
  };
}

export function calculateSIPProjection(
  currentSalary: number,
  initialSIPAmount: number,
  roiPercent: number,
  years: number,
  salaryPlateauLimit: number,
  inflationRate: number,
  currentAge: number
): SIPProjection[] {
  const projections: SIPProjection[] = [];
  let currentSIP = initialSIPAmount;
  let totalInvested = 0;
  let corpusValue = 0;
  let salary = currentSalary;

  const monthlyROI = roiPercent / 100 / 12;

  for (let year = 1; year <= years; year++) {
    const taxCalc = calculateTax(salary);
    const monthlySIP = currentSIP;
    const yearlyInvestment = monthlySIP * 12;

    for (let month = 0; month < 12; month++) {
      corpusValue = (corpusValue + monthlySIP) * (1 + monthlyROI);
    }

    totalInvested += yearlyInvestment;

    const realValue = corpusValue / Math.pow(1 + inflationRate / 100, year);

    projections.push({
      year,
      age: currentAge + year,
      preTaxSalary: salary,
      postTaxSalary: taxCalc.postTaxSalary,
      sipAmount: monthlySIP,
      yearlyInvestment,
      cumulativeInvestment: totalInvested,
      nominalValue: corpusValue,
      realValue
    });

    if (salary < salaryPlateauLimit) {
      currentSIP = currentSIP * 1.10;
      salary = Math.min(salary * 1.10, salaryPlateauLimit);
    }
  }

  return projections;
}

export function formatIndianCurrency(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (absAmount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (absAmount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)}K`;
  } else {
    return `₹${amount.toFixed(0)}`;
  }
}
