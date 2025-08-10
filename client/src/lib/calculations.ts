import { type Appliance, type CalculationResult } from "@shared/schema";

export function calculateApplianceConsumption(
  appliance: Appliance,
  costPerKwh: number
): CalculationResult {
  // Daily consumption = (Rating × Backup Time × Units) / 1000
  const dailyConsumption = (appliance.rating * appliance.backupTime * appliance.units) / 1000;
  
  // Weekly consumption = Daily consumption × Days per Week
  const weeklyConsumption = dailyConsumption * appliance.daysPerWeek;
  
  // Monthly consumption = Daily consumption × Days per Month
  const monthlyConsumption = dailyConsumption * appliance.daysPerMonth;
  
  // Monthly cost = Monthly consumption × Cost per kWh
  const monthlyCost = monthlyConsumption * costPerKwh;

  return {
    dailyConsumption,
    weeklyConsumption,
    monthlyConsumption,
    monthlyCost,
  };
}

export function calculateTotals(appliances: Appliance[], costPerKwh: number) {
  let totalRating = 0;
  let totalDailyConsumption = 0;
  let totalMonthlyConsumption = 0;
  let totalMonthlyCost = 0;

  appliances.forEach(appliance => {
    totalRating += appliance.rating * appliance.units;
    const result = calculateApplianceConsumption(appliance, costPerKwh);
    totalDailyConsumption += result.dailyConsumption;
    totalMonthlyConsumption += result.monthlyConsumption;
    totalMonthlyCost += result.monthlyCost;
  });

  return {
    totalRating,
    totalDailyConsumption,
    totalMonthlyConsumption,
    totalMonthlyCost,
    totalAnnualCost: totalMonthlyCost * 12,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
