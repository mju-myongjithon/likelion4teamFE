// F2 결과 카드 — scene(장소)/activity(활동)처럼 { category, detail, photoIndex } 배열을
// 사진과 함께 타일로 보여준다. 점수(%) 필드는 실제 API에 없어서 제거함.
// photoIndex는 이 항목이 관찰된 사진의 업로드 순서(0-based)다. 값이 없거나(과거 저장된
// 분석 결과) 범위를 벗어나면 순서대로 돌려붙이는 방식으로 대체한다.
export default function TraitGroupCard({ title, items, photos }) {
  const tiles = items.map((item, i) => {
    const hasValidIndex =
      Number.isInteger(item.photoIndex) && item.photoIndex >= 0 && item.photoIndex < photos.length;
    return {
      item,
      photo: hasValidIndex ? photos[item.photoIndex] : photos.length ? photos[i % photos.length] : null,
    };
  });

  return (
    <div className="trait-group">
      <div className="trait-group__header">
        <span className="trait-group__title">{title}</span>
      </div>
      <div className="trait-group__grid">
        {tiles.map((tile, i) => (
          <div key={i} className="trait-group__tile">
            {tile.photo && (
              <img src={tile.photo.imageUrl} alt="" className="trait-group__tile-img" />
            )}
            <span className="trait-group__tile-label">
              {tile.item.category}
              {tile.item.detail ? ` · ${tile.item.detail}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
