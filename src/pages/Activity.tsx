import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Bell, Clock, User, MapPin } from "lucide-react";
import { StageBadge } from "@/components/StatusBadge";

const Activity = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: () => apiFetch("/updates"),
  });

  const updates = response?.data || [];

  if (isLoading) return <AppLayout><div className="p-8 text-center">Loading activity...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-5 max-w-4xl mx-auto animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" /> Activity
          </h1>
          <p className="text-muted-foreground mt-1">Real-time log of field updates and agent activities.</p>
        </div>

        <div className="space-y-4">
          {updates.map((update: any) => (
            <Card key={update.id} className="border-border/60 shadow-soft overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-1 bg-primary" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{update.updated_by?.name}</span>
                          <span className="text-muted-foreground font-normal">updated</span>
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-primary">{update.field?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(update.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <StageBadge stage={update.stage} />
                    </div>
                    
                    {update.notes && (
                      <div className="bg-muted/30 rounded-lg p-3 text-sm text-foreground/80 italic border border-border/40">
                        "{update.notes}"
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {updates.length === 0 && (
            <Card className="border-dashed border-2 bg-transparent">
              <CardContent className="p-12 text-center text-muted-foreground">
                No activity recorded yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Activity;
