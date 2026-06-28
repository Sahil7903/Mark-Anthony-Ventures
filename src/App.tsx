/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export default function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status === 'ok' ? 'Online' : 'Offline'))
      .catch(() => setApiStatus('Offline'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Library API</h1>
        <p className="text-gray-600 mb-6">
          The Library Management System backend is running.
        </p>
        <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${apiStatus === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">API Status: {apiStatus}</span>
        </div>
        
        <div className="mt-8 text-left text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="font-semibold mb-2">Next Steps:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Configure your <code className="bg-gray-200 px-1 rounded text-gray-800">DATABASE_URL</code> in environment secrets for MongoDB.</li>
            <li>Use Postman or curl to test the <code className="bg-gray-200 px-1 rounded text-gray-800">/api/*</code> endpoints.</li>
            <li>Refer to the README for full API documentation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
