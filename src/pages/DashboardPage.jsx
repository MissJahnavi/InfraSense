import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { DashboardStatCard, IssueCard, LoadingSpinner } from '../components';
import { API_BASE_URL } from '../config/api';

const DashboardPage = ({ userId }) => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`);
      const allIssues = await response.json();
      
      // Filter user's issues
      const userIssues = allIssues.filter(issue => issue.userId === userId);
      
      // Calculate stats
      setStats({
        total: userIssues.length,
        resolved: userIssues.filter(i => i.status === 'resolved').length,
        inProgress: userIssues.filter(i => i.status === 'in-progress').length
      });
      
      // Get recent issues (latest 4)
      setRecentIssues(userIssues.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <DashboardStatCard
          icon={FileText}
          label="Total Issues Reported"
          value={stats.total}
          color="bg-blue-600"
        />
        <DashboardStatCard
          icon={CheckCircle}
          label="Issues Resolved"
          value={stats.resolved}
          color="bg-green-600"
        />
        <DashboardStatCard
          icon={Clock}
          label="Issues In Progress"
          value={stats.inProgress}
          color="bg-yellow-600"
        />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        {recentIssues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent issues. Report your first issue to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {recentIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} onView={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;