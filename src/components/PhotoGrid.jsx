const SLOT_COUNT = 3;

export default function PhotoGrid({ photos, isPrivacyMode, onRemove, onAddClick }) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => photos[i] ?? null);

  return (
    <div className="photo-grid">
      {slots.map((photo, i) => {
        const slotClass = i === 0 ? 'photo-slot photo-slot--main' : 'photo-slot';

        if (!photo) {
          return (
            <button
              key={`empty-${i}`}
              type="button"
              className={`${slotClass} photo-slot--empty`}
              onClick={onAddClick}
              aria-label={`${i + 1}번째 사진 추가`}
            >
              <span className="photo-slot__plus" aria-hidden="true">+</span>
              {i === 0 && <span className="photo-slot__text">사진 추가</span>}
              <span className="photo-slot__index">{String(i + 1).padStart(2, '0')}</span>
            </button>
          );
        }

        return (
          <div key={photo.id} className={`${slotClass} photo-slot--filled`}>
            <img
              src={photo.previewUrl}
              alt={`업로드한 사진 ${i + 1}`}
              className={`photo-slot__img ${isPrivacyMode ? 'is-blurred' : ''}`}
            />
            {isPrivacyMode && <span className="photo-slot__privacy">보호 중</span>}
            <span className="photo-slot__index">{String(i + 1).padStart(2, '0')}</span>
            <button
              type="button"
              className="photo-slot__remove"
              onClick={() => onRemove(photo.id)}
              aria-label={`${i + 1}번째 사진 삭제`}
            >
              x
            </button>
          </div>
        );
      })}
    </div>
  );
}
