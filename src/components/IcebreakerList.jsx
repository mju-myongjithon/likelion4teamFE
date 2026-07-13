import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function IcebreakerList({ questions }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="icebreaker">
      <button
        type="button"
        className="btn-secondary icebreaker__toggle"
        onClick={() => setIsOpen((v) => !v)}
      >
        <MessageCircle size={16} strokeWidth={2} />
        아이스브레이킹 질문 {isOpen ? '숨기기' : '보기'}
      </button>
      {isOpen && (
        <ul className="icebreaker__list">
          {questions.map((q) => (
            <li key={q} className="icebreaker__item">{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
}