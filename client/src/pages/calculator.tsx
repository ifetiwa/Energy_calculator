import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Save, Bolt } from "lucide-react";
import { type Appliance } from "@shared/schema";
import { defaultAppliances } from "@/data/appliances";
import { calculateTotals } from "@/lib/calculations";
import { SettingsPanel } from "@/components/settings-panel";
import { ApplianceTable } from "@/components/appliance-table";
import { SummaryDashboard } from "@/components/summary-dashboard";
import { AnalysisCards } from "@/components/analysis-cards";

export default function Calculator() {
  const [location, setLocation] = useState("Abuja");
  const [costPerKwh, setCostPerKwh] = useState(225.00);
  const [appliances, setAppliances] = useState<Appliance[]>(() => 
    defaultAppliances.map((appliance, index) => ({
      ...appliance,
      id: `default-${index}`,
    }))
  );

  // Calculate totals whenever appliances or cost changes
  const totals = calculateTotals(appliances, costPerKwh);

  const handleExport = () => {
    const data = {
      location,
      costPerKwh,
      appliances,
      totals,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vectis-energy-calculation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    // TODO: Implement save functionality with backend
    console.log('Save calculation:', { location, costPerKwh, appliances });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bolt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VECTIS</h1>
                <p className="text-sm text-muted-foreground">Energy Consumption Calculator</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Calculation
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <SettingsPanel
              location={location}
              costPerKwh={costPerKwh}
              onLocationChange={setLocation}
              onCostChange={setCostPerKwh}
              summary={{
                dailyMax: totals.totalDailyConsumption,
                dailyAvg: totals.totalDailyConsumption, // Same as max for now
                monthlyTotal: totals.totalMonthlyConsumption,
                monthlyCost: totals.totalMonthlyCost,
                annualCost: totals.totalAnnualCost,
              }}
            />
          </div>

          {/* Main Calculator */}
          <div className="lg:col-span-3 space-y-6">
            {/* Appliances Table */}
            <ApplianceTable
              appliances={appliances}
              costPerKwh={costPerKwh}
              onAppliancesChange={setAppliances}
            />

            {/* Summary Dashboard */}
            <SummaryDashboard
              totalRating={totals.totalRating}
              totalDaily={totals.totalDailyConsumption}
              totalMonthly={totals.totalMonthlyConsumption}
              totalCost={totals.totalMonthlyCost}
            />

            {/* Analysis Cards */}
            {appliances.length > 0 && (
              <AnalysisCards
                appliances={appliances}
                costPerKwh={costPerKwh}
                totalMonthlyCost={totals.totalMonthlyCost}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
