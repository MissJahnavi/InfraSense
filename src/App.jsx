import React, { useState } from 'react';
import { useUser, SignIn, SignUp } from '@clerk/clerk-react';
import { Sidebar, Header } from './components';
import {
  LandingPage,
  DashboardPage,
  ReportIssuePage,
  MyIssuesPage,
  IssueDetailPage,
  ProfilePage,
  GovernmentDashboard
} from './pages';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  const { isSignedIn, user, isLoaded } = useUser();
  
  // FIXED: Strict role checking with explicit default
  const userRole = user?.publicMetadata?.role || 'citizen';
  const isGovernment = userRole === 'government' || userRole === 'admin';
  
  // Debug logging
  if (user) {
    console.log('👤 App.jsx - User:', user.id, 'Role:', userRole, 'Is Gov:', isGovernment);
  }
  
  const handleLogout = async () => {
    setCurrentPage('landing');
  };
  
  const handleViewIssue = (issueId) => {
    setSelectedIssueId(issueId);
    setCurrentPage('issue-detail');
  };
  
  const handleReportSuccess = () => {
    setCurrentPage('my-issues');
  };
  
  const handleAuthClick = (type) => {
    if (type === 'signin') {
      setShowSignIn(true);
      setShowSignUp(false);
    } else {
      setShowSignUp(true);
      setShowSignIn(false);
    }
  };
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (showSignIn && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="relative">
          <button
            onClick={() => {
              setShowSignIn(false);
              setCurrentPage('landing');
            }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
          >
            ✕
          </button>
          <SignIn 
            afterSignInUrl="/dashboard"
            routing="hash"
            signUpUrl="#"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    );
  }
  
  if (showSignUp && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="relative">
          <button
            onClick={() => {
              setShowSignUp(false);
              setCurrentPage('landing');
            }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
          >
            ✕
          </button>
          <SignUp 
            afterSignUpUrl="/dashboard"
            routing="hash"
            signInUrl="#"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>
    );
  }
  
  if (!isSignedIn && currentPage === 'landing') {
    return <LandingPage onNavigate={handleAuthClick} />;
  }
  
  if (!isSignedIn) {
    return <LandingPage onNavigate={handleAuthClick} />;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <div className="ml-64">
        <Header userName={user.fullName || user.firstName || 'User'} user={user} />
        
        <main>
          {currentPage === 'dashboard' && <DashboardPage userId={user.id} />}
          {currentPage === 'report' && <ReportIssuePage userId={user.id} onSuccess={handleReportSuccess} />}
          {currentPage === 'my-issues' && <MyIssuesPage userId={user.id} onViewIssue={handleViewIssue} />}
          {currentPage === 'issue-detail' && (
            <IssueDetailPage
              issueId={selectedIssueId}
              onBack={() => setCurrentPage('my-issues')}
            />
          )}
          {currentPage === 'profile' && <ProfilePage user={user} />}
          
          {/* FIXED: Strict access control for government dashboard */}
          {currentPage === 'government' && isGovernment && <GovernmentDashboard />}
          {currentPage === 'government' && !isGovernment && (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
                <p className="text-red-600 mb-4">
                  You do not have government authorization to access this dashboard.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Current Role: <strong>{userRole}</strong>
                </p>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to My Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;