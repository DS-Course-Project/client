import { useState } from "react";
import { authClient } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import TicketList from "../components/TicketList";
import CreateTicketForm from "../components/CreateTicketForm";
import NotificationBell from "../components/NotificationBell";
import { PlusCircle, LogOut } from "lucide-react";

export default function UserDashboard() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authClient.signOut();
        navigate("/login");
    };

    const handleTicketCreated = () => {
        setShowCreateForm(false);
        setRefreshKey((prev) => prev + 1); // Trigger refresh
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
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
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Your Tickets</h2>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <PlusCircle size={20} />
                        {showCreateForm ? "Cancel" : "Create Ticket"}
                    </button>
                </div>

                {/* Create Ticket Form */}
                {showCreateForm && (
                    <div className="mb-8 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Create New Ticket
                        </h3>
                        <CreateTicketForm onSuccess={handleTicketCreated} />
                    </div>
                )}

                {/* Ticket List */}
                <TicketList key={refreshKey} />
            </main>
        </div>
    );
}
