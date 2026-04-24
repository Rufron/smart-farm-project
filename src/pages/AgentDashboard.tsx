import { useState, useEffect } from "react";
import { Sprout, AlertTriangle, ChevronRight, Camera, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StageBadge, StatusBadge } from "@/components/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useRole } from "@/components/RoleContext";
import { toast } from "sonner";

export type Stage = "Planted" | "Growing" | "Ready" | "Harvested";

const AgentDashboard = () => {
  const { user } = useRole();
  const queryClient = useQueryClient();

  const { data: dashResponse, isLoading } = useQuery({
    queryKey: ["dashboard-agent"],
    queryFn: () => apiFetch("/dashboard/agent"),
  });

  const [openId, setOpenId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("Growing");
  const [note, setNote] = useState("");

  const myFields = dashResponse?.data?.assigned_fields || [];
  const fieldsNeedingUpdate = dashResponse?.data?.fields_needing_updates || [];

  // Automatically select the first field if none is selected once fields have loaded
  useEffect(() => {
    if (!openId && myFields.length > 0) {
      setOpenId(myFields[0].id);
      setStage(myFields[0].current_stage);
    }
  }, [myFields, openId]);

  const updateMutation = useMutation({
    mutationFn: (data: { fieldId: string, stage: string, notes: string }) => {
      return apiFetch(`/fields/${data.fieldId}/update`, {
        method: "POST",
        body: JSON.stringify({ stage: data.stage, notes: data.notes })
      });
    },
    onSuccess: () => {
      toast.success("Field updated successfully");
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-agent"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update field");
    }
  });

  const submit = () => {
    if (!openId) return;
    updateMutation.mutate({ fieldId: openId, stage, notes: note });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto animate-fade-up">
      <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-6 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-leaf opacity-40" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Today</div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">Hi {user?.name.split(" ")[0]} 👋</h1>
          <p className="text-primary-foreground/80 mt-1">You have <b>{fieldsNeedingUpdate.length}</b> fields that need an update.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/60 shadow-soft">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Sprout className="h-5 w-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Assigned</div>
              <div className="font-display text-2xl font-semibold">{myFields.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-soft">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-status-risk/15 text-status-risk"><AlertTriangle className="h-5 w-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Need updates</div>
              <div className="font-display text-2xl font-semibold">{fieldsNeedingUpdate.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Field list */}
        <Card className="lg:col-span-2 border-border/60 shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">My fields</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 p-3">
            {myFields.map((f: any) => {
              const open = openId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => { setOpenId(f.id); setStage(f.current_stage); }}
                  className={`w-full text-left rounded-xl border p-3 transition-smooth ${open ? "border-primary bg-primary/5 shadow-soft" : "border-transparent hover:bg-muted/60"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.crop_type}</div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-smooth ${open ? "translate-x-0.5 text-primary" : ""}`} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StageBadge stage={f.current_stage} />
                    <StatusBadge status={f.status} />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Update panel */}
        <Card className="lg:col-span-3 border-border/60 shadow-soft">
          {(() => {
            const f = myFields.find((x: any) => x.id === openId);
            if (!f) return <CardContent className="p-8 text-muted-foreground">Select a field</CardContent>;
            return (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-display text-xl">{f.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{f.crop_type} · planted {new Date(f.planting_date).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {f.status === 'At Risk' && (
                    <div className="rounded-lg border border-status-risk/30 bg-status-risk/10 p-3 text-sm">
                      <div className="font-medium text-status-risk flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Attention needed</div>
                      <p className="mt-1 text-foreground/80">Make sure to submit an update to bring this field to active status.</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Update stage</label>
                    <Select value={stage} onValueChange={(v) => setStage(v as Stage)}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["Planted", "Growing", "Ready", "Harvested"] as Stage[]).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes & observations</label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Soil looks healthy, no pest activity…"
                      className="mt-1.5 min-h-[100px]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={submit} disabled={updateMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Send className="h-4 w-4 mr-1.5" /> {updateMutation.isPending ? "Updating..." : "Submit update"}
                    </Button>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-1.5" /> Add photo
                    </Button>
                  </div>
                </CardContent>
              </>
            );
          })()}
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;
