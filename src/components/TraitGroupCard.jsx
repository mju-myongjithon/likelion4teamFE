// F2 결과 카드 — scene(장소)/activity(활동)처럼 { category, detail } 배열을
// 사진과 함께 타일로 보여준다. 점수(%) 필드는 실제 API에 없어서 제거함.
// 사진-특징 매핑용 photoId가 응답에 없어서, 사진은 순서대로 돌려가며
// 장식적으로만 붙인다(실제로 그 사진에서 뽑힌 특징이라는 보장은 없음).
export default function TraitGroupCard({ title, items, photos }) {
  const tiles = items.map((item, i) => ({
    item,
    photo: photos.length ? photos[i % photos.length] : null,
  }));

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
