import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StageBadge, StatusBadge } from "@/components/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useRole } from "@/components/RoleContext";

export type Status = "Active" | "At Risk" | "Completed";

const Fields = () => {
  const { role } = useRole();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");

  const endpoint = role === "admin" ? "/fields" : "/fields/assigned";
  
  const { data: response, isLoading } = useQuery({
    queryKey: ["fields", endpoint],
    queryFn: () => apiFetch(endpoint)
  });

  const fieldsData = response?.data || [];

  const list = useMemo(() => {
    let l = fieldsData;
    if (q) l = l.filter((f: any) => (f.name + f.crop_type + (f.assigned_agent?.name || "")).toLowerCase().includes(q.toLowerCase()));
    if (filter !== "all") l = l.filter((f: any) => f.status === filter);
    return l;
  }, [q, filter, fieldsData]);

  if (isLoading) return <AppLayout><div className="p-8 text-center">Loading fields...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1400px] mx-auto animate-fade-up">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-semibold">Fields</h1>
            <p className="text-muted-foreground">{list.length} of {fieldsData.length} fields</p>
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
                {list.map((f: any) => (
                  <TableRow key={f.id} className="border-border">
                    <TableCell>
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{f.id}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{f.crop_type}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{f.assigned_agent?.name || "Unassigned"}</TableCell>
                    <TableCell><StageBadge stage={f.current_stage} /></TableCell>
                    <TableCell><StatusBadge status={f.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{new Date(f.planting_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{new Date(f.updatedAt).toLocaleDateString()}</TableCell>
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
