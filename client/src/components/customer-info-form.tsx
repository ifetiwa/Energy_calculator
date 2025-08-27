import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from "lucide-react";

interface CustomerInfo {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function CustomerInfoForm({ 
  customerInfo, 
  onCustomerInfoChange, 
  collapsed = false, 
  onToggleCollapse 
}: CustomerInfoFormProps) {
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Customer Information</span>
          </CardTitle>
          {onToggleCollapse && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleCollapse}
              data-testid="button-toggle-customer-info"
            >
              {collapsed ? "Show" : "Hide"}
            </Button>
          )}
        </div>
        {!collapsed && (
          <p className="text-sm text-muted-foreground">
            Optional: Add customer details to save with your calculation
          </p>
        )}
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customer-name" className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="customer-name"
                type="text"
                placeholder="Enter customer name"
                value={customerInfo.customerName || ""}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                data-testid="input-customer-name"
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <Label htmlFor="customer-email" className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="customer@example.com"
                value={customerInfo.customerEmail || ""}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                data-testid="input-customer-email"
              />
            </div>

            {/* Customer Phone */}
            <div className="space-y-2">
              <Label htmlFor="customer-phone" className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={customerInfo.customerPhone || ""}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                data-testid="input-customer-phone"
              />
            </div>
          </div>

          {/* Helper Text */}
          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
            <p className="font-medium text-blue-800 mb-1">Why collect this information?</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Save calculations for future reference</li>
              <li>• Generate professional energy reports</li>
              <li>• Contact customers with updates or recommendations</li>
              <li>• Build customer database for business insights</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}