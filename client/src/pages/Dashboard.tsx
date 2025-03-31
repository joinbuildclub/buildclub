import { useAuth } from "@/hooks/use-auth";
import DashboardHeader from "@/components/DashboardHeader";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "ambassador";
  
  return (
    <div className="page-container bg-gray-50 dashboard-font">
      <DashboardHeader />
      <div className="main-content">
        {isAdmin ? <AdminDashboard /> : <MemberDashboard />}
      </div>
    </div>
  );
}