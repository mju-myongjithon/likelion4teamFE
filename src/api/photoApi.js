/**
 * F1. 사진 업로드 API 레이어
 *
 * 지금은 백엔드(S3 업로드 + 얼굴 모자이크)가 없으므로 목업으로 동작한다.
 * 실제 연동 시 uploadPhotos()의 내부만 교체하면 되고, 컴포넌트 쪽 코드는
 * 그대로 두면 되도록 인터페이스(입출력 형태)를 명세서 기준으로 맞춰뒀다.
 *
 * 실제 연동 예정 스펙:
 *   POST /api/photos  (multipart/form-data)
 *   body: { userId, isPrivacyMode, files[] }
 *   res : { photoId, imageUrl, uploadedAt }[]
 */

const MOCK_UPLOAD_DELAY_MS = 700;

/**
 * @param {File[]} files - 사용자가 선택한 이미지 파일 목록 (3~10장)
 * @param {boolean} isPrivacyMode - 프라이버시 모드 여부 (기본 true)
 * @returns {Promise<{photoId: string, imageUrl: string, isPrivacyMode: boolean, uploadedAt: string}[]>}
 */
export async function uploadPhotos(files, isPrivacyMode) {
  await wait(MOCK_UPLOAD_DELAY_MS);

  // 목업 환경: 실제 S3 업로드 대신 브라우저 로컬 objectURL을 사용한다.
  // 백엔드 연동 시 이 부분이 실제 S3 URL로 대체된다.
  return files.map((file, idx) => ({
    photoId: `mock-${Date.now()}-${idx}`,
    imageUrl: URL.createObjectURL(file),
    isPrivacyMode,
    uploadedAt: new Date().toISOString(),
  }));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
