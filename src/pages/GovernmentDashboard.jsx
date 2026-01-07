import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Loader,
  RefreshCw,
  Calendar,
  MapPin,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { SeverityBadge, StatusBadge, LoadingSpinner } from "../components";

const GovernmentDashboard = () => {
  const { getToken } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first

  useEffect(() => {
    fetchData();
  }, [statusFilter, severityFilter, sortOrder]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     // const token = await getToken();
  //     const token = await getToken({ template: "default" });

  //     const payload = JSON.parse(atob(token.split(".")[1]));
  
  //     // Fetch stats
  //     const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const statsData = await statsRes.json();
  //     setStats(statsData);

  //     // Fetch issues with filters
  //     const params = new URLSearchParams();
  //     if (statusFilter !== "all") params.append("status", statusFilter);
  //     if (severityFilter !== "all") params.append("severity", severityFilter);
  //     params.append("sortBy", "createdAt");
  //     params.append("order", sortOrder);

  //     const issuesRes = await fetch(`${API_BASE_URL}/admin/issues?${params}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const issuesData = await issuesRes.json();
  //     setIssues(Array.isArray(issuesData.issues) ? issuesData.issues : []);

  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching government dashboard data:", error);
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
  try {
    setLoading(true);
    const token = await getToken({ template: "default" });

    // -------- Stats (FILTERED) --------
    const statsParams = new URLSearchParams();
    if (statusFilter !== "all") statsParams.append("status", statusFilter);
    if (severityFilter !== "all") statsParams.append("severity", severityFilter);

    const statsRes = await fetch(
      `${API_BASE_URL}/admin/stats?${statsParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const statsData = await statsRes.json();
    setStats(statsData);

    // -------- Issues (FILTERED) --------
    const issueParams = new URLSearchParams();
    if (statusFilter !== "all") issueParams.append("status", statusFilter);
    if (severityFilter !== "all") issueParams.append("severity", severityFilter);
    issueParams.append("sortBy", "createdAt");
    issueParams.append("order", sortOrder);

    const issuesRes = await fetch(
      `${API_BASE_URL}/admin/issues?${issueParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const issuesData = await issuesRes.json();
    setIssues(Array.isArray(issuesData) ? issuesData : []);

    setLoading(false);
  } catch (error) {
    console.error("Error fetching government dashboard data:", error);
    setLoading(false);
  }
};


  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      setUpdating(issueId);
      const token = await getToken();
      console.log("Updating issue:", issueId, "to status:", newStatus);

      const response = await fetch(
        `${API_BASE_URL}/admin/issues/${issueId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        // Update local state
        setIssues(
          issues.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : issue
          )
        );

        // Refresh stats
        fetchData();
      } else {
        alert("Failed to update issue status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating issue status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading && !issues.length) return <LoadingSpinner />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Government Dashboard
        </h1>
        <p className="text-gray-600">
          Manage and monitor all reported infrastructure issues
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Issues
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 rounded-full bg-blue-600">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.pending}
                </p>
              </div>
              <div className="p-4 rounded-full bg-gray-600">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.inProgress}
                </p>
              </div>
              <div className="p-4 rounded-full bg-yellow-600">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.resolved}
                </p>
              </div>
              <div className="p-4 rounded-full bg-green-600">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <button
            onClick={fetchData}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issue Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reported
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No issues found with current filters
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {issue.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {issue.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{issue.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={issue.severity} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={issue.status}
                        onChange={(e) =>
                          handleStatusUpdate(issue.id, e.target.value)
                        }
                        disabled={updating === issue.id}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="open">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      {updating === issue.id && (
                        <Loader className="inline-block w-4 h-4 ml-2 animate-spin text-blue-600" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
