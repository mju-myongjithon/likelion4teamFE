// 로그인/회원가입이 없어서, 유저 식별자는 F0(게스트 프로필 입력)에서 막 생성한 뒤
// 이 세션 동안만 들고 있는다. sessionStorage에 저장해 새로고침에는 살아남지만
// 탭을 닫으면 사라진다 — 그 순간부터 이 userId는 다시 접근할 방법이 없어진다.
const STORAGE_KEY = 'syncday.userId';

export function getCurrentUserId() {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setCurrentUserId(userId) {
  sessionStorage.setItem(STORAGE_KEY, userId);
}
