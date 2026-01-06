import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
  </div>
);

export default LoadingSpinner;