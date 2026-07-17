// 로그인/회원가입이 없어서, 유저 정보는 F0(게스트 프로필 입력)에서 막 생성한 뒤
// 이 세션 동안만 들고 있는다. sessionStorage에 저장해 새로고침에는 살아남지만
// 탭을 닫으면 사라진다 — 그 순간부터 이 유저는 다시 접근할 방법이 없어진다.
//
// 닉네임·캠퍼스는 F0 생성 응답에만 한 번 실려오고 서버에 다시 물어볼 API가 없으므로,
// 프로필 탭에서 보여주려면 이때 같이 저장해둬야 한다.
const USER_ID_KEY = 'syncday.userId';
const NICKNAME_KEY = 'syncday.nickname';
const CAMPUS_KEY = 'syncday.campus';

export function getCurrentUserId() {
  return sessionStorage.getItem(USER_ID_KEY);
}

export function getCurrentNickname() {
  return sessionStorage.getItem(NICKNAME_KEY);
}

export function getCurrentCampus() {
  return sessionStorage.getItem(CAMPUS_KEY);
}

export function setCurrentUser({ userId, nickname, campus }) {
  sessionStorage.setItem(USER_ID_KEY, userId);
  sessionStorage.setItem(NICKNAME_KEY, nickname);
  sessionStorage.setItem(CAMPUS_KEY, campus);
}
