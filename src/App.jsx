import { useState } from 'react';
import AppHeader from './components/AppHeader';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';

export default function App() {
  const [step, setStep] = useState('upload'); // upload | analysis
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  function handleUploaded(photos) {
    setUploadedPhotos(photos);
    setStep('analysis');
  }

  function handleBackToUpload() {
    setStep('upload');
  }

  return (
    <div className="app-frame">
      <AppHeader />
      {step === 'upload' && <UploadPage onUploaded={handleUploaded} />}
      {step === 'analysis' && (
        <AnalysisPage uploadedPhotos={uploadedPhotos} onBack={handleBackToUpload} />
      )}
    </div>
  );
}
