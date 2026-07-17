import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import PhotoGrid from '../components/PhotoGrid';
import PrivacyToggle from '../components/PrivacyToggle';
import { uploadPhotos } from '../api/photoApi';
import { getTodayAnalysis } from '../api/analysisApi';

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 10;

export default function UploadPage({ onUploaded }) {
  const [photos, setPhotos] = useState([]);
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  // null: 오늘 분석 여부 확인 중 | true: 오늘 이미 분석 완료(업로드 차단) | false: 업로드 가능
  const [isBlocked, setIsBlocked] = useState(null);
  const inputRef = useRef(null);
  const hasStarted = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (!hasStarted.current) {
      hasStarted.current = true;
      checkAlreadyAnalyzed();
    }
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 오늘 분석(F2)까지 이미 끝났으면 재업로드를 막는다 — BE도 업로드 단계에서 동일하게
  // 막지만(ALREADY_ANALYZED_TODAY), 여긴 그 전에 화면 자체를 안 보여주기 위한 UX 체크다.
  async function checkAlreadyAnalyzed() {
    try {
      await getTodayAnalysis();
      if (isMountedRef.current) setIsBlocked(true);
    } catch {
      if (isMountedRef.current) setIsBlocked(false);
    }
  }

  const canContinue = photos.length >= MIN_PHOTOS && !isUploading;

  function handleFilesSelected(e) {
    const incoming = Array.from(e.target.files ?? []);
    if (incoming.length === 0) return;

    setError(null);
    setPhotos((prev) => {
      const room = MAX_PHOTOS - prev.length;
      const accepted = incoming.slice(0, room);
      const next = [
        ...prev,
        ...accepted.map((file) => ({
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ];
      if (incoming.length > accepted.length) {
        setError(`최대 ${MAX_PHOTOS}장까지만 담을 수 있어요`);
      }
      return next;
    });

    e.target.value = '';
  }

  function handleRemove(id) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function handleContinue() {
    if (!canContinue) return;
    setIsUploading(true);
    setError(null);
    try {
      const uploaded = await uploadPhotos(
        photos.map((p) => p.file),
        isPrivacyMode
      );
      onUploaded(uploaded);
    } catch (err) {
      setError(err.message ?? '업로드에 실패했어요. 다시 시도해주세요');
    } finally {
      setIsUploading(false);
    }
  }

  // 확인 중에는 아무것도 그리지 않는다 — 응답이 워낙 빨라서 로딩 화면을 넣으면
  // 오히려 한 프레임 반짝이는 것처럼 보인다(F3 매칭 화면과 동일한 이유).
  if (isBlocked === null) {
    return <div className="screen upload-screen" />;
  }

  if (isBlocked) {
    return (
      <div className="screen upload-screen">
        <h1 className="screen-title">오늘은 이미 분석을 완료했어요</h1>
        <p className="screen-sub">
          오늘의 분석은 한 번만 진행돼요. 내일 다시 새로운 하루를 기록해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="screen upload-screen">
      <PhotoGrid
        photos={photos}
        isPrivacyMode={isPrivacyMode}
        minCount={MIN_PHOTOS}
        onRemove={handleRemove}
        onSlotClick={() => inputRef.current?.click()}
      />

      {isPrivacyMode && photos.length > 0 && (
        <div className="preview-notice">
          <Info size={14} strokeWidth={2} />
          <span>지금 보이는 흐림은 미리보기예요. 업로드하면 얼굴만 자동으로 가려져요</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="visually-hidden"
        onChange={handleFilesSelected}
      />

      <div className="upload-progress">
        <span>
          오늘의 순간{' '}
          <strong className={photos.length >= MIN_PHOTOS ? 'is-ready' : ''}>
            {Math.min(photos.length, MIN_PHOTOS)}/{MIN_PHOTOS}
          </strong>
        </span>
      </div>
      <hr className="section-divider" />

      <PrivacyToggle checked={isPrivacyMode} onChange={setIsPrivacyMode} />

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="upload-screen__footer">
        <button
          type="button"
          className="btn-primary"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {isUploading ? '업로드하는 중…' : '오늘의 순간 분석하기'}
        </button>
      </div>
    </div>
  );
}
