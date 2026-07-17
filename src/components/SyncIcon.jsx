export const WHITE = '#FFFFFF';
export const SKY_BLUE = 'var(--color-accent)';
export const OVERLAP_COLOR = `color-mix(in srgb, ${WHITE} 50%, ${SKY_BLUE} 50%)`;

// 겹친 넓이가 원 면적의 약 50%가 되도록 중심 거리를 반지름의 0.8배로 잡는다
// (public/favicon.svg와 같은 비율). 테두리도 파비콘과 같은 두께 비율(반지름의 25%)로 맞췄다.
export const R = 40;
export const CY = 44;
export const LEFT_CX = 44;
export const RIGHT_CX = LEFT_CX + R * 0.8;
export const STROKE_WIDTH = R * 0.25;

export const VIEW_BOX_WIDTH = RIGHT_CX + R + 4;
export const VIEW_BOX_HEIGHT = CY + R + 4;

export default function SyncIcon({ className }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
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
      <circle cx={LEFT_CX} cy={CY} r={R} fill="none" stroke={WHITE} strokeWidth={STROKE_WIDTH} />
      <circle cx={RIGHT_CX} cy={CY} r={R} fill="none" stroke={SKY_BLUE} strokeWidth={STROKE_WIDTH} />
    </svg>
  );
}
