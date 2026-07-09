export default function SyncCharacter() {
  return (
    <div className="sync-character">
      <div className="sync-character__face">
        <span className="sync-character__eye" />
        <span className="sync-character__eye" />
        <svg viewBox="0 0 40 20" className="sync-character__mouth" aria-hidden="true">
          <path d="M6 4c6 10 22 10 28 0" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div className="sync-character__steps" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
