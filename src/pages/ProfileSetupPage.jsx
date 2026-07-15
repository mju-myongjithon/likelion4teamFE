import { useState } from 'react';
import { createGuestUser } from '../api/userApi';

// F0. 사진 업로드 전에 뜨는 게스트 프로필 입력 화면.
// 로그인/회원가입이 아니라 닉네임·캠퍼스만 받아 그 세션 동안만 쓸 유저를 만든다.
export default function ProfileSetupPage({ onComplete }) {
  const [nickname, setNickname] = useState('');
  const [campus, setCampus] = useState('HUMANITIES');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = nickname.trim().length > 0 && !isSubmitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const user = await createGuestUser(nickname.trim(), campus);
      onComplete(user.userId);
    } catch (err) {
      setError(err.message ?? '유저 정보를 저장하지 못했어요');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="profile-setup">
      <form className="profile-setup__card" onSubmit={handleSubmit}>
        <span className="profile-setup__logo">Sync.day</span>
        <p className="profile-setup__subtitle">오늘의 순간을 기록하세요</p>

        <input
          className="profile-setup__input"
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={50}
          autoFocus
        />

        <select
          className="profile-setup__select"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
        >
          <option value="HUMANITIES">인문캠퍼스</option>
          <option value="NATURAL">자연캠퍼스</option>
        </select>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {isSubmitting ? '시작하는 중…' : '시작하기'}
        </button>
      </form>
    </div>
  );
}
