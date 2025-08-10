import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface SummaryDashboardProps {
  totalRating: number;
  totalDaily: number;
  totalMonthly: number;
  totalCost: number;
}

export function SummaryDashboard({
  totalRating,
  totalDaily,
  totalMonthly,
  totalCost,
}: SummaryDashboardProps) {
  return (
    <Card className="bg-gray-50 border-t">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Total Rating:</span>
            <span className="font-semibold">{formatNumber(totalRating, 0)} W</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Total Daily:</span>
            <span className="font-semibold text-blue-600">{formatNumber(totalDaily)} kWh</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Total Monthly:</span>
            <span className="font-semibold text-blue-600">{formatNumber(totalMonthly)} kWh</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Total Cost:</span>
            <span className="font-bold text-green-600 text-lg">{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
