import { Link } from "react-router-dom";
import { ArrowUpRight, Sprout, AlertTriangle, CheckCircle2, MapPinned, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StageBadge, StatusBadge } from "@/components/StatusBadge";
import { ACTIVITY, FIELDS } from "@/lib/mock-data";
import heroImg from "@/assets/fields-hero.jpg";

const StatCard = ({ icon: Icon, label, value, delta, tone = "primary" }: any) => (
  <Card className="relative overflow-hidden border-border/60 bg-gradient-card shadow-soft transition-smooth hover:shadow-glow hover:-translate-y-0.5">
    <div className="absolute inset-0 bg-gradient-leaf opacity-60 pointer-events-none" />
    <CardContent className="relative p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</div>
          {delta && (
            <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-status-active font-medium">
              <TrendingUp className="h-3 w-3" />{delta}
            </div>
          )}
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${tone}/10 text-${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatusBar = () => {
  const total = FIELDS.length;
  const active = FIELDS.filter(f => f.status === "Active").length;
  const risk = FIELDS.filter(f => f.status === "At Risk").length;
  const done = FIELDS.filter(f => f.status === "Completed").length;
  const seg = (n: number, color: string) => (
    <div style={{ width: `${(n / total) * 100}%` }} className={`h-full ${color} transition-smooth`} />
  );
  return (
    <Card className="border-border/60 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Field status breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {seg(active, "bg-status-active")}
          {seg(risk, "bg-status-risk")}
          {seg(done, "bg-status-completed")}
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { l: "Active", v: active, c: "bg-status-active" },
            { l: "At Risk", v: risk, c: "bg-status-risk" },
            { l: "Completed", v: done, c: "bg-status-completed" },
          ].map(s => (
            <div key={s.l} className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${s.c}`} /> {s.l}
              </div>
              <div className="font-display text-2xl font-semibold mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const total = FIELDS.length;
  const active = FIELDS.filter(f => f.status === "Active").length;
  const risk = FIELDS.filter(f => f.status === "At Risk").length;
  const done = FIELDS.filter(f => f.status === "Completed").length;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-hero text-primary-foreground shadow-glow">
        <img src={heroImg} alt="" width={1536} height={768} className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-overlay" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Season overview</div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mt-2">Good morning, Adaeze 🌱</h1>
            <p className="text-primary-foreground/80 mt-1.5 max-w-lg">
              {risk} fields need your attention today. {active} are progressing on schedule across {total} total fields.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary" className="bg-background/15 backdrop-blur text-primary-foreground border border-primary-foreground/20 hover:bg-background/25">
              <Link to="/fields">View all fields <ArrowUpRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button asChild className="bg-background text-primary hover:bg-background/90">
              <Link to="/fields/new"><Plus className="h-4 w-4 mr-1" />New field</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapPinned} label="Total Fields" value={total} delta="+2 this month" tone="primary" />
        <StatCard icon={Sprout} label="Active" value={active} delta="On track" tone="status-active" />
        <StatCard icon={AlertTriangle} label="At Risk" value={risk} tone="status-risk" />
        <StatCard icon={CheckCircle2} label="Completed" value={done} tone="status-completed" />
      </section>

      {/* Status + activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><StatusBar /></div>
        <Card className="border-border/60 shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ACTIVITY.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                  {a.who.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{a.target}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{a.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Fields table */}
      <section>
        <Card className="border-border/60 shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="font-display text-lg">All fields</CardTitle>
              <p className="text-sm text-muted-foreground">Monitor every plot at a glance</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/fields">View all <ArrowUpRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                    <TableHead>Field</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead className="hidden md:table-cell">Agent</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FIELDS.map(f => (
                    <TableRow key={f.id} className="border-border">
                      <TableCell>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-muted-foreground">{f.id} · {f.area}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{f.crop}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{f.agent}</TableCell>
                      <TableCell><StageBadge stage={f.stage} /></TableCell>
                      <TableCell><StatusBadge status={f.status} /></TableCell>
                      <TableCell className="hidden lg:table-cell text-right text-xs text-muted-foreground">{f.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboard;
