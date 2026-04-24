import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Users, Mail, Shield } from "lucide-react";

const Agents = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: () => apiFetch("/users/agents"),
  });

  const agents = response?.data || [];

  if (isLoading) return <AppLayout><div className="p-8 text-center">Loading agents...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-5 max-w-[1400px] mx-auto animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" /> Agents
          </h1>
          <p className="text-muted-foreground mt-1">Manage and monitor field agents assigned to your plots.</p>
        </div>

        <Card className="border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Registered Agents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent: any) => (
                  <TableRow key={agent.id} className="border-border">
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {agent.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full w-fit">
                        <Shield className="h-3 w-3" />
                        Field Agent
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-mono">
                      {agent.id}
                    </TableCell>
                  </TableRow>
                ))}
                {agents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No agents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Agents;
