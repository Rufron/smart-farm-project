import { AppLayout } from "@/components/AppLayout";
import { useRole } from "@/components/RoleContext";
import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";

const Index = () => {
  const { role } = useRole();
  return <AppLayout>{role === "admin" ? <AdminDashboard /> : <AgentDashboard />}</AppLayout>;
};

export default Index;
