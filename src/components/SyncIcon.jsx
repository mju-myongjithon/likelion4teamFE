const WHITE = '#FFFFFF';
const SKY_BLUE = 'var(--color-accent)';
const OVERLAP_COLOR = `color-mix(in srgb, ${WHITE} 50%, ${SKY_BLUE} 50%)`;

// SyncCharacter.jsx 로딩 애니메이션이 겹친 채로 멈춰 쉬는 순간(중심 거리/반지름 = 0.32,
// 겹친 넓이 ≈ 80%)을 그대로 정적으로 축소 재현한 워드마크 아이콘. public/favicon.svg는
// 겹침 비율이 달라서(0.8) 실제 로딩 애니메이션과 인상이 다르길래, 여기서는 애니메이션의
// 실제 수치를 그대로 가져와 새로 그렸다.
const R = 40;
const CY = 44;
const LEFT_CX = 44;
const RIGHT_CX = LEFT_CX + R * 0.32;

export default function SyncIcon({ className }) {
  return (
    <svg
      viewBox={`0 0 ${RIGHT_CX + R + 4} ${CY + R + 4}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="sync-icon-overlap-clip">
          <circle cx={LEFT_CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      <circle
        cx={RIGHT_CX}
        cy={CY}
        r={R}
        fill={OVERLAP_COLOR}
        clipPath="url(#sync-icon-overlap-clip)"
      />
      <circle cx={LEFT_CX} cy={CY} r={R} fill="none" stroke={WHITE} strokeWidth={R * 0.06} />
      <circle cx={RIGHT_CX} cy={CY} r={R} fill="none" stroke={SKY_BLUE} strokeWidth={R * 0.06} />
    </svg>
  );
}
