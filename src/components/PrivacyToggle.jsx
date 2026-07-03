export default function PrivacyToggle({ checked, onChange }) {
  return (
    <div className="privacy-toggle">
      <div className="privacy-toggle__text">
        <span className="privacy-toggle__label">프라이버시 모드</span>
        <span className="privacy-toggle__desc">
          {checked
            ? '얼굴은 자동으로 흐리게 처리돼요'
            : '원본 그대로 저장돼요'}
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
