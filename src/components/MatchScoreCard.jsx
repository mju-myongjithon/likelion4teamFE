// F3/F8. 유사도 점수 카드 — 실제 scoreBreakdown 구조 기준
// { totalScore, dimensions: { scene, timeOfDay, activity, mood, color } }
//   각 dimension = { sim, weight, contribution, commonTags }
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
        <span className="match-score-card__label">카테고리별 점수</span>
        <span className="match-score-card__value">{score}%</span>
      </div>
      <ul className="match-breakdown">
        {AXIS_ORDER.map((key) => {
          const dim = breakdown?.dimensions?.[key];
          if (!dim) return null;
          // 그 축 자체의 만점(weight*100, 예: scene 0.3→30점) 대비 비율.
          // 축마다 만점이 달라(장소 30·시간대 20·활동 20·분위기 20·색감 10) 절대 점수로는
          // 비교되지 않지만, "이 항목에서 얼마나 닮았는지"는 이 방식이 정확히 보여준다.
          const maxPoints = Math.round(dim.weight * 100);
          const ratio = maxPoints ? Math.max(0, Math.min(100, (dim.contribution / maxPoints) * 100)) : 0;
          const tags = dim.commonTags ?? [];

          return (
            <li key={key} className="match-breakdown__row">
              <span className="match-breakdown__label">{AXIS_LABELS[key]}</span>
              <span className="match-breakdown__bar">
                <span className="match-breakdown__bar-fill" style={{ width: `${ratio}%` }} />
              </span>
              <span className="match-breakdown__points">{Math.round(dim.contribution)}/{maxPoints}점</span>
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