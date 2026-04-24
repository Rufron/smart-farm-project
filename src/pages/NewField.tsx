import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sprout } from "lucide-react";
import { CROPS } from "@/lib/mock-data";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const NewField = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", crop_type: "", planting_date: "", assigned_agent_id: "", area: "" });

  const { data: agentsResponse } = useQuery({
    queryKey: ["agents"],
    queryFn: () => apiFetch("/users/agents"),
  });
  const agents = agentsResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (data: any) => apiFetch("/fields", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      toast.success("Field created successfully");
      nav("/fields");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create field");
    }
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.crop_type || !form.assigned_agent_id || !form.planting_date) {
      toast.error("Please complete required fields");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <button onClick={() => nav(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <Sprout className="h-7 w-7 text-primary" /> New field
          </h1>
          <p className="text-muted-foreground mt-1">Register a new plot and assign it to a field agent.</p>
        </div>

        <Card className="border-border/60 shadow-soft">
          <CardHeader><CardTitle className="text-base">Field details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Field name *</Label>
                  <Input id="name" placeholder="e.g. North Ridge" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">Use a memorable name your team will recognize.</p>
                </div>

                <div>
                  <Label>Crop type *</Label>
                  <Select value={form.crop_type} onValueChange={(v) => setForm({ ...form, crop_type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select crop" /></SelectTrigger>
                    <SelectContent>
                      {CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" placeholder="12.4 ha" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="mt-1.5" />
                </div>

                <div>
                  <Label htmlFor="date">Planting date *</Label>
                  <Input id="date" type="date" value={form.planting_date} onChange={(e) => setForm({ ...form, planting_date: e.target.value })} className="mt-1.5" />
                </div>

                <div>
                  <Label>Assign agent *</Label>
                  <Select value={form.assigned_agent_id} onValueChange={(v) => setForm({ ...form, assigned_agent_id: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select agent" /></SelectTrigger>
                    <SelectContent>
                      {agents.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                <Button type="submit" disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {mutation.isPending ? "Creating..." : "Create field"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => nav(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NewField;
