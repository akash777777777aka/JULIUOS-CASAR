import React from 'react';
import { WarningIcon } from '../icons/WarningIcon';

const FirebaseConfigNeeded: React.FC = () => {
  const keys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  return (
    <div className="bg-yellow-900/30 backdrop-blur-xl border border-amber-500/50 text-amber-100 p-6 sm:p-8 rounded-xl shadow-2xl max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-6">
        <WarningIcon className="w-16 h-16 text-amber-400 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-amber-300 mb-2">Configuration Needed</h2>
          <p className="text-amber-200">
            This app requires a Firebase connection for authentication and data storage.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
          <h3 className="font-bold text-lg text-amber-300 mb-2">1. Create a Firebase Project</h3>
          <p>
            Visit the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Firebase Console</a> and create a new project.
          </p>
        </div>
        
        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
          <h3 className="font-bold text-lg text-amber-300 mb-2">2. Enable Services</h3>
          <p>
            In your project, enable <strong>Authentication</strong> (with the Email/Password provider) and <strong>Firestore Database</strong>.
          </p>
        </div>

        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
          <h3 className="font-bold text-lg text-amber-300 mb-2">3. Add Credentials as Secrets</h3>
          <p>
            Add your Firebase project config keys as <strong>Secrets</strong> in this tool's environment:
          </p>
          <div className="mt-3 bg-gray-900/50 p-3 rounded font-mono text-xs text-amber-200">
            {keys.map(key => <div key={key}>{key}</div>)}
          </div>
        </div>
        <p className="text-center pt-2 text-amber-300">
          Refresh the application after adding the secrets.
        </p>
      </div>
    </div>
  );
};

export default FirebaseConfigNeeded;