import { ArrowUp, Sparkles, MessageCircle, Circle } from 'lucide-react';

const TABS = [
  { id: 'upload', label: '업로드', Icon: ArrowUp },
  { id: 'analysis', label: '오늘의 기록', Icon: Sparkles },
  { id: 'chat', label: '채팅', Icon: MessageCircle },
  { id: 'profile', label: '프로필', Icon: Circle },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            className={`bottom-nav__item ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
