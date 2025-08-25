import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Zap } from "lucide-react";
import { useCustomAppliances, type CustomApplianceTemplate } from "@/hooks/use-custom-appliances";

interface CustomApplianceDialogProps {
  onApplianceCreated?: (appliance: CustomApplianceTemplate) => void;
}

const applianceCategories = [
  "Kitchen Appliances",
  "Entertainment",
  "Cooling & Heating",
  "Lighting",
  "Computing",
  "Cleaning",
  "Personal Care",
  "Power Tools",
  "Other",
];

export function CustomApplianceDialog({ onApplianceCreated }: CustomApplianceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(100);
  const [category, setCategory] = useState<string>("Other");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addCustomAppliance, customAppliances } = useCustomAppliances();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || rating <= 0) {
      return;
    }

    // Check if appliance name already exists
    const existingAppliance = customAppliances.find(
      app => app.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingAppliance) {
      alert('An appliance with this name already exists. Please choose a different name.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newAppliance = addCustomAppliance({
        name: name.trim(),
        rating,
        category,
      });

      onApplianceCreated?.(newAppliance);
      
      // Reset form
      setName("");
      setRating(100);
      setCategory("Other");
      setOpen(false);
    } catch (error) {
      console.error('Error creating custom appliance:', error);
      alert('Failed to create custom appliance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Appliance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>Create Custom Appliance</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appliance-name">Appliance Name</Label>
            <Input
              id="appliance-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gaming Console, Rice Cooker"
              required
              data-testid="input-appliance-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appliance-rating">Power Rating (Watts)</Label>
            <Input
              id="appliance-rating"
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="100"
              min="1"
              max="10000"
              step="1"
              required
              data-testid="input-appliance-rating"
            />
            <p className="text-xs text-muted-foreground">
              Check the appliance label or manual for the power rating
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appliance-category">Category (Optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-appliance-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {applianceCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim() || rating <= 0}
              data-testid="button-create"
            >
              {isSubmitting ? "Creating..." : "Create Appliance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}