import { Card, CardContent } from "@/components/ui/card";
import { Leaf, PieChart, Lightbulb } from "lucide-react";
import { type Appliance } from "@shared/schema";
import { calculateApplianceConsumption, formatCurrency } from "@/lib/calculations";

interface AnalysisCardsProps {
  appliances: Appliance[];
  costPerKwh: number;
  totalMonthlyCost: number;
}

export function AnalysisCards({ appliances, costPerKwh, totalMonthlyCost }: AnalysisCardsProps) {
  // Find the appliance with highest consumption
  const topConsumer = appliances.reduce((top, current) => {
    const topResult = calculateApplianceConsumption(top, costPerKwh);
    const currentResult = calculateApplianceConsumption(current, costPerKwh);
    return currentResult.monthlyCost > topResult.monthlyCost ? current : top;
  }, appliances[0]);

  const topConsumerResult = topConsumer ? calculateApplianceConsumption(topConsumer, costPerKwh) : null;
  const topConsumerPercentage = topConsumerResult && totalMonthlyCost > 0 
    ? Math.round((topConsumerResult.monthlyCost / totalMonthlyCost) * 100)
    : 0;

  // Simple efficiency rating based on total consumption
  const totalDaily = appliances.reduce((sum, appliance) => {
    return sum + calculateApplianceConsumption(appliance, costPerKwh).dailyConsumption;
  }, 0);
  
  const getEfficiencyRating = (daily: number) => {
    if (daily < 10) return "Excellent";
    if (daily < 20) return "Good";
    if (daily < 30) return "Fair";
    return "Needs Improvement";
  };

  // Estimate savings potential (20% of AC usage if present)
  const acAppliances = appliances.filter(a => a.name.toLowerCase().includes("air conditioner"));
  const acCost = acAppliances.reduce((sum, appliance) => {
    return sum + calculateApplianceConsumption(appliance, costPerKwh).monthlyCost;
  }, 0);
  const savingsPotential = Math.round(acCost * 0.2); // 20% potential savings on AC

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Energy Efficiency */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Efficiency Rating</h3>
              <p className="text-sm text-muted-foreground">Energy consumption analysis</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-2">
            {getEfficiencyRating(totalDaily)}
          </div>
          <p className="text-sm text-muted-foreground">
            Your energy usage is {totalDaily < 15 ? "within optimal range" : "above average"} for a household of this size.
          </p>
        </CardContent>
      </Card>

      {/* Top Consumer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Top Consumer</h3>
              <p className="text-sm text-muted-foreground">Highest energy usage</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {topConsumer?.name.split(' ')[0] || "N/A"}
          </div>
          <p className="text-sm text-muted-foreground">
            {topConsumerPercentage}% of total consumption ({formatCurrency(topConsumerResult?.monthlyCost || 0)}/month)
          </p>
        </CardContent>
      </Card>

      {/* Savings Potential */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Savings Potential</h3>
              <p className="text-sm text-muted-foreground">Monthly savings opportunity</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-2">
            {formatCurrency(savingsPotential)}
          </div>
          <p className="text-sm text-muted-foreground">
            {savingsPotential > 0 
              ? "Switch to energy-efficient appliances and optimize usage times."
              : "Consider adding more appliances to see saving opportunities."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
