// F3/F8. 유사도 점수 카드 — 실제 scoreBreakdown 구조(DimensionScore) 기준
// { scene, timeOfDay, activity, mood, color } 각각 { sim, weight, contribution, commonTags }
const AXIS_LABELS = {
  scene: '장소',
  timeOfDay: '시간대',
  activity: '활동',
  mood: '분위기',
  color: '색감',
};

const AXIS_ORDER = ['scene', 'timeOfDay', 'activity', 'mood', 'color'];

export default function MatchScoreCard({ score, breakdown }) {
  return (
    <div className="match-score-card">
      <div className="match-score-card__header">
        <span className="match-score-card__label">유사도</span>
        <span className="match-score-card__value">{score}%</span>
      </div>
      <ul className="match-breakdown">
        {AXIS_ORDER.map((key) => {
          const dim = breakdown?.[key];
          if (!dim) return null;
          const ratio = dim.weight
            ? Math.max(0, Math.min(100, (dim.contribution / dim.weight) * 100))
            : 0;
          const tags = dim.commonTags ?? [];

          return (
            <li key={key} className="match-breakdown__row">
              <span className="match-breakdown__label">{AXIS_LABELS[key]}</span>
              <span className="match-breakdown__bar">
                <span className="match-breakdown__bar-fill" style={{ width: `${ratio}%` }} />
              </span>
              <span className="match-breakdown__points">{Math.round(dim.contribution)}</span>
              {tags.length > 0 ? (
                <span className="match-breakdown__keywords">{tags.join(', ')}</span>
              ) : (
                <span className="match-breakdown__keywords match-breakdown__keywords--empty">
                  공통 없음
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}