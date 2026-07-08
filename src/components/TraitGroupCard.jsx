export default function TraitGroupCard({ title, score, tags, photos }) {
  const tiles = Array.from({ length: 4 }, (_, i) => ({
    tag: tags[i] ?? null,
    photo: photos.length ? photos[i % photos.length] : null,
  }));

  return (
    <div className="trait-group">
      <div className="trait-group__header">
        <span className="trait-group__title">{title}</span>
        <span className="trait-group__score">{score}%</span>
      </div>
      <div className="trait-group__grid">
        {tiles.map((tile, i) => (
          <div key={i} className="trait-group__tile">
            {tile.photo && (
              <img src={tile.photo.imageUrl} alt="" className="trait-group__tile-img" />
            )}
            {tile.tag && <span className="trait-group__tile-label">{tile.tag}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
