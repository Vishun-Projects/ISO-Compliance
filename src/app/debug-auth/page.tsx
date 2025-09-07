'use client';

import { useState, useEffect } from 'react';

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState({
    token: null,
    userData: null,
    isAuthenticated: null
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const isAuth = localStorage.getItem('isAuthenticated');
      
      setAuthState({
        token: token ? 'Present' : 'Missing',
        userData: userData ? 'Present' : 'Missing',
        isAuthenticated: isAuth
      });
    };

    checkAuth();
    
    // Check every second
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const simulateLogin = () => {
    // Simulate setting auth data
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('userData', JSON.stringify({
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN',
      department: 'IT'
    }));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Force page reload to test layout
    window.location.reload();
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Authentication State</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Auth Token:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                authState.token === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {authState.token}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">User Data:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                authState.userData === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {authState.userData}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Is Authenticated:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                authState.isAuthenticated === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {authState.isAuthenticated}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={simulateLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Simulate Login
            </button>
            <button
              onClick={clearAuth}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear Auth
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation</h2>
          <div className="space-y-2">
            <a href="/login" className="block text-blue-600 hover:underline">Go to Login</a>
            <a href="/dashboard" className="block text-blue-600 hover:underline">Go to Dashboard</a>
            <a href="/test-layout" className="block text-blue-600 hover:underline">Go to Test Layout</a>
            <a href="/settings" className="block text-blue-600 hover:underline">Go to Settings</a>
          </div>
        </div>
      </div>
    </div>
  );
}
