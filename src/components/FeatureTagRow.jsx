import { Sunrise, Sun, Sunset, Moon, Clock } from 'lucide-react';

// "색감" 태그용 — 자주 나오는 색 이름 키워드를 실제 색상에 매핑.
// AI가 자유 텍스트로 뽑아내는 값이라 전부 커버는 못 하고, 매칭 안 되면
// 회색 점(중립)으로 대체된다.
const COLOR_KEYWORD_MAP = [
  { match: ['빨강', '레드', 'red'], value: '#E5484D' },
  { match: ['주황', '오렌지', 'orange'], value: '#F76B15' },
  { match: ['노랑', '옐로우', 'yellow'], value: '#F5D90A' },
  { match: ['초록', '그린', 'green'], value: '#30A46C' },
  { match: ['파랑', '블루', 'blue'], value: '#0091FF' },
  { match: ['남색', '네이비', 'navy'], value: '#104D8C' },
  { match: ['보라', '퍼플', 'purple'], value: '#8E4EC6' },
  { match: ['분홍', '핑크', 'pink'], value: '#E93D82' },
  { match: ['갈색', '브라운', 'brown'], value: '#9A6A3F' },
  { match: ['회색', '그레이', 'gray', 'grey'], value: '#8B8D98' },
  { match: ['검정', '블랙', 'black'], value: '#2B2B2B' },
  { match: ['흰색', '화이트', 'white'], value: '#F0F0F0' },
  {
    match: ['다채', '컬러풀', 'colorful'],
    value: 'linear-gradient(90deg,#E5484D,#F76B15,#F5D90A,#30A46C,#0091FF,#8E4EC6)',
  },
];

function getColorSwatch(word) {
  const found = COLOR_KEYWORD_MAP.find(({ match }) => match.some((k) => word.includes(k)));
  return found ? found.value : null;
}

// "시간대" 태그용 — 아침/오후/저녁/밤 정도로 값의 폭이 좁아서 아이콘 매핑이 잘 맞는다.
function getTimeIcon(word) {
  if (word.includes('아침') || word.includes('오전') || word.includes('새벽')) return Sunrise;
  if (word.includes('오후') || word.includes('낮')) return Sun;
  if (word.includes('저녁') || word.includes('황혼')) return Sunset;
  if (word.includes('밤')) return Moon;
  return Clock;
}

// variant: 'plain'(기본, 텍스트만) | 'color'(색상 스와치) | 'time'(아이콘)
export default function FeatureTagRow({ title, tags, variant = 'plain' }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="trait-group">
      <div className="trait-group__header">
        <span className="trait-group__title">{title}</span>
      </div>
      <div className="feature-tags">
        {tags.map((tag) => {
          if (variant === 'color') {
            const swatch = getColorSwatch(tag);
            const isGradient = swatch?.startsWith('linear-gradient');
            return (
              <span key={tag} className="feature-tag">
                <span
                  className="feature-tag__swatch"
                  style={
                    swatch
                      ? isGradient
                        ? { backgroundImage: swatch }
                        : { background: swatch }
                      : { background: 'var(--color-line)' }
                  }
                />
                {tag}
              </span>
            );
          }

          if (variant === 'time') {
            const Icon = getTimeIcon(tag);
            return (
              <span key={tag} className="feature-tag">
                <Icon size={13} strokeWidth={2} className="feature-tag__icon" />
                {tag}
              </span>
            );
          }

          return (
            <span key={tag} className="feature-tag">
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}