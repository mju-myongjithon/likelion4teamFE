const MOCK_ANALYSIS_DELAY_MS = 1800;

const SCENE_POOL = ['도서관', '캠퍼스', '카페', '강의실', '산책로', '작업실'];
const TIME_POOL = ['morning', 'afternoon', 'evening', 'night'];
const MOOD_POOL = ['차분함', '선명함', '집중', '느긋함', '따뜻함'];
const COLOR_POOL = ['soft gray', 'deep black', 'silver white', 'muted white'];
const ACTIVITY_POOL = ['공부', '식사', '산책', '과제', '휴식', '이동'];

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
