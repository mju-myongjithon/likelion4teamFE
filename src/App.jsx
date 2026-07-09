import { useState } from 'react';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [tab, setTab] = useState('upload'); // upload | analysis | profile
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  function handleUploaded(photos) {
    setUploadedPhotos(photos);
    setTab('analysis');
  }

  return (
    <div className="app-frame">
      <AppHeader />

      <div className="app-content">
        {tab === 'upload' && <UploadPage onUploaded={handleUploaded} />}
        {tab === 'analysis' && (
          <AnalysisPage
            uploadedPhotos={uploadedPhotos}
            onGoToUpload={() => setTab('upload')}
          />
        )}
        {tab === 'profile' && <ProfilePage />}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
