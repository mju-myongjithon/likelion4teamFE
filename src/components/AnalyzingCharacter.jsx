export default function AnalyzingCharacter() {
  return (
    <div className="analyzing-character">
      <div className="analyzing-character__bob">
        <svg viewBox="0 0 160 160" className="analyzing-character__svg" aria-hidden="true">
          <path
            className="analyzing-character__face"
            d="M80 18c34 0 54 24 54 56 0 30-16 54-54 54s-54-24-54-54c0-32 20-56 54-56z"
          />
          <g className="analyzing-character__eyes">
            <ellipse className="analyzing-character__eye" cx="62" cy="76" rx="6" ry="8" />
            <ellipse className="analyzing-character__eye" cx="98" cy="76" rx="6" ry="8" />
          </g>
          <path
            className="analyzing-character__mouth"
            d="M64 100c6 8 26 8 32 0"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="analyzing-character__dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}