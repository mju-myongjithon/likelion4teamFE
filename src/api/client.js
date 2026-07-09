export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function assertApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      '.env 파일에 VITE_API_BASE_URL이 설정되어 있지 않아요. .env.example을 참고해서 .env를 만들어주세요.'
    );
  }
}