import { cn } from "@/lib/utils";
import type { Stage, Status } from "@/lib/mock-data";

const statusStyles: Record<Status, string> = {
  Active: "bg-status-active/15 text-status-active border-status-active/30",
  "At Risk": "bg-status-risk/15 text-status-risk border-status-risk/30",
  Completed: "bg-status-completed/15 text-status-completed border-status-completed/30",
};

const stageStyles: Record<Stage, string> = {
  Planted: "bg-status-planted/15 text-status-planted border-status-planted/30",
  Growing: "bg-status-growing/15 text-status-growing border-status-growing/30",
  Ready: "bg-status-ready/15 text-status-ready border-status-ready/30",
  Harvested: "bg-status-harvested/15 text-status-harvested border-status-harvested/30",
};

export const StatusBadge = ({ status }: { status: Status }) => (
  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}>
    <span className={cn("h-1.5 w-1.5 rounded-full", status === "Active" && "bg-status-active animate-pulse-soft", status === "At Risk" && "bg-status-risk animate-pulse-soft", status === "Completed" && "bg-status-completed")} />
    {status}
  </span>
);

export const StageBadge = ({ stage }: { stage: Stage }) => (
  <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", stageStyles[stage])}>
    {stage}
  </span>
);
