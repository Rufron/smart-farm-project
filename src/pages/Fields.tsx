import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StageBadge, StatusBadge } from "@/components/StatusBadge";
import { FIELDS, type Status } from "@/lib/mock-data";
import { useRole } from "@/components/RoleContext";

const Fields = () => {
  const { role, user } = useRole();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");

  const list = useMemo(() => {
    let l = role === "agent" ? FIELDS.filter(f => f.agent === user.name || f.agent === "Amina Yusuf") : FIELDS;
    if (q) l = l.filter(f => (f.name + f.crop + f.agent).toLowerCase().includes(q.toLowerCase()));
    if (filter !== "all") l = l.filter(f => f.status === filter);
    return l;
  }, [q, filter, role, user.name]);

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-semibold">Fields</h1>
            <p className="text-muted-foreground">{list.length} of {FIELDS.length} fields</p>
          </div>
          {role === "admin" && (
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/fields/new"><Plus className="h-4 w-4 mr-1" />New field</Link>
            </Button>
          )}
        </div>

        <Card className="border-border/60 shadow-soft">
          <CardContent className="p-3 flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fields, crops, agents…" className="pl-9" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
              {(["all", "Active", "At Risk", "Completed"] as const).map(k => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded-md transition-smooth ${filter === k ? "bg-background shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {k === "all" ? "All" : k}
                </button>
              ))}
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                  <TableHead>Field</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead className="hidden md:table-cell">Agent</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Planted</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map(f => (
                  <TableRow key={f.id} className="border-border">
                    <TableCell>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.id} · {f.area}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{f.crop}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{f.agent}</TableCell>
                    <TableCell><StageBadge stage={f.stage} /></TableCell>
                    <TableCell><StatusBadge status={f.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{f.plantedDate}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{f.lastUpdated}</TableCell>
                  </TableRow>
                ))}
                {list.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No fields match your filters.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Fields;
