import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import SyncCharacter from '../components/SyncCharacter';
import { checkTodayMatch } from '../api/matchApi';
import { sendMessage, pollMessages } from '../api/chatApi';

const POLL_INTERVAL_MS = 2500;

// F5. 매칭 채팅 화면 — 하단 탭바의 "채팅" 탭으로 진입한다(업로드/오늘의 기록/프로필과 동급 탭).
// matchId를 prop으로 받지 않고, 마운트 시 스스로 오늘의 매칭 상태를 조회해 CONNECTED인지·
// 상대가 누구인지 파악한다 — 탭은 다른 탭으로 이동했다 돌아와도 항상 새로 마운트되므로,
// 그때마다 최신 상태를 다시 확인하는 이 방식이 자연스럽다.
//
// 탭 전환으로 화면을 벗어나는 것은 "채팅 종료"가 아니라 그냥 "잠깐 안 보는 것"이다 — 이미
// CONNECTED로 확정된 관계라 F3의 PENDING 취소 같은 이탈 시 종료 로직은 없다. 탭을 벗어나면
// 폴링만 멈추고, 다시 채팅 탭으로 오면 히스토리를 다시 불러와 폴링을 재개한다.
export default function ChatPage() {
  const [state, setState] = useState('checking'); // checking | ready | not-connected | error
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);

  const matchIdRef = useRef(null);
  const lastMessageIdRef = useRef(0);
  const pollTimer = useRef(null);
  const isMountedRef = useRef(true);
  const hasStarted = useRef(false); // StrictMode의 "마운트→클린업→마운트" 중 init()이 두 번 불리는 것만 막는다
  const listEndRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    if (!hasStarted.current) {
      hasStarted.current = true;
      init();
    }
    return () => {
      isMountedRef.current = false;
      clearTimeout(pollTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  async function init() {
    setState('checking');
    try {
      const data = await checkTodayMatch();
      if (!isMountedRef.current) return;
      if (data.status !== 'CONNECTED' || !data.match) {
        setState('not-connected');
        return;
      }
      matchIdRef.current = data.match.matchId;
      setMatch(data.match);

      const history = await pollMessages(data.match.matchId);
      if (!isMountedRef.current) return;
      applyNewMessages(history);
      setState('ready');
      schedulePoll();
    } catch (err) {
      if (!isMountedRef.current) return;
      setState('error');
    }
  }

  // afterId 커서로 새로 받은 메시지들을 리스트 뒤에 이어붙인다. 서버가 messageId 오름차순으로 주므로
  // 마지막 원소의 messageId를 다음 폴링의 afterId로 그대로 쓰면 된다.
  function applyNewMessages(list) {
    if (!list || list.length === 0) return;
    setMessages((prev) => [...prev, ...list]);
    lastMessageIdRef.current = list[list.length - 1].messageId;
  }

  function schedulePoll() {
    pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
  }

  async function poll() {
    try {
      const list = await pollMessages(matchIdRef.current, lastMessageIdRef.current);
      if (!isMountedRef.current) return;
      applyNewMessages(list);
    } catch {
      // 폴링 한 번 실패한 건 조용히 넘기고 다음 폴링에서 다시 시도한다
    } finally {
      if (isMountedRef.current) schedulePoll();
    }
  }

  async function handleSend() {
    const content = draft.trim();
    if (!content || isSending) return;
    setIsSending(true);
    try {
      const sent = await sendMessage(matchIdRef.current, content);
      if (!isMountedRef.current) return;
      applyNewMessages([sent]);
      setDraft('');
    } catch {
      // 실패 시 입력값을 지우지 않고 그대로 둬서 재전송할 수 있게 한다
    } finally {
      if (isMountedRef.current) setIsSending(false);
    }
  }

  if (state === 'checking') {
    return (
      <div className="screen chat-screen chat-screen--centered">
        <p className="eyebrow">CHAT</p>
        <h1 className="screen-title">채팅방을 여는 중</h1>
        <SyncCharacter />
      </div>
    );
  }

  if (state === 'not-connected') {
    return (
      <div className="screen chat-screen chat-screen--centered">
        <p className="eyebrow">CHAT</p>
        <div className="match-state">
          <h1 className="screen-title">아직 채팅할 상대가 없어요</h1>
          <p className="screen-sub">
            매칭이 성사되고 서로 채팅을 수락하면 여기서 대화할 수 있어요
          </p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="screen chat-screen chat-screen--centered">
        <p className="eyebrow">CHAT</p>
        <div className="match-state">
          <h1 className="screen-title">채팅을 불러오지 못했어요</h1>
          <p className="screen-sub">잠시 후 다시 시도해주세요</p>
          <button type="button" className="btn-primary" onClick={init}>
            <RefreshCw size={16} strokeWidth={2} />
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen chat-screen">
      <div className="chat-header">
        <span className="chat-header__title">{match?.partnerNickname}</span>
      </div>

      <div className="chat-message-list">
        {messages.map((m) => (
          <div key={m.messageId} className={`chat-bubble-row ${m.mine ? 'is-mine' : ''}`}>
            <div className="chat-bubble">{m.content}</div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="메시지를 입력하세요"
          maxLength={1000}
          disabled={isSending}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={isSending || !draft.trim()}
          aria-label="전송"
        >
          <Send size={18} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
