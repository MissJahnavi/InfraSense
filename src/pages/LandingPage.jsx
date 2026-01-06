// import React from 'react';
// import { AlertTriangle, FileText, TrendingUp, AlertCircle } from 'lucide-react';

// const LandingPage = ({ onNavigate }) => (
//   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
//     <nav className="bg-white shadow-sm px-8 py-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//             <AlertTriangle className="w-6 h-6 text-white" />
//           </div>
//           <span className="text-2xl font-bold text-gray-800">InfraSense</span>
//         </div>
//         <div className="flex gap-4">
//           {/* Replace with Clerk SignIn component */}
//           <button
//             onClick={() => onNavigate('dashboard')}
//             className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
//           >
//             Login
//           </button>
//           {/* Replace with Clerk SignUp component */}
//           <button
//             onClick={() => onNavigate('dashboard')}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
//           >
//             Sign Up
//           </button>
//         </div>
//       </div>
//     </nav>
    
//     <div className="max-w-7xl mx-auto px-8 py-20">
//       <div className="text-center mb-16">
//         <h1 className="text-5xl font-bold text-gray-900 mb-6">
//           Smart Community Infrastructure Reporting
//         </h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           Report local issues, track their status, and contribute to a smarter, more responsive community with AI-powered severity prediction.
//         </p>
//       </div>
      
//       <div className="grid md:grid-cols-3 gap-8 mb-16">
//         <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
//           <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//             <FileText className="w-7 h-7 text-blue-600" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-3">Report Issues</h3>
//           <p className="text-gray-600">
//             Easily report road damage, water leakage, garbage, electricity, and streetlight issues in your community.
//           </p>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
//           <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
//             <TrendingUp className="w-7 h-7 text-green-600" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-3">Track Status</h3>
//           <p className="text-gray-600">
//             Monitor your reported issues in real-time and receive updates as they progress from pending to resolved.
//           </p>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
//           <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
//             <AlertCircle className="w-7 h-7 text-purple-600" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Severity Prediction</h3>
//           <p className="text-gray-600">
//             ML-powered analysis automatically categorizes issue severity to prioritize critical problems.
//           </p>
//         </div>
//       </div>
      
//       <div className="text-center">
//         <button
//           onClick={() => onNavigate('dashboard')}
//           className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-xl"
//         >
//           Get Started Today
//         </button>
//       </div>
//     </div>
//   </div>
// );

// export default LandingPage;








import React from 'react';
import { AlertTriangle, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const LandingPage = ({ onNavigate }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
    <nav className="bg-white shadow-sm px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">InfraSense</span>
        </div>
        <div className="flex gap-4">
          {/* Trigger Clerk Sign In */}
          <button
            onClick={() => onNavigate('signin')}
            className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
          >
            Login
          </button>
          {/* Trigger Clerk Sign Up */}
          <button
            onClick={() => onNavigate('signup')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
    
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Community Infrastructure Reporting
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Report local issues, track their status, and contribute to a smarter, more responsive community with AI-powered severity prediction.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Report Issues</h3>
          <p className="text-gray-600">
            Easily report road damage, water leakage, garbage, electricity, and streetlight issues in your community.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Track Status</h3>
          <p className="text-gray-600">
            Monitor your reported issues in real-time and receive updates as they progress from pending to resolved.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Severity Prediction</h3>
          <p className="text-gray-600">
            ML-powered analysis automatically categorizes issue severity to prioritize critical problems.
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => onNavigate('signup')}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-xl"
        >
          Get Started Today
        </button>
      </div>
    </div>
  </div>
);

export default LandingPage;