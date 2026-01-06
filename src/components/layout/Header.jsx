import React from 'react';
import { UserButton } from '@clerk/clerk-react';

const Header = ({ userName, user }) => (
  <div className="bg-white border-b border-gray-200 px-8 py-4 ml-64 shadow-sm">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userName}!</h2>
      <div className="flex items-center gap-4">
        {/* Clerk's built-in user button with profile management */}
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
    </div>
  </div>
);

export default Header;