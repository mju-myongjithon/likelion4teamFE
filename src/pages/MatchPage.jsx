import { useEffect, useRef, useState } from 'react';
import { RefreshCw, X, Check, MessageCircle } from 'lucide-react';
import SyncCharacter from '../components/SyncCharacter';
import MatchScoreCard from '../components/MatchScoreCard';
import {
  checkTodayMatch,
  acceptAndAttemptMatch,
  declineMatch,
  acceptChat,
  rejectChat,
} from '../api/matchApi';

const POLL_INTERVAL_MS = 4000;

// F3. 유사도 매칭 화면 — 백엔드 게이트2(채팅 참여)까지 반영.
// 상태(status)가 화면과 1:1로 대응한다:
//   NOT_REQUESTED  → 참여 확인(2b1)
//   PENDING        → 매칭 대기(2b2)      [POST /api/matches 폴링]
//   MATCHED        → 매칭 발견(2b3)      [상대 공개 + 채팅 수락/거절]
//   AWAITING_PARTNER → 상대 응답 대기(2b4) [GET /today 폴링]
//   CONNECTED      → 매칭 완료(2c)       [유사도/근거 공개, 채팅은 F5]
//   ENDED          → 매칭 종료(2d)
//   DECLINED       → 게이트1 거부(참여 안 함)
//
// 미구현 데이터(placeholder + TODO): 상대 사진, AI 코멘트, 2b3 상대 태그.
// 백엔드 열린 항목이 뚫리면 placeholder만 실데이터로 교체하면 된다.
export default function MatchPage({ onGoToUpload }) {
  const [state, setState] = useState('checking');
  const [match, setMatch] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false); // 게이트1 수락
  const [isDeclining, setIsDeclining] = useState(false); // 게이트1 거부
  const [isChatDeciding, setIsChatDeciding] = useState(false); // 게이트2 수락/거부
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
      applyStatus(await checkTodayMatch());
    } catch (err) {
      handleError(err);
    }
  }

  // 응답 status를 화면 상태로 매핑하고, 필요한 폴링을 건다.
  function applyStatus(data) {
    clearTimeout(pollTimer.current);
    const status = data.status;

    if (status === 'MATCHED' && data.match) {
      setMatch(data.match);
      setState('matched');
      return;
    }
    if (status === 'AWAITING_PARTNER' && data.match) {
      setMatch(data.match);
      setState('awaiting_partner');
      pollTimer.current = setTimeout(pollAwaiting, POLL_INTERVAL_MS); // 상대 수락을 조회만 폴링
      return;
    }
    if (status === 'CONNECTED' && data.match) {
      setMatch(data.match);
      setState('connected');
      return;
    }
    if (status === 'ENDED') {
      setState('ended');
      return;
    }
    if (status === 'DECLINED') {
      setState('declined');
      return;
    }
    if (status === 'PENDING') {
      setState('pending');
      pollTimer.current = setTimeout(pollPending, POLL_INTERVAL_MS); // 실제 매칭을 진행시키는 폴링
      return;
    }
    setState('not_requested');
  }

  // 2b2: POST /api/matches 를 반복 호출해 매칭을 진행시킨다.
  async function pollPending() {
    try {
      applyStatus(await acceptAndAttemptMatch());
    } catch (err) {
      handleError(err);
    }
  }

  // 2b4: 내 채팅 수락은 이미 끝났으므로 GET 으로 상대 응답만 지켜본다.
  async function pollAwaiting() {
    try {
      applyStatus(await checkTodayMatch());
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

  // ---- 게이트1: 매칭 참여 수락/거부 ----
  async function handleAccept() {
    setIsAccepting(true);
    try {
      applyStatus(await acceptAndAttemptMatch());
    } catch (err) {
      handleError(err);
    } finally {
      setIsAccepting(false);
    }
  }

  async function handleDecline() {
    setIsDeclining(true);
    try {
      applyStatus(await declineMatch());
    } catch (err) {
      handleError(err);
    } finally {
      setIsDeclining(false);
    }
  }

  // ---- 게이트2: 채팅 참여 수락/거부 ----
  async function handleAcceptChat() {
    setIsChatDeciding(true);
    try {
      applyStatus(await acceptChat());
    } catch (err) {
      handleError(err);
    } finally {
      setIsChatDeciding(false);
    }
  }

  async function handleRejectChat() {
    setIsChatDeciding(true);
    try {
      applyStatus(await rejectChat());
    } catch (err) {
      handleError(err);
    } finally {
      setIsChatDeciding(false);
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

      {/* 2b3 매칭 발견 — 상대 공개 + 채팅 수락/거절 */}
      {state === 'matched' && match && (
        <div className="match-found">
          <h1 className="screen-title">나랑 가장 비슷한 하루를 보낸 사람을 발견했어요!</h1>

          {/* TODO(F5 reveal): 상대 사진 3장(블러). MatchResponse에 상대 오늘 사진 URL이 추가되면 이 placeholder 교체 */}
          <div className="match-photos-placeholder" aria-hidden="true">
            상대 사진은 공개 준비 중이에요
          </div>

          {/* TODO(2b3 태그): commonTags는 CONNECTED에서만 열림 → 게이팅 완화되면 상대 태그 표시 */}

          <div className="match-reveal-row">
            <div className="match-partner-thumb is-blurred" />
            <div className="match-reveal-row__text">
              <span className="match-reveal-row__label">
                {match.partnerNickname} · {match.partnerCampus}
              </span>
            </div>
          </div>

          <p className="screen-sub">유사도와 AI 코멘트는 대화를 시작하면 확인할 수 있어요</p>

          <div className="match-decision-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRejectChat}
              disabled={isChatDeciding}
            >
              <X size={16} strokeWidth={2} />
              거절
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleAcceptChat}
              disabled={isChatDeciding}
            >
              <Check size={16} strokeWidth={2} />
              {isChatDeciding ? '처리 중…' : '수락하기'}
            </button>
          </div>
        </div>
      )}

      {/* 2b4 상대 응답 대기 */}
      {state === 'awaiting_partner' && match && (
        <>
          <h1 className="screen-title">{match.partnerNickname}님의 응답을 기다리는 중…</h1>
          <p className="screen-sub">상대가 대화를 수락하면 알려드릴게요</p>
          <SyncCharacter />
        </>
      )}

      {/* 2c 매칭 완료 — 유사도/근거 공개, 채팅은 F5 */}
      {state === 'connected' && match && (
        <>
          <h1 className="screen-title">{match.partnerNickname}님과 매칭됐어요</h1>
          <p className="screen-sub">{match.partnerCampus} 학생과 대화를 시작할 수 있어요</p>

          <MatchScoreCard score={match.similarityScore} breakdown={match.scoreBreakdown} />

          {/* aiComment는 CONNECTED 시점에 F4로 생성된다. null이면 생성 실패이므로 실패 문구로 대체(매칭 자체는 정상). */}
          <div className="match-ai-comment">
            <span className="match-ai-comment__label">AI 코멘트</span>
            <p className="match-ai-comment__body">
              {match.aiComment ?? (
                <span className="match-ai-comment__placeholder">
                  AI 코멘트를 불러오지 못했어요
                </span>
              )}
            </p>
          </div>

          {/* TODO(F5 채팅): 채팅(2e)은 F5 담당. connectedAt 신호로 F5가 방을 열면 여기서 이동 */}
          <div className="match-screen__footer">
            <button type="button" className="btn-primary" disabled title="채팅(F5) 준비 중">
              <MessageCircle size={16} strokeWidth={2} />
              채팅 시작하기
            </button>
            <p className="match-hint">채팅 기능(F5)은 곧 추가돼요</p>
          </div>
        </>
      )}

      {/* 2d 매칭 종료 */}
      {state === 'ended' && (
        <div className="match-state">
          <div className="match-state__icon">
            <X size={24} strokeWidth={1.5} />
          </div>
          <h1 className="screen-title">오늘은 여기까지예요</h1>
          <p className="screen-sub">
            이번 매칭은 대화로 이어지지 않았어요. 내일 다시 새로운 하루를 기록해보세요.
          </p>
        </div>
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
    </div>
  );
}
