# Sync.day FE 프로토타입 (F1 + F2)

빠른 데모/프로토타입용 React + Vite 웹 버전. 최종 타깃은 React Native지만,
화면 흐름·상태 관리·API 인터페이스를 먼저 검증하기 위한 웹 버전입니다.

## 실행

```bash
npm install
npm run dev
```

## 구현 범위

- **F1 사진 업로드**: 최소 3장 / 최대 10장, 프라이버시 모드 토글(기본 ON),
  필름스트립 진행률 표시(`N/3`)
- **F2 AI 특징 분석**: 업로드 완료 후 자동 실행, 로딩 연출(사진 현상되는
  모션) → 장소/시간대/분위기/색감/활동 5개 항목 순차 공개

## 목업 처리 중인 부분

백엔드(F1 S3 업로드, F2 Vision API 분석)가 아직 없어서 아래 두 파일이
목업으로 동작합니다. 인터페이스(입출력 형태)는 명세서 기준으로 맞춰뒀기
때문에, 실제 연동 시 이 두 파일 내부만 교체하면 됩니다.

- `src/api/photoApi.js` → `POST /api/photos` 로 교체 (F1 BE 작업 완료 후)
- `src/api/analysisApi.js` → `POST /api/analysis` 로 교체 (F2 AI 작업 완료 후)

프라이버시 모드의 "얼굴 흐림 처리"는 지금은 CSS blur로 시각적으로만
표현되어 있고, 실제 얼굴 감지/모자이크는 백엔드(OpenCV/Rekognition)
영역입니다.

## 디렉토리 구조

```
src/
  api/            F1·F2 API 레이어 (현재 목업)
  components/     PhotoGrid, PrivacyToggle, FilmStrip, TraitReveal
  pages/          UploadPage(F1), AnalysisPage(F2)
  styles/         디자인 토큰 + 컴포넌트/페이지 스타일
```

## 디자인 컨셉

"오늘 하루가 필름처럼 현상된다"는 컨셉으로, 다크룸(암실) 배경 + 세이프라이트
앰버 컬러 + 즉석 사진(폴라로이드) 모티프를 사용했습니다. F2 로딩 화면과
결과 카드는 실제 사진이 현상되는 듯한 모션으로 처리했습니다.

## 다음 단계 (F3~)

F3(매칭)부터는 백엔드 API가 필요하므로, 팀 진행 상황에 맞춰 화면을
추가하면 됩니다. `App.jsx`의 `step` 상태에 `'match'` 등을 추가하는 방식으로
확장하면 기존 구조를 그대로 이어갈 수 있어요.
