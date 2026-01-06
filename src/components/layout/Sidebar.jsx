import React from 'react';
import { LayoutDashboard, FileText, List, User, LogOut, Shield } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';

const Sidebar = ({ currentPage, onNavigate }) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  
  // FIXED: Strict role checking with explicit fallback to 'citizen'
  const userRole = user?.publicMetadata?.role || 'citizen';
  const isGovernment = userRole === 'government' || userRole === 'admin';
  
  // Debug logging (remove in production)
  console.log('👤 Current User Role:', userRole, 'Is Government:', isGovernment);
  
  const userMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'report', icon: FileText, label: 'Report Issue' },
    { id: 'my-issues', icon: List, label: 'My Issues' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];
  
  const govMenuItem = {
    id: 'government', 
    icon: Shield, 
    label: 'Gov Dashboard',
    highlight: true
  };
  
  // FIXED: Only add government menu if explicitly government
  const menuItems = isGovernment ? [govMenuItem, ...userMenuItems] : userMenuItems;
  
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };
  
  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen p-6 fixed left-0 top-0 shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">InfraSense</h1>
        <p className="text-blue-200 text-sm mt-1">Smart Community Platform</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === item.id
                ? 'bg-white text-blue-600 font-semibold shadow-md'
                : item.highlight
                ? 'bg-yellow-500 text-white font-semibold hover:bg-yellow-400'
                : 'hover:bg-blue-500 text-blue-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500 text-blue-100 transition-colors mt-8"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
      
      {/* User Info */}
      <div className="mt-auto pt-8 border-t border-blue-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.firstName || 'User'}</p>
            <p className="text-blue-200 text-xs">
              {/* FIXED: Display actual role */}
              {isGovernment ? '🏛️ Government' : '👤 Citizen'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;