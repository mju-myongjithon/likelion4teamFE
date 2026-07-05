import { useEffect, useRef, useState } from 'react';
import AnalyzingCharacter from '../components/AnalyzingCharacter';
import TraitReveal from '../components/TraitReveal';
import { analyzePhotos } from '../api/analysisApi';

export default function AnalysisPage({ uploadedPhotos, onBack }) {
  const [status, setStatus] = useState('loading'); // loading | done | error
  const [result, setResult] = useState(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setStatus('loading');
    try {
      const data = await analyzePhotos(uploadedPhotos.map((p) => p.photoId));
      setResult(data);
      setStatus('done');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div className="screen analysis-screen">
      {status === 'loading' && (
        <>
          <div className="analysis-screen__intro">
            <p className="eyebrow">RESULT</p>
            <h1 className="screen-title">오늘의 나를 분석하는 중</h1>
            <p className="screen-sub">
              사진 {uploadedPhotos.length}장의 장소, 시간, 분위기를 읽고 있어요.
            </p>
          </div>
          <div className="developing-tray">
            <AnalyzingCharacter />
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="analysis-screen__state">
          <h1 className="screen-title">분석에 실패했어요</h1>
          <p className="screen-sub">잠시 후 다시 시도해 주세요.</p>
          <button type="button" className="btn-primary" onClick={runAnalysis}>
            다시 분석하기
          </button>
        </div>
      )}

      {status === 'done' && result && (
        <>
          <div className="analysis-screen__intro">
            <p className="eyebrow">RESULT</p>
            <h1 className="screen-title">오늘의 싱크</h1>
            <p className="screen-sub">
              같은 시간대, 비슷한 공간을 선호하네요.
            </p>
          </div>

          <TraitReveal result={result} />

          <div className="analysis-screen__footer">
            <p className="analysis-screen__summary">
              같은 시간대, 비슷한 공간을 선호하네요.
            </p>
            <button type="button" className="btn-primary">
              매칭하기
            </button>
            <button type="button" className="btn-secondary" onClick={onBack}>
              사진 다시 고르기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
