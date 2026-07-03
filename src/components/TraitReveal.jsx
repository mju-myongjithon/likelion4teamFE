const TIME_LABEL = {
  morning: '아침',
  afternoon: '오후',
  evening: '저녁',
  night: '밤',
};

export default function TraitReveal({ result }) {
  const items = [
    { label: '장소', value: result.sceneTags.join(', ') },
    { label: '시간대', value: TIME_LABEL[result.timeOfDay] ?? result.timeOfDay },
    { label: '분위기', value: result.mood },
    { label: '색감', value: result.dominantColor },
    { label: '활동', value: result.activityTags.join(', ') },
  ];

  return (
    <div className="trait-reveal">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="trait-reveal__item"
          style={{ '--delay': `${i * 260}ms` }}
        >
          <span className="trait-reveal__label">{item.label}</span>
          <span className="trait-reveal__value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
