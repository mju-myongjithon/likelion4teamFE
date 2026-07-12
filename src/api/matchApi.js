import { API_BASE_URL, assertApiBaseUrl } from './client';
import { CURRENT_USER_ID } from '../utils/currentUser';

/**
 * F3. 유사도 매칭 API 레이어 (실제 백엔드 연동)
 *
 * POST /api/matches?userId=...         — 매칭 수락 + 매칭 시도 (반복 호출용)
 * POST /api/matches/decline?userId=... — 매칭 거부
 * GET  /api/matches/today?userId=...   — 현재 상태만 조회 (매칭을 새로 걸지 않음)
 *
 * 세 API 공통 응답: { status, match }
 *   status: 'NOT_REQUESTED' | 'PENDING' | 'MATCHED' | 'DECLINED'
 *   match : MATCHED일 때만 값 있음, 나머지는 null
 *     { matchId, similarityScore, partnerId, partnerNickname, partnerCampus,
 *       revealedToMe, scoreBreakdown }
 *
 * 참고:
 * - "매칭중…" 화면에서는 GET이 아니라 POST /api/matches를 계속 반복 호출해야
 *   실제로 매칭이 진행됨 (GET은 상태 조회만 함)
 * - revealedToMe는 F5(연락처 교환/채팅 — 아직 방향 미정) 붙기 전까지 항상 false
 * - scoreBreakdown은 "항목별 점수 + 공통 키워드"를 담는다고만 알려져 있고
 *   정확한 스키마는 미확인 → 방어적으로 처리 (숫자든 {score, keywords} 형태든 대응)
 */

export async function checkTodayMatch() {
  return callMatchApi(`${API_BASE_URL}/api/matches/today?userId=${CURRENT_USER_ID}`, 'GET');
}

export async function acceptAndAttemptMatch() {
  return callMatchApi(`${API_BASE_URL}/api/matches?userId=${CURRENT_USER_ID}`, 'POST');
}

export async function declineMatch() {
  return callMatchApi(`${API_BASE_URL}/api/matches/decline?userId=${CURRENT_USER_ID}`, 'POST');
}

async function callMatchApi(url, method) {
  assertApiBaseUrl();
  const response = await safeFetch(url, { method });
  return parseMatchResponse(response);
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

async function parseMatchResponse(response) {
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
  return response.json(); // { status, match }
}