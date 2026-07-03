import { useEffect, useRef, useState } from 'react';
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
      <p className="eyebrow">F2 · AI 특징 분석</p>

      {status === 'loading' && (
        <>
          <h1 className="screen-title">오늘 하루를{'\n'}현상하는 중이에요</h1>
          <p className="screen-sub">
            사진 {uploadedPhotos.length}장에서 장소, 시간, 분위기를 읽는 중이에요
          </p>
          <div className="developing-tray">
            <div className="developing-photo">
              {uploadedPhotos.slice(0, 3).map((p, i) => (
                <img
                  key={p.photoId}
                  src={p.imageUrl}
                  alt=""
                  className="developing-photo__img"
                  style={{ '--i': i }}
                />
              ))}
              <div className="developing-photo__wash" />
            </div>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="screen-title">분석이 실패했어요</h1>
          <p className="screen-sub">잠시 후 다시 시도해주세요</p>
          <button type="button" className="btn-primary" onClick={runAnalysis}>
            다시 분석하기
          </button>
        </>
      )}

      {status === 'done' && result && (
        <>
          <h1 className="screen-title">오늘의 당신이{'\n'}이렇게 나왔어요</h1>
          <p className="screen-sub">
            이 특징으로 반대 캠퍼스에서 오늘을 닮은 사람을 찾아볼게요
          </p>
          <TraitReveal result={result} />

          <div className="analysis-screen__footer">
            <button type="button" className="btn-secondary" onClick={onBack}>
              사진 다시 고르기
            </button>
            <button type="button" className="btn-primary" disabled>
              매칭은 다음 단계에서 이어져요 (F3)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
