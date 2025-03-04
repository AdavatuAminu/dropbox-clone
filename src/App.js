import React, { useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPath, setCurrentPath] = useState('public/');
  const [view, setView] = useState('files');

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
    setCurrentPath(path);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dropbox Clone</h1>
        <div className="nav-buttons">
          <button 
            onClick={() => setView('files')}
            className={view === 'files' ? 'active' : ''}
          >
            Files
          </button>
          <button 
            onClick={() => setView('profile')}
            className={view === 'profile' ? 'active' : ''}
          >
            Profile
          </button>
        </div>
      </header>
      <main>
        {view === 'files' ? (
          <>
            <FileUpload 
              onUploadComplete={handleUploadComplete} 
              currentPath={currentPath} 
            />
            <FileList 
              refreshTrigger={refreshTrigger} 
              currentPath={currentPath} 
              onNavigate={handleNavigate} 
            />
          </>
        ) : (
          <Profile />
        )}
      </main>
    </div>
  );
}

export default withAuthenticator(App);