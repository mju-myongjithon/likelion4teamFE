import { API_BASE_URL, assertApiBaseUrl } from './client';

/**
 * F0. 게스트 프로필 API 레이어 (실제 백엔드 연동)
 *
 * POST /api/users — 닉네임·캠퍼스만으로 로그인/회원가입 없이 유저를 하나 생성한다.
 * 응답: { userId, nickname, campus }
 */
export async function createGuestUser(nickname, campus) {
  assertApiBaseUrl();

  const response = await safeFetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, campus }),
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
