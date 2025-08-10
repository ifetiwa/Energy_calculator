import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface SettingsPanelProps {
  location: string;
  costPerKwh: number;
  onLocationChange: (location: string) => void;
  onCostChange: (cost: number) => void;
  summary: {
    dailyMax: number;
    dailyAvg: number;
    monthlyTotal: number;
    monthlyCost: number;
    annualCost: number;
  };
}

export function SettingsPanel({
  location,
  costPerKwh,
  onLocationChange,
  onCostChange,
  summary,
}: SettingsPanelProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Calculator Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abuja">Abuja</SelectItem>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cost per kWh */}
        <div className="space-y-2">
          <Label htmlFor="cost">Cost per kWh (₦)</Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₦</span>
            <Input
              id="cost"
              type="number"
              value={costPerKwh}
              onChange={(e) => onCostChange(Number(e.target.value))}
              className="pl-8"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-semibold">Consumption Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Max</span>
              <span className="text-sm font-medium">{formatNumber(summary.dailyMax)} kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <span className="text-sm font-medium">{formatNumber(summary.dailyAvg)} kWh</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Total</span>
              <span className="text-sm font-medium text-blue-600">{formatNumber(summary.monthlyTotal)} kWh</span>
            </div>
          </div>

          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Cost</span>
              <span className="text-lg font-semibold text-green-600">{formatCurrency(summary.monthlyCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Annual Cost</span>
              <span className="text-sm font-medium">{formatCurrency(summary.annualCost)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
