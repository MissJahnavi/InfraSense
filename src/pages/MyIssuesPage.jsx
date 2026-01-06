import React, { useState, useEffect } from 'react';
import { List, Map as MapIcon } from 'lucide-react';
import { IssueCard, LoadingSpinner, IssuesMap } from '../components';
import { API_BASE_URL } from '../config/api';

const MyIssuesPage = ({ userId, onViewIssue }) => {
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  
  useEffect(() => {
    fetchMyIssues();
  }, []);
  
  const fetchMyIssues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`);
      const allIssues = await response.json();
      const userIssues = allIssues.filter(issue => issue.userId === userId);
      setMyIssues(userIssues);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Reported Issues</h2>
        <div className="flex gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
          
          <button
            onClick={fetchMyIssues}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {myIssues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-100">
          <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">You haven't reported any issues yet.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 gap-6">
          {myIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} onView={() => onViewIssue(issue.id)} />
          ))}
        </div>
      ) : (
        <div style={{ height: '600px' }}>
          <IssuesMap 
            issues={myIssues} 
            onIssueClick={onViewIssue}
            zoom={12}
          />
        </div>
      )}
    </div>
  );
};

export default MyIssuesPage;