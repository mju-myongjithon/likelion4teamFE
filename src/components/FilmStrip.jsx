export default function FilmStrip({ current, min }) {
  const count = Math.min(current, min);

  return (
    <div className="film-strip">
      <span className="film-strip__label">오늘의 기록 완료</span>
      <span className="film-strip__count">
        {count}/{min}
      </span>
    </div>
  );
}
