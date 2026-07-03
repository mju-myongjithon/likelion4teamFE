export default function FilmStrip({ current, min, max }) {
  const filled = Math.min(current, max);
  const slots = Array.from({ length: max }, (_, i) => i < filled);
  const isReady = current >= min;

  return (
    <div className="film-strip">
      <div className="film-strip__sprockets" aria-hidden="true">
        {slots.map((on, i) => (
          <span key={i} className={`film-strip__hole ${on ? 'is-exposed' : ''}`} />
        ))}
      </div>
      <div className="film-strip__label">
        <span className={`film-strip__count ${isReady ? 'is-ready' : ''}`}>
          오늘의 기록 {Math.min(current, max)}/{min}
        </span>
        {!isReady && (
          <span className="film-strip__hint">최소 {min}장이 필요해요</span>
        )}
      </div>
    </div>
  );
}
