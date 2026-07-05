export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__brand" aria-label="sync.day">
        <span>sync</span>
        <span className="app-header__dot">.</span>
        <span>day</span>
      </div>
      <span className="app-header__today">TODAY</span>
      <p className="app-header__sub">오늘의 순간을 기록하세요</p>
    </header>
  );
}
