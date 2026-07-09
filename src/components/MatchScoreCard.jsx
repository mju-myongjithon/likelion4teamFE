import { Check, X } from 'lucide-react';

export default function MatchScoreCard({ score, breakdown }) {
  return (
    <div className="match-score-card">
      <div className="match-score-card__header">
        <span className="match-score-card__label">유사도</span>
        <span className="match-score-card__value">{score}%</span>
      </div>
      <ul className="match-breakdown">
        {breakdown.map((item) => (
          <li key={item.key} className="match-breakdown__row">
            <span className="match-breakdown__icon" data-matched={item.matched}>
              {item.matched ? (
                <Check size={13} strokeWidth={2.6} />
              ) : (
                <X size={13} strokeWidth={2.6} />
              )}
            </span>
            <span className="match-breakdown__label">{item.label}</span>
            <span className="match-breakdown__bar">
              <span
                className="match-breakdown__bar-fill"
                style={{ width: `${(item.points / item.max) * 100}%` }}
              />
            </span>
            <span className="match-breakdown__points">{item.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}