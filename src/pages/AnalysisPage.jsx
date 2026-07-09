import { useEffect, useRef, useState } from 'react';
import SyncCharacter from '../components/SyncCharacter';
import TraitGroupCard from '../components/TraitGroupCard';
import { analyzePhotos } from '../api/analysisApi';

export default function AnalysisPage({ uploadedPhotos, onGoToUpload, onViewMatch }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (uploadedPhotos.length === 0) {
      setStatus('idle');
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedPhotos]);

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
      <p className="eyebrow">RESULT</p>

      {status === 'idle' && (
        <>
          <h1 className="screen-title">아직 오늘의 기록이 없어요</h1>
          <p className="screen-sub">먼저 오늘의 사진을 올려주세요</p>
          <button type="button" className="btn-primary" onClick={onGoToUpload}>
            사진 올리러 가기
          </button>
        </>
      )}

      {status === 'loading' && (
        <>
          <h1 className="screen-title">오늘의 나를 분석하는 중</h1>
          <p className="screen-sub">
            사진 {uploadedPhotos.length}장의 장소, 시간, 분위기를 읽고 있어요.
          </p>
          <SyncCharacter />
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
          <h1 className="screen-title">오늘의 싱크</h1>
          <p className="screen-sub">{result.summary}</p>

          <div className="trait-group-list">
            <TraitGroupCard
              title="나의 공간"
              score={result.spaceScore}
              tags={result.sceneTags}
              photos={uploadedPhotos}
            />
            <TraitGroupCard
              title="나의 바이브"
              score={result.vibeScore}
              tags={[result.mood, result.dominantColor, ...result.activityTags]}
              photos={uploadedPhotos}
            />
          </div>

          <div className="analysis-screen__footer">
            <button type="button" className="btn-primary" onClick={onViewMatch}>
              오늘의 매칭 보기
            </button>
          </div>
        </>
      )}
    </div>
  );
}