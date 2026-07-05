export default function PrivacyToggle({ checked, onChange }) {
  return (
    <div className="privacy-toggle">
      <span className="privacy-toggle__icon" aria-hidden="true">lock</span>
      <div className="privacy-toggle__text">
        <span className="privacy-toggle__label">프라이버시 모드</span>
        <span className="privacy-toggle__desc">
          {checked ? '얼굴은 흐리게 보호됩니다' : '사진을 원본 그대로 사용합니다'}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="프라이버시 모드"
        className={`privacy-toggle__switch ${checked ? 'is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="privacy-toggle__knob" />
      </button>
    </div>
  );
}
