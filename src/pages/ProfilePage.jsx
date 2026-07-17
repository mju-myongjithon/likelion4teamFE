import { getCurrentNickname, getCurrentCampus } from '../utils/currentUser';

function campusLabel(campus) {
  return campus === 'NATURAL' ? '자연' : '인문';
}

// F0에서 입력받은 두 정보(닉네임·캠퍼스)만 보여준다. 수정 기능은 없다 —
// 서버에 값을 다시 물어보거나 바꿀 API가 없어 sessionStorage에 저장된
// 값을 그대로 표시만 한다.
export default function ProfilePage() {
  const nickname = getCurrentNickname();
  const campus = getCurrentCampus();

  return (
    <div className="screen profile-screen">
      <p className="eyebrow">PROFILE</p>
      <div className="profile-screen__card">
        <h1 className="profile-screen__nickname">{nickname}</h1>
        <p className="profile-screen__campus">{campusLabel(campus)}캠퍼스</p>
      </div>
    </div>
  );
}
