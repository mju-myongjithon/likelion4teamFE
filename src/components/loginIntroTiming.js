// 로그인(F0) 화면 진입 애니메이션들(AnimatedLogo, AnimatedSubtitle)이 공유하는 속도 상수.
// 컴포넌트가 아닌 상수라 별도 파일로 뺐다(한 파일에 컴포넌트와 상수를 같이 export하면
// Fast Refresh가 깨진다는 린트 경고가 있었음).

// 속도를 20% 늦춘다(= 소요 시간을 1 / 0.8 = 1.25배로 늘린다).
export const SLOWDOWN = 1.25;

export const TEXT_TRANSITION = { duration: 0.9 * SLOWDOWN, ease: 'easeOut' };
