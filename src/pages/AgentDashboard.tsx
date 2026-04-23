import { useState } from "react";
import { Sprout, AlertTriangle, ChevronRight, Camera, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StageBadge, StatusBadge } from "@/components/StatusBadge";
import { FIELDS, type Stage } from "@/lib/mock-data";
import { useRole } from "@/components/RoleContext";
import { toast } from "sonner";

const AgentDashboard = () => {
  const { user } = useRole();
  const myFields = FIELDS.filter(f => f.agent === user.name || f.agent === "Amina Yusuf");
  const needsUpdate = myFields.filter(f => f.status === "At Risk" || f.stage === "Ready").length;
  const [openId, setOpenId] = useState<string | null>(myFields[0]?.id ?? null);
  const [stage, setStage] = useState<Stage>("Growing");
  const [note, setNote] = useState("");

  const submit = () => {
    toast.success("Field updated", { description: `Stage set to ${stage}` });
    setNote("");
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-6 shadow-glow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-leaf opacity-40" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Today</div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">Hi {user.name.split(" ")[0]} 👋</h1>
          <p className="text-primary-foreground/80 mt-1">You have <b>{needsUpdate}</b> fields that need an update.</p>
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
              <div className="font-display text-2xl font-semibold">{needsUpdate}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Field list */}
        <Card className="lg:col-span-2 border-border/60 shadow-soft">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">My fields</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 p-3">
            {myFields.map(f => {
              const open = openId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => { setOpenId(f.id); setStage(f.stage); }}
                  className={`w-full text-left rounded-xl border p-3 transition-smooth ${open ? "border-primary bg-primary/5 shadow-soft" : "border-transparent hover:bg-muted/60"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.crop} · {f.area}</div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-smooth ${open ? "translate-x-0.5 text-primary" : ""}`} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StageBadge stage={f.stage} />
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
            const f = myFields.find(x => x.id === openId);
            if (!f) return <CardContent className="p-8 text-muted-foreground">Select a field</CardContent>;
            return (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-display text-xl">{f.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{f.crop} · {f.area} · planted {f.plantedDate}</p>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {f.notes && (
                    <div className="rounded-lg border border-status-risk/30 bg-status-risk/10 p-3 text-sm">
                      <div className="font-medium text-status-risk flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Attention needed</div>
                      <p className="mt-1 text-foreground/80">{f.notes}</p>
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
                    <Button onClick={submit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Send className="h-4 w-4 mr-1.5" /> Submit update
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
