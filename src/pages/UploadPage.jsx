import { useRef, useState } from 'react';
import PhotoGrid from '../components/PhotoGrid';
import PrivacyToggle from '../components/PrivacyToggle';
import { uploadPhotos } from '../api/photoApi';

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 10;

export default function UploadPage({ onUploaded }) {
  const [photos, setPhotos] = useState([]);
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

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

  return (
    <div className="screen upload-screen">
      <PhotoGrid
        photos={photos}
        isPrivacyMode={isPrivacyMode}
        minCount={MIN_PHOTOS}
        onRemove={handleRemove}
        onSlotClick={() => inputRef.current?.click()}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="visually-hidden"
        onChange={handleFilesSelected}
      />

      <div className="upload-progress">
        <span>
          오늘의 기록 완료{' '}
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
          {isUploading ? '업로드하는 중…' : '오늘의 나 분석하기'}
        </button>
      </div>
    </div>
  );
}
