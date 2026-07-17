import { motion } from 'framer-motion';
import {
  CY,
  LEFT_CX,
  OVERLAP_COLOR,
  R,
  RIGHT_CX,
  SKY_BLUE,
  STROKE_WIDTH,
  VIEW_BOX_HEIGHT,
  VIEW_BOX_WIDTH,
  WHITE,
} from './SyncIcon';
import { SLOWDOWN } from './loginIntroTiming';

// 로그인(F0) 화면 전용 최초 진입 애니메이션. SyncCharacter.jsx 로딩 애니메이션과 같은 방식
// (clipPath로 두 원의 교집합만 오려내 겹침색을 채우는 방식)을 그대로 가져오되, 여기선 루프
// 없이 한 번만: 양옆 화면 밖에서 원 두 개가 날아와 SyncCharacter.jsx가 실제로 쉬는 지점과
// 같은 80% 겹침까지 바짝 모인 뒤(중심거리/반지름 = 0.32), 그 자리에서 잠깐 "부르르" 떨고,
// 다시 SyncIcon과 같은 최종 위치(50% 겹침, 0.8)까지 벌어지며 안착한다. 텍스트는 살짝
// 왼쪽에서 페이드인하며 제자리로 이동해 안착한다.
const MID_CX = (LEFT_CX + RIGHT_CX) / 2;
const TIGHT_HALF_DISTANCE = (R * 0.32) / 2;
const TIGHT_LEFT_CX = MID_CX - TIGHT_HALF_DISTANCE;
const TIGHT_RIGHT_CX = MID_CX + TIGHT_HALF_DISTANCE;

const FLY_DISTANCE = R * 4;
const START_LEFT_CX = TIGHT_LEFT_CX - FLY_DISTANCE;
const START_RIGHT_CX = TIGHT_RIGHT_CX + FLY_DISTANCE;

// 날아와 바짝 도착하기까지, 그 자리에서 부르르 떠는 구간, 다시 벌어져 최종 위치에
// 안착하는 구간 — 세 구간의 기준 길이(초).
const BASE_FLIGHT_DURATION = 1;
const BASE_WOBBLE_DURATION = 0.45;
const BASE_SETTLE_DURATION = 0.4;
const BASE_TOTAL_DURATION = BASE_FLIGHT_DURATION + BASE_WOBBLE_DURATION + BASE_SETTLE_DURATION;
const TOTAL_DURATION = BASE_TOTAL_DURATION * SLOWDOWN;
// 전체 구간(0~1) 중 도착 시점 · 부르르 종료 시점의 비율 — 배속과 무관하게 항상 같은
// 지점이다(분자·분모가 같이 늘어나므로).
const LANDED_AT = BASE_FLIGHT_DURATION / BASE_TOTAL_DURATION;
const WOBBLE_END_AT = (BASE_FLIGHT_DURATION + BASE_WOBBLE_DURATION) / BASE_TOTAL_DURATION;

// 바짝 도착한 뒤 짧게 흔들리는 폭(SyncCharacter.jsx의 WOBBLE을 이 아이콘 크기(R=40)에
// 맞게 축소). 첫 항(도착)·마지막 항(진동 종료)은 흔들림 없이 0으로 시작/종료한다.
const WOBBLE = [
  { dx: 0, dy: 0 },
  { dx: 2, dy: -1.5 },
  { dx: -2, dy: 1.5 },
  { dx: 1.5, dy: -2 },
  { dx: -1.5, dy: 1 },
  { dx: 0, dy: 0 },
];
const WOBBLE_TIMES = WOBBLE.map(
  (_, i) => LANDED_AT + ((WOBBLE_END_AT - LANDED_AT) * i) / (WOBBLE.length - 1)
);

const TIMES = [0, ...WOBBLE_TIMES, 1];
// 날아오는 구간은 easeOut, 부르르 구간은 SyncCharacter.jsx와 같은 이유로 linear(부드럽게
// 스윙하지 않고 딱딱 끊어지듯 떨리게), 마지막으로 벌어지며 안착하는 구간은 다시 easeOut.
const EASES = ['easeOut', ...Array(WOBBLE.length - 1).fill('linear'), 'easeOut'];

const CY_KEYFRAMES = [CY, ...WOBBLE.map(({ dy }) => CY + dy), CY];
const LEFT_CX_KEYFRAMES = [START_LEFT_CX, ...WOBBLE.map(({ dx }) => TIGHT_LEFT_CX + dx), LEFT_CX];
const RIGHT_CX_KEYFRAMES = [START_RIGHT_CX, ...WOBBLE.map(({ dx }) => TIGHT_RIGHT_CX + dx), RIGHT_CX];
const OVERLAP_OPACITY_KEYFRAMES = [0, ...WOBBLE.map(() => 1), 1];

const FLIGHT_TRANSITION = { duration: TOTAL_DURATION, ease: EASES, times: TIMES };
const TEXT_TRANSITION = { duration: 0.9 * SLOWDOWN, ease: 'easeOut' };

export default function AnimatedLogo() {
  return (
    <div className="profile-setup__logo-row">
      <svg
        viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
        className="profile-setup__logo-icon"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="profile-logo-overlap-clip">
            <motion.circle
              r={R}
              initial={{ cx: START_LEFT_CX, cy: CY }}
              animate={{ cx: LEFT_CX_KEYFRAMES, cy: CY_KEYFRAMES }}
              transition={FLIGHT_TRANSITION}
            />
          </clipPath>
        </defs>

        {/* 겹치는 영역: 오른쪽 원과 같이 움직이되 왼쪽 원 모양으로 잘라내 교집합만 남긴다 */}
        <motion.circle
          r={R}
          fill={OVERLAP_COLOR}
          clipPath="url(#profile-logo-overlap-clip)"
          initial={{ cx: START_RIGHT_CX, cy: CY, opacity: 0 }}
          animate={{ cx: RIGHT_CX_KEYFRAMES, cy: CY_KEYFRAMES, opacity: OVERLAP_OPACITY_KEYFRAMES }}
          transition={FLIGHT_TRANSITION}
        />

        <motion.circle
          r={R}
          fill="none"
          stroke={WHITE}
          strokeWidth={STROKE_WIDTH}
          initial={{ cx: START_LEFT_CX, cy: CY }}
          animate={{ cx: LEFT_CX_KEYFRAMES, cy: CY_KEYFRAMES }}
          transition={FLIGHT_TRANSITION}
        />
        <motion.circle
          r={R}
          fill="none"
          stroke={SKY_BLUE}
          strokeWidth={STROKE_WIDTH}
          initial={{ cx: START_RIGHT_CX, cy: CY }}
          animate={{ cx: RIGHT_CX_KEYFRAMES, cy: CY_KEYFRAMES }}
          transition={FLIGHT_TRANSITION}
        />
      </svg>

      {/* "."을 기준으로 두 조각으로 나눠, AnimatedSubtitle과 같은 방식(양옆에 흩어진 채
          페이드인하며 가운데로 모여 안착)으로 움직인다. */}
      <span className="profile-setup__logo">
        <motion.span
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, x: '-50%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={TEXT_TRANSITION}
        >
          Sync.
        </motion.span>
        <motion.span
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, x: '50%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={TEXT_TRANSITION}
        >
          day
        </motion.span>
      </span>
    </div>
  );
}
