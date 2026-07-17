import { API_BASE_URL, assertApiBaseUrl } from './client';
import { getCurrentUserId } from '../utils/currentUser';

/**
 * F5. 매칭 채팅 API 레이어 (폴링 기반, CONNECTED된 매칭에서만 사용 가능)
 *
 *   POST /api/matches/{matchId}/messages?userId=...              — 메시지 전송
 *   GET  /api/matches/{matchId}/messages?userId=...&afterId=...  — afterId 이후 메시지만 조회 (생략 시 전체 히스토리)
 *
 * 공통 응답 항목: { messageId, mine, content, createdAt }
 *   mine: 조회하는 유저 기준 내가 보낸 메시지인지 (상대 UUID는 응답에 노출되지 않음)
 *
 * 아직 CONNECTED 전이거나 그 매칭의 참여자가 아니면 403을 반환한다.
 */

export async function sendMessage(matchId, content) {
  return callChatApi(
    `${API_BASE_URL}/api/matches/${matchId}/messages?userId=${getCurrentUserId()}`,
    'POST',
    { content }
  );
}

export async function pollMessages(matchId, afterId) {
  const cursor = afterId != null ? `&afterId=${afterId}` : '';
  return callChatApi(
    `${API_BASE_URL}/api/matches/${matchId}/messages?userId=${getCurrentUserId()}${cursor}`,
    'GET'
  );
}

async function callChatApi(url, method, body) {
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
