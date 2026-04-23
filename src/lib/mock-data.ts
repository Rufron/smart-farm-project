export type Stage = "Planted" | "Growing" | "Ready" | "Harvested";
export type Status = "Active" | "At Risk" | "Completed";

export type Field = {
  id: string;
  name: string;
  crop: string;
  agent: string;
  stage: Stage;
  status: Status;
  plantedDate: string;
  lastUpdated: string;
  notes?: string;
  area: string;
};

export const CROPS = ["Maize", "Wheat", "Rice", "Soybean", "Tomato", "Cassava", "Sorghum", "Barley"];
export const AGENTS = ["Amina Yusuf", "David Okello", "Fatima Bello", "Joseph Mwangi", "Sara Ndlovu"];

export const FIELDS: Field[] = [
  { id: "F-001", name: "North Ridge", crop: "Maize", agent: "Amina Yusuf", stage: "Growing", status: "Active", plantedDate: "2025-02-12", lastUpdated: "2 hours ago", area: "12.4 ha" },
  { id: "F-002", name: "Riverside Plot", crop: "Rice", agent: "David Okello", stage: "Ready", status: "Active", plantedDate: "2025-01-08", lastUpdated: "1 day ago", area: "8.1 ha" },
  { id: "F-003", name: "Eastfield A", crop: "Wheat", agent: "Fatima Bello", stage: "Growing", status: "At Risk", plantedDate: "2025-02-22", lastUpdated: "5 hours ago", notes: "Low soil moisture detected", area: "6.7 ha" },
  { id: "F-004", name: "Sunny Acres", crop: "Tomato", agent: "Joseph Mwangi", stage: "Planted", status: "Active", plantedDate: "2025-03-30", lastUpdated: "3 days ago", area: "4.2 ha" },
  { id: "F-005", name: "Old Mill Field", crop: "Soybean", agent: "Sara Ndlovu", stage: "Harvested", status: "Completed", plantedDate: "2024-09-04", lastUpdated: "2 weeks ago", area: "9.8 ha" },
  { id: "F-006", name: "Hilltop North", crop: "Sorghum", agent: "Amina Yusuf", stage: "Growing", status: "Active", plantedDate: "2025-02-01", lastUpdated: "6 hours ago", area: "5.5 ha" },
  { id: "F-007", name: "West Valley", crop: "Cassava", agent: "David Okello", stage: "Growing", status: "At Risk", plantedDate: "2025-01-19", lastUpdated: "12 hours ago", notes: "Pest activity reported", area: "11.0 ha" },
  { id: "F-008", name: "Lower Bend", crop: "Barley", agent: "Fatima Bello", stage: "Ready", status: "Active", plantedDate: "2025-01-15", lastUpdated: "1 hour ago", area: "7.3 ha" },
  { id: "F-009", name: "Greenhouse 3", crop: "Tomato", agent: "Joseph Mwangi", stage: "Harvested", status: "Completed", plantedDate: "2024-10-12", lastUpdated: "1 month ago", area: "1.8 ha" },
  { id: "F-010", name: "South Plain", crop: "Maize", agent: "Sara Ndlovu", stage: "Planted", status: "Active", plantedDate: "2025-04-02", lastUpdated: "4 days ago", area: "14.6 ha" },
];

export const ACTIVITY = [
  { id: 1, who: "Amina Yusuf", action: "updated stage", target: "North Ridge → Growing", time: "2h ago" },
  { id: 2, who: "Fatima Bello", action: "flagged risk", target: "Eastfield A — low moisture", time: "5h ago" },
  { id: 3, who: "David Okello", action: "added note", target: "Riverside Plot", time: "1d ago" },
  { id: 4, who: "Joseph Mwangi", action: "marked ready", target: "Lower Bend", time: "1d ago" },
  { id: 5, who: "Sara Ndlovu", action: "completed harvest", target: "Old Mill Field", time: "2w ago" },
];
