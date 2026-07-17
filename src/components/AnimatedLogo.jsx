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

// 로그인(F0) 화면 전용 최초 진입 애니메이션. SyncCharacter.jsx 로딩 애니메이션과 같은 방식
// (clipPath로 두 원의 교집합만 오려내 겹침색을 채우는 방식)을 그대로 가져오되, 여기선 루프
// 없이 한 번만: 양옆 화면 밖에서 원 두 개가 날아와 SyncIcon과 같은 최종 위치(50% 겹침)에
// 안착하고, 겹치는 순간 색이 서서히 나타난다. 텍스트는 살짝 왼쪽에서 페이드인하며 제자리로.
const FLY_DISTANCE = R * 4;
const START_LEFT_CX = LEFT_CX - FLY_DISTANCE;
const START_RIGHT_CX = RIGHT_CX + FLY_DISTANCE;

const FLIGHT_TRANSITION = { duration: 1, ease: 'easeOut' };
const OVERLAP_FADE_TRANSITION = { duration: 0.5, delay: 0.5, ease: 'easeOut' };
const TEXT_TRANSITION = { duration: 0.9, ease: 'easeOut' };

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
              cy={CY}
              r={R}
              initial={{ cx: START_LEFT_CX }}
              animate={{ cx: LEFT_CX }}
              transition={FLIGHT_TRANSITION}
            />
          </clipPath>
        </defs>

        {/* 겹치는 영역: 오른쪽 원과 같이 날아오되 왼쪽 원 모양으로 잘라내 교집합만 남긴다 */}
        <motion.circle
          cy={CY}
          r={R}
          fill={OVERLAP_COLOR}
          clipPath="url(#profile-logo-overlap-clip)"
          initial={{ cx: START_RIGHT_CX, opacity: 0 }}
          animate={{ cx: RIGHT_CX, opacity: 1 }}
          transition={{ cx: FLIGHT_TRANSITION, opacity: OVERLAP_FADE_TRANSITION }}
        />

        <motion.circle
          cy={CY}
          r={R}
          fill="none"
          stroke={WHITE}
          strokeWidth={STROKE_WIDTH}
          initial={{ cx: START_LEFT_CX }}
          animate={{ cx: LEFT_CX }}
          transition={FLIGHT_TRANSITION}
        />
        <motion.circle
          cy={CY}
          r={R}
          fill="none"
          stroke={SKY_BLUE}
          strokeWidth={STROKE_WIDTH}
          initial={{ cx: START_RIGHT_CX }}
          animate={{ cx: RIGHT_CX }}
          transition={FLIGHT_TRANSITION}
        />
      </svg>

      <motion.span
        className="profile-setup__logo"
        initial={{ opacity: 0, x: '-30%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={TEXT_TRANSITION}
      >
        Sync.day
      </motion.span>
    </div>
  );
}
