import { motion } from 'framer-motion';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '240px',
  gap: '80px', // 원들이 펼쳐졌을 때의 기본 중심 간격
  position: 'relative',
  overflow: 'hidden',
};

const circleStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  // 앱 배경이 어두워(#070F1F) multiply는 겹치는 부분이 검게 뭉개진다.
  // screen은 반대로 밝은 배경 기준 blend라 어두운 배경에서 색이 살아난다.
  mixBlendMode: 'screen',
  opacity: 0.85,
};

// 로딩 중(F2 분석 대기·F3 매칭 탐색/대기·F5 채팅 로딩) 공통으로 쓰는 애니메이션.
// 두 원이 가운데로 모여 겹쳤다 잠시 멈춘 뒤 다시 멀어지는 동작을 반복한다.
export default function SyncCharacter() {
  return (
    <div style={containerStyle}>
      <motion.div
        style={{ ...circleStyle, backgroundColor: '#f39c12' }}
        animate={{
          // 0px(시작) -> 50px(교집합 완성) -> 50px(대기/정지) -> 0px(멀어짐)
          x: [0, 50, 50, 0],
        }}
        transition={{
          duration: 3.5, // 1주기 시간 (초)
          ease: 'easeInOut',
          repeat: Infinity,
          // 애니메이션 진행률 분배 (0% -> 35% 구간 이동, 35% -> 65% 구간 정지, 65% -> 100% 구간 복귀)
          times: [0, 0.35, 0.65, 1],
        }}
      />

      <motion.div
        style={{ ...circleStyle, backgroundColor: '#8e44ad' }}
        animate={{
          x: [0, -50, -50, 0],
        }}
        transition={{
          duration: 3.5,
          ease: 'easeInOut',
          repeat: Infinity,
          times: [0, 0.35, 0.65, 1],
        }}
      />
    </div>
  );
}
