import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Tv, Snowflake, Laptop, Lightbulb, Settings, Monitor } from "lucide-react";
import { type Appliance } from "@shared/schema";
import { getAllApplianceOptions, applianceOptions } from "@/data/appliances";
import { calculateApplianceConsumption, formatCurrency, formatNumber } from "@/lib/calculations";
import { useCustomAppliances } from "@/hooks/use-custom-appliances";
import { CustomApplianceDialog } from "./custom-appliance-dialog";
import { ManageCustomAppliances } from "./manage-custom-appliances";

interface ApplianceTableProps {
  appliances: Appliance[];
  costPerKwh: number;
  onAppliancesChange: (appliances: Appliance[]) => void;
}

export function ApplianceTable({ appliances, costPerKwh, onAppliancesChange }: ApplianceTableProps) {
  const { customAppliances } = useCustomAppliances();
  
  // Recalculate options whenever custom appliances change
  const allApplianceOptions = React.useMemo(() => {
    return getAllApplianceOptions(customAppliances);
  }, [customAppliances]);
  const addAppliance = () => {
    const newAppliance: Appliance = {
      id: `appliance-${Date.now()}`,
      name: "Television 50\"",
      rating: 150,
      backupTime: 6.0,
      units: 1,
      daysPerWeek: 7,
      daysPerMonth: 30,
    };
    onAppliancesChange([...appliances, newAppliance]);
  };

  const removeAppliance = (id: string) => {
    onAppliancesChange(appliances.filter(a => a.id !== id));
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    onAppliancesChange(
      appliances.map(a => a.id === id ? { ...a, ...updates } : a)
    );
  };

  const quickAddAppliance = (name: string, rating: number) => {
    const newAppliance: Appliance = {
      id: `appliance-${Date.now()}`,
      name,
      rating,
      backupTime: 6.0,
      units: 1,
      daysPerWeek: 7,
      daysPerMonth: 30,
    };
    onAppliancesChange([...appliances, newAppliance]);
  };

  return (
    <div className="space-y-6">
      {/* Add Appliance Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appliance Calculator</CardTitle>
            <Button onClick={addAppliance} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Appliance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Add Popular Appliances */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            <Button
              variant="outline"
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => quickAddAppliance("Television 50\"", 150)}
              data-testid="button-quick-add-tv"
            >
              <Tv className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs">Television</span>
            </Button>
            <Button
              variant="outline"
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => quickAddAppliance("1.5Hp Air Conditioner", 1200)}
              data-testid="button-quick-add-ac"
            >
              <Snowflake className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs">AC Unit</span>
            </Button>
            <Button
              variant="outline"
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => quickAddAppliance("Laptop", 90)}
              data-testid="button-quick-add-laptop"
            >
              <Laptop className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs">Laptop</span>
            </Button>
            <Button
              variant="outline"
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => quickAddAppliance("10W LED Light Bulb", 10)}
              data-testid="button-quick-add-lights"
            >
              <Lightbulb className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs">LED Lights</span>
            </Button>
            <Button
              variant="outline"
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => quickAddAppliance("Straight Sewing Machine", 370)}
              data-testid="button-quick-add-sewing"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs">Sewing Machine</span>
            </Button>
            <Button
              variant="outline"
              className="p-3 h-auto flex-col space-y-1"
              onClick={() => quickAddAppliance("Desktop Computer", 250)}
              data-testid="button-quick-add-desktop"
            >
              <Monitor className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs">Desktop PC</span>
            </Button>
          </div>

          {/* Custom Appliance Management */}
          <div className="space-y-3">
            <CustomApplianceDialog 
              onApplianceCreated={(appliance) => {
                quickAddAppliance(appliance.name, appliance.rating);
              }}
            />
            <div className="flex justify-center">
              <ManageCustomAppliances />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appliances Table */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Energy Consumption Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your appliances and see real-time consumption calculations
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Appliances</TableHead>
                  <TableHead>Rating (W)</TableHead>
                  <TableHead>Backup Time (hrs)</TableHead>
                  <TableHead># Units</TableHead>
                  <TableHead>Daily kWh</TableHead>
                  <TableHead>Days/Week</TableHead>
                  <TableHead>Weekly kWh</TableHead>
                  <TableHead>Days/Month</TableHead>
                  <TableHead>Monthly kWh</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appliances.map((appliance, index) => {
                  const result = calculateApplianceConsumption(appliance, costPerKwh);
                  return (
                    <TableRow key={appliance.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm">{index + 1}</TableCell>
                      <TableCell>
                        <Select
                          key={`${appliance.id}-${customAppliances.length}`}
                          value={appliance.name}
                          onValueChange={(value) => {
                            const option = allApplianceOptions.find(opt => opt.label === value);
                            updateAppliance(appliance.id, { 
                              name: value,
                              rating: option?.rating || appliance.rating
                            });
                          }}
                        >
                          <SelectTrigger className="w-full" data-testid={`select-appliance-${appliance.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Default Appliances */}
                            {allApplianceOptions.filter(opt => !opt.isCustom).map((option) => (
                              <SelectItem key={option.value} value={option.label}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{option.label}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {option.rating}W
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                            
                            {/* Custom Appliances */}
                            {allApplianceOptions.filter(opt => opt.isCustom).length > 0 && (
                              <>
                                <Separator className="my-2" />
                                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                                  Custom Appliances
                                </div>
                                {allApplianceOptions.filter(opt => opt.isCustom).map((option) => (
                                  <SelectItem key={option.value} value={option.label}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{option.label}</span>
                                      <div className="flex items-center space-x-1">
                                        <Badge variant="outline" className="text-xs">
                                          {option.rating}W
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          Custom
                                        </Badge>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={appliance.rating}
                          onChange={(e) => updateAppliance(appliance.id, { rating: Number(e.target.value) })}
                          className="w-20"
                          min="0"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={appliance.backupTime}
                          onChange={(e) => updateAppliance(appliance.id, { backupTime: Number(e.target.value) })}
                          className="w-20"
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={appliance.units}
                          onChange={(e) => updateAppliance(appliance.id, { units: Number(e.target.value) })}
                          className="w-16"
                          min="1"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatNumber(result.dailyConsumption)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={appliance.daysPerWeek}
                          onChange={(e) => updateAppliance(appliance.id, { daysPerWeek: Number(e.target.value) })}
                          className="w-16"
                          min="1"
                          max="7"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatNumber(result.weeklyConsumption)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={appliance.daysPerMonth}
                          onChange={(e) => updateAppliance(appliance.id, { daysPerMonth: Number(e.target.value) })}
                          className="w-20"
                          min="1"
                          max="31"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatNumber(result.monthlyConsumption)}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(result.monthlyCost)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAppliance(appliance.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {/* Empty state/add row */}
                {appliances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      No appliances added yet. Click "Add Custom Appliance" or use the quick add buttons above.
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow className="border-t-2 border-dashed">
                    <TableCell className="text-muted-foreground">+</TableCell>
                    <TableCell colSpan={11}>
                      <Button
                        variant="ghost"
                        onClick={addAppliance}
                        className="w-full py-2 text-muted-foreground border-2 border-dashed border-gray-300 hover:border-blue-600 hover:text-blue-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Appliance Row
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
