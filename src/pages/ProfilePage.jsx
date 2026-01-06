import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

const ProfilePage = ({ user }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h2>
      
      {/* Clerk's built-in profile management UI */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none"
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;