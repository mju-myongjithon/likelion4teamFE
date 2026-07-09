import { useEffect, useRef, useState } from 'react';
import { Lock, RefreshCw, Search, UserPlus } from 'lucide-react';
import SyncCharacter from '../components/SyncCharacter';
import MatchScoreCard from '../components/MatchScoreCard';
import IcebreakerList from '../components/IcebreakerList';
import { findTodayMatch, revealMatch, requestFriend } from '../api/matchApi';

export default function MatchPage() {
  const [status, setStatus] = useState('loading'); // loading | waiting | locked | revealed | error
  const [match, setMatch] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFriendRequested, setIsFriendRequested] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setStatus('loading');
    setMatch(null);
    setIsRevealed(false);
    setIsFriendRequested(false);
    try {
      const data = await findTodayMatch();
      if (data.status === 'revealed') setMatch(data);
      setStatus(data.status);
    } catch (err) {
      setStatus('error');
    }
  }

  async function handleReveal() {
    if (!match) return;
    await revealMatch(match.matchId);
    setIsRevealed(true);
  }

  async function handleFriendRequest() {
    if (!match) return;
    await requestFriend(match.matchId);
    setIsFriendRequested(true);
  }

  return (
    <div className="screen match-screen">
      <p className="eyebrow">MATCH</p>

      {status === 'loading' && (
        <>
          <h1 className="screen-title">오늘의 상대를 찾는 중</h1>
          <p className="screen-sub">반대 캠퍼스에서 오늘을 기록한 상대를 찾고 있어요</p>
          <SyncCharacter />
        </>
      )}

      {status === 'waiting' && (
        <div className="match-state">
          <span className="match-state__icon">
            <Search size={26} strokeWidth={1.8} />
          </span>
          <h1 className="screen-title">아직 매칭 상대가 없어요</h1>
          <p className="screen-sub">
            오늘을 기록한 반대 캠퍼스 학생이 아직 없어요. 조금 이따 다시 확인해보세요
          </p>
          <button type="button" className="btn-primary" onClick={load}>
            <RefreshCw size={16} strokeWidth={2} />
            다시 확인하기
          </button>
        </div>
      )}

      {status === 'locked' && (
        <div className="match-state">
          <span className="match-state__icon">
            <Lock size={26} strokeWidth={1.8} />
          </span>
          <h1 className="screen-title">매칭 상대는 정해졌어요</h1>
          <p className="screen-sub">
            상대가 아직 오늘을 기록하지 않았어요. 완료되면 결과가 열려요
          </p>
          <button type="button" className="btn-primary" onClick={load}>
            <RefreshCw size={16} strokeWidth={2} />
            다시 확인하기
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="match-state">
          <h1 className="screen-title">매칭 정보를 불러오지 못했어요</h1>
          <p className="screen-sub">잠시 후 다시 시도해주세요</p>
          <button type="button" className="btn-primary" onClick={load}>
            다시 시도하기
          </button>
        </div>
      )}

      {status === 'revealed' && match && (
        <>
          <h1 className="screen-title">오늘의 매칭</h1>
          <p className="screen-sub">{match.aiComment}</p>

          <MatchScoreCard score={match.similarityScore} breakdown={match.scoreBreakdown} />

          <div className="match-reveal-row">
            <span className={`match-partner-thumb ${isRevealed ? '' : 'is-blurred'}`} />
            <div className="match-reveal-row__text">
              <span className="match-reveal-row__label">
                {isRevealed ? '상대방 사진이 공개됐어요' : '상대방 사진은 아직 비공개예요'}
              </span>
              {!isRevealed && (
                <button type="button" className="btn-secondary" onClick={handleReveal}>
                  공개하기
                </button>
              )}
            </div>
          </div>

          <IcebreakerList questions={match.icebreakerQuestions} />

          <div className="match-screen__footer">
            <button
              type="button"
              className="btn-primary"
              disabled={isFriendRequested}
              onClick={handleFriendRequest}
            >
              <UserPlus size={16} strokeWidth={2} />
              {isFriendRequested ? '신청 완료' : '친구 신청하기'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}