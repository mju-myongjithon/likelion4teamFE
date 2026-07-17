import { useState } from 'react';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import MatchPage from './pages/MatchPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import { getCurrentUserId, setCurrentUserId } from './utils/currentUser';

export default function App() {
  const [userId, setUserId] = useState(getCurrentUserId()); // F0 완료 전이면 null
  const [tab, setTab] = useState('upload'); // upload | analysis | profile
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [resultView, setResultView] = useState('analysis'); // analysis | match

  function handleProfileComplete(newUserId) {
    setCurrentUserId(newUserId);
    setUserId(newUserId);
  }

  function handleUploaded(photos) {
    setUploadedPhotos(photos);
    setResultView('analysis');
    setTab('analysis');
  }

  function handleTabChange(nextTab) {
    if (nextTab === 'analysis') setResultView('analysis');
    setTab(nextTab);
  }

  if (!userId) {
    return (
      <div className="app-frame">
        <ProfileSetupPage onComplete={handleProfileComplete} />
      </div>
    );
  }

  return (
    <div className="app-frame">
      <AppHeader />

      <div className="app-content">
        {tab === 'upload' && <UploadPage onUploaded={handleUploaded} />}

        {tab === 'analysis' && resultView === 'analysis' && (
          <AnalysisPage
            uploadedPhotos={uploadedPhotos}
            onGoToUpload={() => setTab('upload')}
            onViewMatch={() => setResultView('match')}
          />
        )}

        {tab === 'analysis' && resultView === 'match' && (
          <MatchPage
            onGoToUpload={() => setTab('upload')}
            onDecline={() => setResultView('analysis')}
            onEnterChat={() => setTab('chat')}
          />
        )}

        {tab === 'chat' && <ChatPage />}

        {tab === 'profile' && <ProfilePage />}
      </div>

      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  );
}