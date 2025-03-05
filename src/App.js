import React, { useState } from 'react';
import { withAuthenticator, Button } from '@aws-amplify/ui-react';
import { signOut } from '@aws-amplify/auth';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar currentView={view} setView={setView} />
      <div className="main-content">
        <header className="app-header">
          <h1>{view === 'files' ? 'Files' : 'Profile'}</h1>
          <Button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </Button>
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
    </div>
  );
}

export default withAuthenticator(App);