import { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
}

export default function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get("http://localhost:3000/tickets", {
                withCredentials: true,
            });
            setTickets(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-100 text-blue-800";
            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-800";
            case "RESOLVED":
                return "bg-green-100 text-green-800";
            case "CLOSED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW":
                return "bg-green-100 text-green-800";
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800";
            case "HIGH":
                return "bg-orange-100 text-orange-800";
            case "URGENT":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading tickets...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {tickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No tickets found. Create your first ticket!
                </div>
            ) : (
                tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {ticket.title}
                                </h3>
                                <p className="mt-2 text-gray-600">{ticket.description}</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            ticket.status
                                        )}`}
                                    >
                                        {ticket.status}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                            ticket.priority
                                        )}`}
                                    >
                                        {ticket.priority}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
