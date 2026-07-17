import { motion } from 'framer-motion';
import { TEXT_TRANSITION } from './loginIntroTiming';

// 로그인(F0) 화면 전용. 서브타이틀을 쉼표 기준 두 조각으로 나눠, 양옆에 흩어져 있다가
// 페이드인하며 가운데로 모여 제자리(한 줄)에 안착하게 한다. AnimatedLogo의 "Sync.day"
// 텍스트와 같은 속도(TEXT_TRANSITION)를 그대로 재사용한다.
export default function AnimatedSubtitle({ className }) {
  return (
    <p className={className}>
      <motion.span
        style={{ display: 'inline-block' }}
        initial={{ opacity: 0, x: '-50%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={TEXT_TRANSITION}
      >
        오늘의 순간을,
      </motion.span>{' '}
      <motion.span
        style={{ display: 'inline-block' }}
        initial={{ opacity: 0, x: '50%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={TEXT_TRANSITION}
      >
        캠퍼스 너머로
      </motion.span>
    </p>
  );
}
