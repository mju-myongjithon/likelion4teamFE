import { motion } from 'framer-motion';

const WHITE = '#FFFFFF';
// "MATCH" 같은 eyebrow 라벨과 정확히 같은 색을 쓰도록 하드코딩 대신 토큰을 직접 참조한다
const SKY_BLUE = 'var(--color-accent)';
// 겹치는 영역 색 = 두 테두리 색(흰색·하늘색)을 실제로 섞은 색. 하드코딩 대신
// color-mix()를 써서 SKY_BLUE가 참조하는 토큰이 바뀌어도 항상 정확히 따라간다.
const OVERLAP_COLOR = `color-mix(in srgb, ${WHITE} 50%, ${SKY_BLUE} 50%)`;

const RADIUS = 50;
const CY = 120;
const LEFT_CX = 110;
const RIGHT_CX = 290;
// 같은 반지름 원 두 개가 겹친 넓이가 한쪽 원 면적의 약 80%가 되려면 중심 간 거리가
// 반지름의 약 0.32배(≈16px)여야 한다 — 애초 중심 거리(180px)에서 16px까지 좁히려면
// 양쪽에서 각각 이만큼(82px)씩 다가가야 한다.
const MOVE = 82;

// 겹친 채로 멈춰있는 구간(0.35~0.65) 동안 두 원이 같은 방향·같은 양만큼 같이
// 흔들리게 해서, 겹친 넓이(비율)는 거의 그대로 유지한 채 "뭉친 덩어리"가 상하좌우로
// 흔들린다. 휴대폰 진동 느낌을 내려고 진폭은 작게, 방향 전환은 촘촘하게(11구간) 넣고
// 이 구간 전환에는 easeInOut 대신 linear를 써서 부드럽게 스윙하지 않고 딱딱 끊어지듯
// 움직이게 한다. 양 끝(첫/마지막 항목)은 흔들림 없이 깔끔하게 도착/출발하도록 0으로 맞춘다.
const WOBBLE = [
  { dx: 0, dy: 0 },
  { dx: 3, dy: -2 },
  { dx: -3, dy: 2 },
  { dx: 2, dy: -3 },
  { dx: -2, dy: 3 },
  { dx: 3, dy: 2 },
  { dx: -3, dy: -2 },
  { dx: 2, dy: 3 },
  { dx: -2, dy: -3 },
  { dx: 3, dy: -3 },
  { dx: -3, dy: 3 },
  { dx: 0, dy: 0 },
];

const WOBBLE_START = 0.35; // 원들이 다 모여드는 시점
const WOBBLE_END = 0.65; // 다시 떨어지기 시작하는 시점
const WOBBLE_TIMES = WOBBLE.map(
  (_, i) => WOBBLE_START + ((WOBBLE_END - WOBBLE_START) * i) / (WOBBLE.length - 1)
);

// 0(시작) · 0.35(도착) · 0.35~0.65(진동) · 0.65(정착) · 1(복귀)
const TIMES = [0, ...WOBBLE_TIMES, 1];
// 이동 구간(모임/헤어짐)은 easeInOut, 진동 구간은 linear로 딱딱 끊어지게
const EASES = ['easeInOut', ...Array(WOBBLE.length - 1).fill('linear'), 'easeInOut'];

const CY_KEYFRAMES = [CY, ...WOBBLE.map(({ dy }) => CY + dy), CY];
const LEFT_CX_KEYFRAMES = [LEFT_CX, ...WOBBLE.map(({ dx }) => LEFT_CX + MOVE + dx), LEFT_CX];
const RIGHT_CX_KEYFRAMES = [RIGHT_CX, ...WOBBLE.map(({ dx }) => RIGHT_CX - MOVE + dx), RIGHT_CX];
const OVERLAP_OPACITY_KEYFRAMES = [0, ...WOBBLE.map(() => 1), 0];

const TRANSITION = {
  duration: 3.5, // 1주기 시간(초)
  ease: EASES,
  repeat: Infinity,
  times: TIMES,
};

// 로딩 중(F2 분석 대기·F3 매칭 탐색/대기·F5 채팅 로딩) 공통으로 쓰는 애니메이션.
// 테두리만 있는 원 두 개(흰색·하늘색)가 가운데로 모여 면적의 약 80%가 겹친 채로
// 살짝 부들부들 떨다가, 다시 떨어진다. 겹치는 교집합 영역만 두 테두리 색을 섞은
// 색으로 채워 넣되, clipPath 자체가 원의 움직임(흔들림 포함)을 그대로 따라가므로
// 겹침이 없을 땐 교집합 넓이가 0 — 서서히 나타났다 서서히 사라지는 효과가 지오메트리
// 만으로 만들어지고, opacity 페이드를 얹어 그 전환을 한 번 더 부드럽게 한다.
export default function SyncCharacter() {
  return (
    <svg viewBox="0 0 400 240" style={{ width: '100%', height: '240px', overflow: 'visible' }}>
      <defs>
        <clipPath id="sync-character-overlap-clip">
          <motion.circle
            cx={LEFT_CX}
            cy={CY}
            r={RADIUS}
            animate={{ cx: LEFT_CX_KEYFRAMES, cy: CY_KEYFRAMES }}
            transition={TRANSITION}
          />
        </clipPath>
      </defs>

      {/* 겹치는 영역: 오른쪽 원과 같이 움직이되 왼쪽 원 모양으로 잘라내 교집합만 남긴다 */}
      <motion.circle
        cx={RIGHT_CX}
        cy={CY}
        r={RADIUS}
        fill={OVERLAP_COLOR}
        clipPath="url(#sync-character-overlap-clip)"
        animate={{
          cx: RIGHT_CX_KEYFRAMES,
          cy: CY_KEYFRAMES,
          opacity: OVERLAP_OPACITY_KEYFRAMES,
        }}
        transition={TRANSITION}
      />

      {/* 흰색 테두리 원 (배경 없음) */}
      <motion.circle
        cx={LEFT_CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        stroke={WHITE}
        strokeWidth={3}
        animate={{ cx: LEFT_CX_KEYFRAMES, cy: CY_KEYFRAMES }}
        transition={TRANSITION}
      />

      {/* 하늘색 테두리 원 (배경 없음) */}
      <motion.circle
        cx={RIGHT_CX}
        cy={CY}
        r={RADIUS}
        fill="none"
        stroke={SKY_BLUE}
        strokeWidth={3}
        animate={{ cx: RIGHT_CX_KEYFRAMES, cy: CY_KEYFRAMES }}
        transition={TRANSITION}
      />
    </svg>
  );
}
