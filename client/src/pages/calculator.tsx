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
import { CustomerInfoForm } from "@/components/customer-info-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Calculator() {
  const [location, setLocation] = useState("Abuja");
  const [costPerKwh, setCostPerKwh] = useState(225.00);
  const [appliances, setAppliances] = useState<Appliance[]>(() => 
    defaultAppliances.map((appliance, index) => ({
      ...appliance,
      id: `default-${index}`,
    }))
  );
  const [customerInfo, setCustomerInfo] = useState({
    customerName: undefined as string | undefined,
    customerEmail: undefined as string | undefined,
    customerPhone: undefined as string | undefined,
  });
  const [customerFormCollapsed, setCustomerFormCollapsed] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate totals whenever appliances or cost changes
  const totals = calculateTotals(appliances, costPerKwh);

  const handleExport = () => {
    const data = {
      name: `Energy Calculation - ${location}`,
      location,
      costPerKwh,
      appliances,
      customerInfo,
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

  const saveMutation = useMutation({
    mutationFn: async (calculationData: any) => {
      const response = await fetch("/api/calculations", {
        method: "POST",
        body: JSON.stringify(calculationData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Calculation Saved",
        description: "Your energy calculation has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/calculations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save calculation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const calculationData = {
      name: `Energy Calculation - ${location} - ${new Date().toLocaleDateString()}`,
      location,
      costPerKwh: costPerKwh.toString(),
      appliances,
      customerName: customerInfo.customerName || undefined,
      customerEmail: customerInfo.customerEmail || undefined,
      customerPhone: customerInfo.customerPhone || undefined,
    };
    
    saveMutation.mutate(calculationData);
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
              <Button 
                onClick={handleSave} 
                disabled={saveMutation.isPending}
                data-testid="button-save-calculation"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Calculation"}
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
            {/* Customer Information Form */}
            <CustomerInfoForm
              customerInfo={customerInfo}
              onCustomerInfoChange={(info) => setCustomerInfo({
                customerName: info.customerName,
                customerEmail: info.customerEmail,
                customerPhone: info.customerPhone,
              })}
              collapsed={customerFormCollapsed}
              onToggleCollapse={() => setCustomerFormCollapsed(!customerFormCollapsed)}
            />

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
          <Button 
            className="flex-1" 
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
