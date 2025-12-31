import { authClient } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import AdminTicketList from "../components/AdminTicketList";
import NotificationBell from "../components/NotificationBell";
import { LogOut, Shield } from "lucide-react";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authClient.signOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="text-blue-600" size={24} />
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminTicketList />
            </main>
        </div>
    );
}
