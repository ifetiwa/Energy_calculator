import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, Edit2, Save, X } from "lucide-react";
import { useCustomAppliances } from "@/hooks/use-custom-appliances";

export function ManageCustomAppliances() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRating, setEditRating] = useState<number>(0);
  
  const { customAppliances, updateCustomAppliance, deleteCustomAppliance } = useCustomAppliances();

  const startEditing = (appliance: any) => {
    setEditingId(appliance.id);
    setEditName(appliance.name);
    setEditRating(appliance.rating);
  };

  const saveEdit = () => {
    if (editingId && editName.trim() && editRating > 0) {
      updateCustomAppliance(editingId, {
        name: editName.trim(),
        rating: editRating,
      });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditRating(0);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteCustomAppliance(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage Custom Appliances
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Manage Custom Appliances</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {customAppliances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No custom appliances created yet.</p>
              <p className="text-sm">Use "Create Custom Appliance" to add your own appliances.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating (W)</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customAppliances.map((appliance) => (
                  <TableRow key={appliance.id}>
                    <TableCell>
                      {editingId === appliance.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full"
                          data-testid={`input-edit-name-${appliance.id}`}
                        />
                      ) : (
                        <span data-testid={`text-appliance-name-${appliance.id}`}>
                          {appliance.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === appliance.id ? (
                        <Input
                          type="number"
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="w-20"
                          min="1"
                          data-testid={`input-edit-rating-${appliance.id}`}
                        />
                      ) : (
                        <span data-testid={`text-appliance-rating-${appliance.id}`}>
                          {appliance.rating}W
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" data-testid={`badge-category-${appliance.id}`}>
                        {appliance.category || "Other"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {editingId === appliance.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={saveEdit}
                              data-testid={`button-save-${appliance.id}`}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              data-testid={`button-cancel-edit-${appliance.id}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(appliance)}
                              data-testid={`button-edit-${appliance.id}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(appliance.id, appliance.name)}
                              className="text-red-500 hover:text-red-700"
                              data-testid={`button-delete-${appliance.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}