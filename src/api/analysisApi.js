import { API_BASE_URL, assertApiBaseUrl } from './client';
import { CURRENT_USER_ID } from '../utils/currentUser';

/**
 * F2. AI 사진 특징 분석 API 레이어 (실제 백엔드 연동)
 *
 * POST /api/analysis       — 오늘의 나를 분석하기 (이미 분석했으면 기존 결과 그대로 반환, 멱등)
 * GET  /api/analysis/today — 오늘 분석 결과 조회 (새로 분석 안 하고 있으면 그대로 조회)
 *
 * 실제 응답 형태 (스웨거 문서와 다름, Try it out으로 확인한 진짜 응답 기준):
 *   {
 *     analysisId,
 *     features: {
 *       scene: [{ category, detail }],   // 사진 수만큼(보통 3개)
 *       timeOfDay: string[],             // 예: ["오후","밤"] — 문자열 하나 아님
 *       mood: string[],
 *       color: string[],                 // 문자열 하나 아님
 *       activity: [{ category, detail }],
 *       summary: string                  // features 안에 있음, 최상위 아님
 *     }
 *   }
 *
 * 참고: spaceScore/vibeScore 같은 점수 필드는 없음(원래 스펙에도 없었음, mock에서만 있었던 가짜 값).
 */

export async function analyzePhotos() {
  return callAnalysisApi(`${API_BASE_URL}/api/analysis`, 'POST', { userId: CURRENT_USER_ID });
}

export async function getTodayAnalysis() {
  return callAnalysisApi(
    `${API_BASE_URL}/api/analysis/today?userId=${CURRENT_USER_ID}`,
    'GET'
  );
}

async function callAnalysisApi(url, method, body) {
  assertApiBaseUrl();
  const response = await safeFetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseJsonOrThrow(response);
}

async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    const networkError = new Error('서버에 연결할 수 없어요. 백엔드가 켜져 있는지 확인해주세요');
    networkError.code = 'NETWORK_ERROR';
    throw networkError;
  }
}

async function parseJsonOrThrow(response) {
  if (!response.ok) {
    let body = null;
    try {
      body = await response.json();
    } catch {
      // 에러 응답이 JSON이 아닐 수도 있으니 무시
    }
    const err = new Error(body?.message ?? `요청이 실패했어요 (${response.status})`);
    err.code = body?.code ?? `HTTP_${response.status}`;
    throw err;
  }
  return response.json();
}
