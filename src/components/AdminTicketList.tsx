import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Edit } from "lucide-react";

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    userId: string;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
}

export default function AdminTicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAllTickets();
    }, []);

    const fetchAllTickets = async () => {
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

    const fetchComments = async (ticketId: string) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/tickets/${ticketId}/comments`,
                { withCredentials: true }
            );
            setComments(response.data);
        } catch (err: any) {
            console.error("Failed to fetch comments:", err);
        }
    };

    const handleSelectTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setNewStatus(ticket.status);
        fetchComments(ticket.id);
    };

    const handleStatusChange = async () => {
        if (!selectedTicket || newStatus === selectedTicket.status) return;

        try {
            await axios.patch(
                `http://localhost:3001/tickets/${selectedTicket.id}/status`,
                { status: newStatus },
                { withCredentials: true }
            );

            // Update local state
            setTickets(
                tickets.map((t) =>
                    t.id === selectedTicket.id ? { ...t, status: newStatus } : t
                )
            );
            setSelectedTicket({ ...selectedTicket, status: newStatus });
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !newComment.trim()) return;

        try {
            await axios.post(
                `http://localhost:3000/tickets/${selectedTicket.id}/comments`,
                { content: newComment },
                { withCredentials: true }
            );

            setNewComment("");
            fetchComments(selectedTicket.id);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to add comment");
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">All Tickets</h3>
                {tickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No tickets found</div>
                ) : (
                    tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => handleSelectTicket(ticket)}
                            className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow ${selectedTicket?.id === ticket.id ? "ring-2 ring-blue-500" : ""
                                }`}
                        >
                            <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                {ticket.description}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        ticket.status
                                    )}`}
                                >
                                    {ticket.status}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                        ticket.priority
                                    )}`}
                                >
                                    {ticket.priority}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Ticket Details */}
            {selectedTicket ? (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Ticket Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    {selectedTicket.title}
                                </h4>
                                <p className="mt-2 text-gray-600">{selectedTicket.description}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                    <button
                                        onClick={handleStatusChange}
                                        disabled={newStatus === selectedTicket.status}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Edit size={16} />
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare size={20} />
                            Comments
                        </h3>

                        <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-sm">No comments yet</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 rounded p-3">
                                        <p className="text-gray-800">{comment.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="space-y-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Add Comment
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12">
                    <p className="text-gray-500">Select a ticket to view details</p>
                </div>
            )}
        </div>
    );
}
