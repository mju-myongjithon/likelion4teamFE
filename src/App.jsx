import { useState } from 'react';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import MatchPage from './pages/MatchPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [tab, setTab] = useState('upload'); // upload | analysis | profile
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [resultView, setResultView] = useState('analysis'); // analysis | match

  function handleUploaded(photos) {
    setUploadedPhotos(photos);
    setResultView('analysis');
    setTab('analysis');
  }

  function handleTabChange(nextTab) {
    if (nextTab === 'analysis') setResultView('analysis');
    setTab(nextTab);
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

        {tab === 'analysis' && resultView === 'match' && <MatchPage />}

        {tab === 'profile' && <ProfilePage />}
      </div>

      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  );
}