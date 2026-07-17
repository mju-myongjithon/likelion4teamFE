import { useEffect, useRef, useState } from 'react';
import SyncCharacter from '../components/SyncCharacter';
import TraitGroupCard from '../components/TraitGroupCard';
import FeatureTagRow from '../components/FeatureTagRow';
import { analyzePhotos, getTodayAnalysis } from '../api/analysisApi';
import { getPhotoStatus, getTodayPhotos } from '../api/photoApi';

export default function AnalysisPage({ uploadedPhotos, onGoToUpload, onViewMatch }) {
  const [photos, setPhotos] = useState(uploadedPhotos);
  const [status, setStatus] = useState('checking'); // checking | idle | loading | done | error
  const [features, setFeatures] = useState(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function init() {
    setStatus('checking');
    try {
      // 오늘 이미 분석해둔 게 있으면 새로 분석하지 않고 바로 보여준다
      const existing = await getTodayAnalysis();
      if (existing?.features) {
        setFeatures(existing.features);
        await ensurePhotosLoaded();
        setStatus('done');
        return;
      }
    } catch (err) {
      // "오늘 분석 없음"(404 등)은 정상 흐름이라 무시하고 아래로 진행
    }
    await tryStartAnalysis();
  }

  async function ensurePhotosLoaded() {
    if (photos.length > 0) return;
    try {
      const todayPhotos = await getTodayPhotos();
      setPhotos(todayPhotos);
    } catch {
      // 사진 목록을 못 가져와도 텍스트 결과는 보여줄 수 있으니 무시
    }
  }

  async function tryStartAnalysis() {
    if (photos.length === 0) {
      try {
        const photoStatus = await getPhotoStatus();
        if (!photoStatus.readyForAnalysis) {
          setStatus('idle');
          return;
        }
        const todayPhotos = await getTodayPhotos();
        setPhotos(todayPhotos);
      } catch (err) {
        setStatus('idle');
        return;
      }
    }
    runAnalysis();
  }

  async function runAnalysis() {
    setStatus('loading');
    try {
      const data = await analyzePhotos();
      setFeatures(data.features);
      setStatus('done');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div className="screen analysis-screen">
      <p className="eyebrow">RESULT</p>

      {/* 'checking' 상태는 의도적으로 아무것도 렌더링하지 않는다 — F3/F5와 같은 이유로,
          오늘 분석 여부 조회 응답이 워낙 빨라서 로딩 화면을 넣으면 오히려 한 프레임
          반짝이는 것처럼 보였다. */}

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
          <p className="screen-sub">사진 속 장소, 시간, 분위기를 읽고 있어요.</p>
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

      {status === 'done' && features && (
        <>
          <h1 className="screen-title">오늘의 싱크</h1>
          <p className="screen-sub">{features.summary}</p>

          <div className="trait-group-list">
            <TraitGroupCard title="장소" items={features.scene} photos={photos} />

           <FeatureTagRow title="시간대" tags={features.timeOfDay} variant="time" />
            <FeatureTagRow title="분위기" tags={features.mood} />
            <FeatureTagRow title="색감" tags={features.color} variant="color" />

            <TraitGroupCard title="활동" items={features.activity} photos={photos} />
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