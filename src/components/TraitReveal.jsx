const TIME_LABEL = {
  morning: '아침',
  afternoon: '오후',
  evening: '저녁',
  night: '밤',
};

export default function TraitReveal({ result }) {
  const cards = [
    {
      title: '나의 공간',
      score: 84,
      values: result.sceneTags,
    },
    {
      title: '나의 바이브',
      score: 88,
      values: [result.mood, result.dominantColor],
    },
    {
      title: '나의 시간',
      score: 76,
      values: [TIME_LABEL[result.timeOfDay] ?? result.timeOfDay, ...result.activityTags.slice(0, 3)],
    },
  ];

  return (
    <div className="trait-reveal">
      {cards.map((card, i) => (
        <section
          key={card.title}
          className="trait-card"
          style={{ '--delay': `${i * 180}ms` }}
        >
          <div className="trait-card__head">
            <h2>{card.title}</h2>
            <strong>{card.score}%</strong>
          </div>
          <div className="trait-card__grid">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="trait-card__tile">
                {card.values[index] && <span>{card.values[index]}</span>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
