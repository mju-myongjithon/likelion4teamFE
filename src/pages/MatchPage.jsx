import { useEffect, useRef, useState } from 'react';
import { RefreshCw, X, Check } from 'lucide-react';
import SyncCharacter from '../components/SyncCharacter';
import MatchScoreCard from '../components/MatchScoreCard';
import { checkTodayMatch, acceptAndAttemptMatch, declineMatch } from '../api/matchApi';

const POLL_INTERVAL_MS = 4000;

// F3. 유사도 매칭 화면
// status: NOT_REQUESTED(수락/거부 선택) | PENDING(매칭중) | MATCHED(완료) | DECLINED(거부함)
//
// 보안 참고: 백엔드가 revealedToMe=false여도 similarityScore/scoreBreakdown을
// 응답에 그대로 채워서 보낸다(서버 사이드 게이팅 미반영, 알려진 이슈).
// 그래서 FE에서 반드시 revealedToMe가 true일 때만 이 값들을 화면에 그려야 한다.
// F5(양방향 공개, 2단계 게이트) 붙으면 이 부분 전체를 새 상태값 기준으로 다시 짜야 함.
export default function MatchPage({ onGoToUpload }) {
  const [state, setState] = useState('checking'); // checking | not_requested | pending | matched | declined | no-analysis | error
  const [match, setMatch] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const pollTimer = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    checkInitialStatus();
    return () => clearTimeout(pollTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkInitialStatus() {
    setState('checking');
    try {
      const data = await checkTodayMatch();
      applyStatus(data);
    } catch (err) {
      handleError(err);
    }
  }

  function applyStatus(data) {
    if (data.status === 'MATCHED' && data.match) {
      setMatch(data.match);
      setState('matched');
      return;
    }
    if (data.status === 'DECLINED') {
      setState('declined');
      return;
    }
    if (data.status === 'PENDING') {
      setState('pending');
      pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
      return;
    }
    setState('not_requested');
  }

  async function poll() {
    try {
      const data = await acceptAndAttemptMatch();
      applyStatus(data);
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err) {
    if (err.code === 'ANALYSIS_NOT_FOUND') {
      setState('no-analysis');
      return;
    }
    setState('error');
  }

  async function handleAccept() {
    setIsAccepting(true);
    try {
      const data = await acceptAndAttemptMatch();
      applyStatus(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsAccepting(false);
    }
  }

  async function handleDecline() {
    setIsDeclining(true);
    try {
      const data = await declineMatch();
      applyStatus(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsDeclining(false);
    }
  }

  return (
    <div className="screen match-screen">
      <p className="eyebrow">MATCH</p>

      {state === 'checking' && (
        <>
          <h1 className="screen-title">매칭 상태를 확인하는 중</h1>
          <SyncCharacter />
        </>
      )}

      {state === 'not_requested' && (
        <div className="match-state">
          <h1 className="screen-title">오늘의 매칭을 시작할까요?</h1>
          <p className="screen-sub">
            수락하면 반대 캠퍼스에서 나와 가장 비슷한 하루를 보낸 상대를 찾아드려요
          </p>
          <div className="match-decision-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleDecline}
              disabled={isDeclining || isAccepting}
            >
              <X size={16} strokeWidth={2} />
              오늘은 안 할래요
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
            >
              <Check size={16} strokeWidth={2} />
              {isAccepting ? '수락하는 중…' : '매칭 수락'}
            </button>
          </div>
        </div>
      )}

      {state === 'pending' && (
        <>
          <h1 className="screen-title">매칭중…</h1>
          <p className="screen-sub">
            반대 캠퍼스에서 오늘을 기록하고 수락한 상대가 나타나면 바로 알려드릴게요
          </p>
          <SyncCharacter />
        </>
      )}

      {state === 'declined' && (
        <div className="match-state">
          <h1 className="screen-title">오늘은 매칭을 쉬어가요</h1>
          <p className="screen-sub">내일 다시 참여할 수 있어요</p>
        </div>
      )}

      {state === 'no-analysis' && (
        <div className="match-state">
          <h1 className="screen-title">먼저 오늘을 기록해주세요</h1>
          <p className="screen-sub">매칭은 오늘의 분석(F2)을 완료해야 시작돼요</p>
          <button type="button" className="btn-primary" onClick={onGoToUpload}>
            사진 올리러 가기
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="match-state">
          <h1 className="screen-title">매칭 정보를 불러오지 못했어요</h1>
          <p className="screen-sub">잠시 후 다시 시도해주세요</p>
          <button type="button" className="btn-primary" onClick={checkInitialStatus}>
            <RefreshCw size={16} strokeWidth={2} />
            다시 시도하기
          </button>
        </div>
      )}

      {state === 'matched' && match && (
        <>
          <h1 className="screen-title">오늘의 매칭</h1>
          <p className="screen-sub">
            {match.revealedToMe
              ? `${match.partnerNickname}님과 ${match.similarityScore}% 닮았어요`
              : '오늘의 상대가 정해졌어요'}
          </p>

          {match.revealedToMe ? (
            <>
              <MatchScoreCard score={match.similarityScore} breakdown={match.scoreBreakdown} />
              <div className="match-reveal-row">
                <div className="match-reveal-row__text">
                  <span className="match-reveal-row__label">
                    {match.partnerNickname} · {match.partnerCampus}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="match-state">
              <p className="screen-sub">
                상대 공개 기능(F5)이 곧 추가돼요. 준비되면 여기서 상대 사진을 보고
                대화할지 직접 선택할 수 있어요.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}