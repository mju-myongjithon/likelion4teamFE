/**
 * F3~F9. 유사도 매칭 API 레이어
 *
 * 실제 연동 예정 스펙 (명세서 기준 — match 테이블 구조만 있고 REST 스펙은
 * 아직 없어서, analysisApi.js와 동일하게 임시로 가정해둔 형태):
 *   GET  /api/match/today?userId=...
 *   res : {
 *     status: 'waiting' | 'locked' | 'revealed',
 *     matchId, similarityScore,
 *     scoreBreakdown: [{ key, label, points, max, matched }],
 *     aiComment, icebreakerQuestions: string[]
 *   }
 *   POST /api/match/:matchId/reveal
 *   POST /api/match/:matchId/friend-request
 *
 * 지금은 백엔드가 없어서, 세 가지 상태(waiting/locked/revealed)를 랜덤으로
 * 돌려주는 방식으로 로딩 지연시간과 화면 분기부터 검증한다.
 */

const MOCK_MATCH_DELAY_MS = 1400;
const MOCK_ACTION_DELAY_MS = 300;

const STATUS_POOL = ['waiting', 'locked', 'revealed'];

const BREAKDOWN_POOL = [
  { key: 'scene', label: '장소', max: 30 },
  { key: 'time', label: '시간', max: 20 },
  { key: 'activity', label: '활동', max: 20 },
  { key: 'mood', label: '분위기', max: 20 },
  { key: 'color', label: '색감', max: 10 },
];

const COMMENT_POOL = [
  '두 사람 모두 늦은 오후 도서관에서 차분한 하루를 보냈어요. 같은 톤의 조명 아래, 조용히 집중하는 시간을 나눴네요.',
  '비슷한 시간대에 캠퍼스 곳곳을 돌아다녔어요. 발걸음의 리듬이 닮아있어요.',
  '둘 다 활동적인 하루를 보냈어요. 분주하지만 즐거운 하루였을 것 같아요.',
];

const QUESTION_POOL = [
  '둘 다 그 시간에 뭐 듣고 있었어요?',
  '오늘 그 자리, 자주 가는 곳이에요?',
  '오후에 제일 집중 잘 되는 편이에요?',
  '오늘 하루 중 제일 기억에 남는 순간은요?',
];

export async function findTodayMatch() {
  await wait(MOCK_MATCH_DELAY_MS);

  const status = pickOne(STATUS_POOL);

  if (status === 'waiting') {
    return { status };
  }
  if (status === 'locked') {
    return { status, partnerCampus: '인문캠' };
  }

  const scoreBreakdown = BREAKDOWN_POOL.map((item) => {
    const matched = Math.random() > 0.2;
    return { ...item, points: matched ? item.max : 0, matched };
  });
  const similarityScore = scoreBreakdown.reduce((sum, item) => sum + item.points, 0);

  return {
    status: 'revealed',
    matchId: `mock-match-${Date.now()}`,
    similarityScore,
    scoreBreakdown,
    aiComment: pickOne(COMMENT_POOL),
    icebreakerQuestions: pickRandom(QUESTION_POOL, 3),
  };
}

export async function revealMatch(matchId) {
  await wait(MOCK_ACTION_DELAY_MS);
  return { matchId, revealed: true };
}

export async function requestFriend(matchId) {
  await wait(MOCK_ACTION_DELAY_MS);
  return { matchId, requested: true };
}

function pickOne(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandom(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}