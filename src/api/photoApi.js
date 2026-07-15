import { API_BASE_URL, assertApiBaseUrl } from './client';
import { getCurrentUserId } from '../utils/currentUser';

export async function uploadPhotos(files, isPrivacyMode) {
  assertApiBaseUrl();

  const results = [];
  for (const file of files) {
    const uploaded = await uploadSinglePhoto(file, isPrivacyMode);
    results.push(uploaded);
  }
  return results;
}

async function uploadSinglePhoto(file, isPrivacyMode) {
  const formData = new FormData();
  formData.append('userId', getCurrentUserId());
  formData.append('isPrivacyMode', String(isPrivacyMode));
  formData.append('file', file);

  const response = await safeFetch(`${API_BASE_URL}/api/photos`, {
    method: 'POST',
    body: formData,
  });

  const data = await parseJsonOrThrow(response);
  return normalizePhoto(data);
}

export async function getPhotoStatus() {
  assertApiBaseUrl();

  const response = await safeFetch(
    `${API_BASE_URL}/api/photos/status?userId=${getCurrentUserId()}`,
    { method: 'GET' }
  );

  const data = await parseJsonOrThrow(response);
  return normalizeStatus(data);
}

// 오늘 이미 서버에 업로드되어 있는 사진 목록 조회.
// 새로고침/탭 이동 등으로 로컬 state(uploadedPhotos)가 비어있을 때,
// 서버에 이미 있는 사진을 다시 불러와 F2로 이어가기 위해 사용한다.
export async function getTodayPhotos() {
  assertApiBaseUrl();

  const response = await safeFetch(
    `${API_BASE_URL}/api/photos?userId=${getCurrentUserId()}`,
    { method: 'GET' }
  );

  const data = await parseJsonOrThrow(response);
  const list = Array.isArray(data) ? data : (data.photos ?? []);
  return list.map(normalizePhoto);
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

function normalizePhoto(photo) {
  return {
    photoId: photo.photoId,
    imageUrl: photo.imageUrl,
    uploadedAt: photo.uploadedAt,
  };
}

function normalizeStatus(status) {
  return {
    uploadedCount: status.uploadedCount,
    requiredCount: status.requiredCount,
    readyForAnalysis: status.readyForAnalysis,
  };
}