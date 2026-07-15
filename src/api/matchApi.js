import { API_BASE_URL, assertApiBaseUrl } from './client';
import { CURRENT_USER_ID } from '../utils/currentUser';

/**
 * F3. 유사도 매칭 API 레이어 (실제 백엔드 연동 — 게이트2 채팅 참여 포함)
 *
 * 게이트1 (매칭 참여):
 *   POST /api/matches?userId=...          — 매칭 수락(opt-in) + 매칭 시도 (반복 호출/폴링용)
 *   POST /api/matches/decline?userId=...  — 매칭 거부
 * 게이트2 (채팅 참여, 매칭 성사 후):
 *   POST /api/matches/chat/accept?userId=... — 채팅 수락
 *   POST /api/matches/chat/reject?userId=... — 채팅 거부
 * 조회:
 *   GET  /api/matches/today?userId=...    — 현재 상태만 조회 (매칭/결정을 새로 걸지 않음)
 *
 * 공통 응답: { status, match }
 *   status: 'NOT_REQUESTED' | 'PENDING' | 'MATCHED' | 'AWAITING_PARTNER' | 'CONNECTED' | 'ENDED' | 'DECLINED'
 *   match : 매칭 행이 있으면(MATCHED/AWAITING_PARTNER/CONNECTED/ENDED) 채워짐, 아니면 null
 *     { matchId, date, similarityScore, partnerId, partnerNickname, partnerCampus,
 *       revealedToMe, scoreBreakdown }
 *
 * 서버 사이드 게이팅(백엔드 게이트2 반영):
 * - 상대 신원(partnerNickname/partnerCampus)은 MATCHED 부터 내려온다.
 * - similarityScore/scoreBreakdown 은 CONNECTED(양쪽 채팅 수락) 일 때만 채워지고,
 *   그 전에는 null 로 가려진다. revealedToMe 가 그 공개 여부(= CONNECTED)를 뜻한다.
 *
 * 폴링 규칙:
 * - PENDING("매칭중"): POST /api/matches 를 반복 호출해야 실제 매칭이 진행됨.
 * - AWAITING_PARTNER("상대 응답 대기"): 내 결정은 이미 끝났으므로 GET /today 로 조회만 폴링
 *   (POST /chat/accept 를 다시 부를 필요 없음). CONNECTED/ENDED 로 바뀌는지 지켜본다.
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

// 게이트2: 매칭된 상대와 채팅을 수락한다. 양쪽 모두 수락하면 status=CONNECTED.
export async function acceptChat() {
  return callMatchApi(`${API_BASE_URL}/api/matches/chat/accept?userId=${CURRENT_USER_ID}`, 'POST');
}

// 게이트2: 매칭된 상대와의 채팅을 거부한다. status=ENDED (그날 매칭 종료).
export async function rejectChat() {
  return callMatchApi(`${API_BASE_URL}/api/matches/chat/reject?userId=${CURRENT_USER_ID}`, 'POST');
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
