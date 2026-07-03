const ROTATIONS = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5];

export default function PhotoGrid({ photos, isPrivacyMode, maxCount, onRemove, onAddClick }) {
  return (
    <div className="photo-grid">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="polaroid"
          style={{ '--tilt': `${ROTATIONS[i % ROTATIONS.length]}deg` }}
        >
          <div className="polaroid__frame">
            <img
              src={photo.previewUrl}
              alt={`업로드한 사진 ${i + 1}`}
              className={`polaroid__img ${isPrivacyMode ? 'is-blurred' : ''}`}
            />
            {isPrivacyMode && <span className="polaroid__privacy-badge">얼굴 보호중</span>}
          </div>
          <button
            type="button"
            className="polaroid__remove"
            onClick={() => onRemove(photo.id)}
            aria-label="사진 삭제"
          >
            ×
          </button>
        </div>
      ))}

      {photos.length < maxCount && (
        <button type="button" className="polaroid polaroid--add" onClick={onAddClick}>
          <span className="polaroid__add-icon">+</span>
          <span className="polaroid__add-text">사진 추가</span>
        </button>
      )}
    </div>
  );
}
