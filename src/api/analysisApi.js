/**
 * F2. AI 사진 특징 분석 API 레이어
 *
 * 실제 연동 예정 스펙 (명세서 기준):
 *   POST /api/analysis
 *   body: { userId, photoIds[] }
 *   res : {
 *     analysisId, date,
 *     sceneTags: string[], timeOfDay: string, mood: string,
 *     dominantColor: string, activityTags: string[]
 *   }
 *
 * 지금은 Vision API 호출 대신, 업로드된 사진 수를 시드로 삼아
 * 그럴듯한 결과를 랜덤 생성한다. 응답 스키마와 지연 시간(로딩 UX 검증용)만
 * 실제와 최대한 비슷하게 맞춰뒀다.
 */

const MOCK_ANALYSIS_DELAY_MS = 1800;

const SCENE_POOL = ['도서관', '학생회관', '캠퍼스 벤치', '카페', '강의실', '기숙사'];
const TIME_POOL = ['morning', 'afternoon', 'evening', 'night'];
const MOOD_POOL = ['차분함', '설렘', '분주함', '느긋함', '집중'];
const COLOR_POOL = ['warm amber', 'soft neutral', 'cool blue', 'muted green'];
const ACTIVITY_POOL = ['공부', '식사', '산책', '과제', '휴식', '동아리 활동'];

/**
 * @param {string[]} photoIds - F1에서 업로드된 photoId 목록 (3장 이상)
 * @returns {Promise<{
 *   analysisId: string, date: string,
 *   sceneTags: string[], timeOfDay: string, mood: string,
 *   dominantColor: string, activityTags: string[]
 * }>}
 */
export async function analyzePhotos(photoIds) {
  if (!photoIds || photoIds.length < 3) {
    throw new Error('MIN_PHOTOS_REQUIRED');
  }

  await wait(MOCK_ANALYSIS_DELAY_MS);

  return {
    analysisId: `mock-analysis-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    sceneTags: pickRandom(SCENE_POOL, 2),
    timeOfDay: pickOne(TIME_POOL),
    mood: pickOne(MOOD_POOL),
    dominantColor: pickOne(COLOR_POOL),
    activityTags: pickRandom(ACTIVITY_POOL, 3),
  };
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
