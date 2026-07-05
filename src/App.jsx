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
      <main className="app-main">
        {step === 'upload' && <UploadPage onUploaded={handleUploaded} />}
        {step === 'analysis' && (
          <AnalysisPage uploadedPhotos={uploadedPhotos} onBack={handleBackToUpload} />
        )}
      </main>
      <nav className="bottom-nav" aria-label="주요 메뉴">
        <button type="button" className={`bottom-nav__item ${step === 'upload' ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon">↑</span>
          <span>업로드</span>
        </button>
        <button type="button" className={`bottom-nav__item ${step === 'analysis' ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon">✦</span>
          <span>결과</span>
        </button>
        <button type="button" className="bottom-nav__item" disabled>
          <span className="bottom-nav__icon">○</span>
          <span>프로필</span>
        </button>
      </nav>
    </div>
  );
}
