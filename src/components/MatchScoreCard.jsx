// 기획서 4-3 가중치: 장소 30% / 시간대 20% / 활동 20% / 분위기 20% / 색감 10%
// scoreBreakdown 값이 숫자(점수만)로 오는지, { score, keywords } 형태로
// 오는지 스키마가 아직 미확인이라 두 형태 모두 방어적으로 처리한다.
const AXES = [
  { key: 'scene', label: '장소', max: 30 },
  { key: 'time', label: '시간', max: 20 },
  { key: 'activity', label: '활동', max: 20 },
  { key: 'mood', label: '분위기', max: 20 },
  { key: 'color', label: '색감', max: 10 },
];

export default function MatchScoreCard({ score, breakdown }) {
  return (
    <div className="match-score-card">
      <div className="match-score-card__header">
        <span className="match-score-card__label">유사도</span>
        <span className="match-score-card__value">{score}%</span>
      </div>
      <ul className="match-breakdown">
        {AXES.map((axis) => {
          const raw = breakdown?.[axis.key];
          const points = typeof raw === 'number' ? raw : (raw?.score ?? 0);
          const keywords = Array.isArray(raw?.commonKeywords)
            ? raw.commonKeywords
            : Array.isArray(raw?.keywords)
              ? raw.keywords
              : [];
          const ratio = Math.max(0, Math.min(100, (points / axis.max) * 100));

          return (
            <li key={axis.key} className="match-breakdown__row">
              <span className="match-breakdown__label">{axis.label}</span>
              <span className="match-breakdown__bar">
                <span className="match-breakdown__bar-fill" style={{ width: `${ratio}%` }} />
              </span>
              <span className="match-breakdown__points">{Math.round(points)}</span>
              {keywords.length > 0 && (
                <span className="match-breakdown__keywords">{keywords.join(', ')}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}