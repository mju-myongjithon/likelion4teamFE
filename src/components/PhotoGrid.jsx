import { Plus } from 'lucide-react';

export default function PhotoGrid({ photos, isPrivacyMode, minCount, onRemove, onSlotClick }) {
  const slotCount = Math.max(minCount, photos.length);
  const slots = Array.from({ length: slotCount }, (_, i) => photos[i] ?? null);

  return (
    <div className="photo-grid">
      {slots.map((photo, i) => {
        const isFirst = i === 0;
        const index = String(i + 1).padStart(2, '0');

        if (photo) {
          return (
            <div key={photo.id} className={`photo-slot photo-slot--filled ${isFirst ? 'photo-slot--main' : ''}`}>
              <img
                src={photo.previewUrl}
                alt={`업로드한 사진 ${i + 1}`}
                className={`photo-slot__img ${isPrivacyMode ? 'is-blurred' : ''}`}
              />
              <span className="photo-slot__index">{index}</span>
              <button
                type="button"
                className="photo-slot__remove"
                onClick={() => onRemove(photo.id)}
                aria-label="사진 삭제"
              >
                ×
              </button>
            </div>
          );
        }

        return (
          <button
            key={`empty-${i}`}
            type="button"
            className={`photo-slot photo-slot--empty ${isFirst ? 'photo-slot--main' : ''}`}
            onClick={() => onSlotClick(i)}
          >
            <span className="photo-slot__plus">
              <Plus size={18} strokeWidth={2} />
            </span>
            {isFirst ? (
              <span className="photo-slot__caption">사진 추가</span>
            ) : (
              <span className="photo-slot__caption photo-slot__caption--muted">{index}</span>
            )}
            {isFirst && <span className="photo-slot__index">{index}</span>}
          </button>
        );
      })}
    </div>
  );
}
