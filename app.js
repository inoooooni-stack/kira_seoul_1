/* 사회공헌위원회 시스템 (2026) - Vanilla HTML/CSS/JS single page app
   - 원본(첨부 txt) React 로직을 동일한 데이터/권한 규칙으로 포팅
   - 저장: localStorage
*/

(() => {
  const ROOT = document.getElementById('app');
  const STORAGE_KEY = 'scw_system_2026_v1';

  const ICONS = {
    home: 'home',
    users: 'users',
    calendar: 'calendar',
    briefcase: 'briefcase',
    dashboard: 'home',
    schedule: 'calendar',
    projects: 'briefcase',
    checklist: 'list-checks',
    members: 'users',
    settings: 'settings',
    bell: 'bell',
    logout: 'log-out',
    plus: 'plus',
    edit: 'edit',
    edit3: 'edit-3',
    trash: 'trash-2',
    save: 'save',
    lock: 'lock',
    chevronRight: 'chevron-right',
    droplet: 'droplet',
    heart: 'heart',
    wrench: 'wrench',
    activity: 'activity',
    clock: 'clock',
    checkCircle: 'check-circle',
    circle: 'circle',
    x: 'x',
  };

  const TIME_OPTIONS = (() => {
    const out = [];
    for (let i = 7; i <= 22; i++) {
      const hour = String(i).padStart(2, '0');
      out.push(`${hour}:00`);
      out.push(`${hour}:30`);
    }
    return out;
  })();

  const INITIAL_SCHEDULES = [
    { id: 1, month: '2월', title: '제1회 사회공헌위원회 (연간 계획 수립)', status: 'completed', isMeeting: true, exactDate: '2026-02-25T10:00', agenda: '2025년 사업 회고 및 2026년 사업 계획 수립' },
    { id: 2, month: '4월', title: '쿨루프 사업 대상지 수요조사 및 사전답사', status: 'current' },
    { id: 9, month: '4월', title: '제3회 사회공헌위원회 회의', status: 'upcoming', isMeeting: true, exactDate: '2026-04-14T16:00', agenda: '쿨루프 사전답사 결과 보고 및 본일정 편성' },
    { id: 3, month: '5월-6월', title: '시원한 옥상 만들기 (쿨루프) 본작업', desc: '※ 기온 25도 이하 권장 (하절기 이전 완료)', status: 'upcoming' },
    { id: 4, month: '7월', title: '사랑의 집 고쳐주기 / 김장김치 25개구 수요조사 공문 발송', status: 'upcoming' },
    { id: 5, month: '9월-10월', title: '사랑의 집 고쳐주기 사전답사 및 가이드라인 배포', status: 'upcoming' },
    { id: 6, month: '10월 말', title: '사랑의 집 고쳐주기 시공 및 문고리(안심홀) 병행', status: 'upcoming' },
    { id: 7, month: '11월 초', title: '건축사대회 연계 헌혈 봉사 / 플로깅', status: 'upcoming' },
    { id: 8, month: '11월 말', title: '이웃사랑 김장김치 나눔 행사', desc: '※ 예산 및 배추 단가 사전 확인 필수', status: 'upcoming' },
  ];

  const INITIAL_PROJECTS = [
    {
      id: 1,
      title: '시원한 옥상 만들기 (쿨루프)',
      icon: ICONS.droplet,
      theme: 'primary',
      tasks: [
        { id: 11, text: 'KCC 기술지원 및 자문 협의 완료', completed: true },
        { id: 12, text: '대상 구건축사회 협조 공문 발송', completed: false },
        { id: 13, text: '상도/하도 작업 건조 시간을 고려한 오전/오후조 편성', completed: false },
        { id: 14, text: '작업용품(롤러, 테이프 등) 및 쿨루프 장비 비용 예산 파악', completed: false },
        { id: 15, text: '노동 강도 대비 참여 건축사(자원봉사자) 식대 예산 배정', completed: false },
      ],
      description:
        '여름철 기온 상승 전(5~6월) 시공 완료를 목표로 조기 착수하는 쿨루프 사업입니다. 과거(24-25년) 은평, 강동 등에서 진행되었으며 올해도 KCC와의 기술지원 협력이 필요합니다.',
      schedules: [
        { id: 101, district: '강동구', type: '사전청소', date: '2026.05.08 (예정)', memberIds: [3], contact: '강동구 담당자', completed: true },
        { id: 102, district: '강동구', type: '본봉사', date: '2026.05.15 (예정)', memberIds: [3, 8, 6], contact: '오전/오후반 편성', completed: false },
        { id: 103, district: '은평구', type: '사전청소', date: '2026.05.15 (예정)', memberIds: [2], contact: '은평구 담당자', completed: false },
        { id: 104, district: '은평구', type: '본봉사', date: '2026.05.22 (예정)', memberIds: [2, 10, 7], contact: '오전/오후반 편성', completed: false },
      ],
    },
    {
      id: 2,
      title: '사랑의 집 고쳐주기',
      icon: ICONS.home,
      theme: 'primary',
      tasks: [
        { id: 21, text: '25개구 대상 수요조사 공문 발송 및 접수', completed: false },
        { id: 22, text: '사전답사 체크리스트 양식 업데이트', completed: false },
        { id: 23, text: '표준 구비용품(도배, 장판 등) 단가 확인 및 리스트 작성', completed: false },
        { id: 24, text: '사전조사 결과 자료 공유 폴더 취합 및 위원장 보고', completed: false },
        { id: 25, text: '참여 건축사 대상 상해보험 가입 진행', completed: false },
        { id: 26, text: '주거 안전설비(소화기, 화재경보기 등) 추가 설치 예산 검토', completed: false },
      ],
      description:
        '주거 취약계층의 도배, 장판 등을 지원하는 사업입니다. 올해는 사업지 선정 기준을 명확히 하고, 위원회 차원의 가이드라인과 공통 필요 물품을 배포할 예정입니다.',
      schedules: [
        { id: 201, district: '관악구', type: '사전답사', date: '2026.09.20 (예정)', memberIds: [7], contact: '관악구 건축사회', completed: false },
        { id: 202, district: '관악구', type: '본봉사', date: '2026.10.20 (예정)', memberIds: [7, 8, 3], contact: '도배/장판', completed: false },
        { id: 203, district: '강남구', type: '사전답사', date: '2026.09.24 (예정)', memberIds: [6], contact: '강남구 건축사회', completed: false },
        { id: 204, district: '강남구', type: '본봉사', date: '2026.10.24 (예정)', memberIds: [6, 8, 10, 9], contact: '도배/장판', completed: false },
        { id: 205, district: '은평구', type: '사전답사', date: '2026.09.29 (예정)', memberIds: [4], contact: '은평구 건축사회', completed: false },
        { id: 206, district: '은평구', type: '본봉사', date: '2026.10.29 (예정)', memberIds: [4, 6, 10], contact: '도배/장판', completed: false },
      ],
    },
    {
      id: 3,
      title: '이웃사랑 김장김치 나눔',
      icon: ICONS.heart,
      theme: 'primary',
      tasks: [
        { id: 31, text: '배추 단가 등 물가 인상분 반영하여 수량 및 예산 재편성', completed: false },
        { id: 32, text: '각 지역구 명칭이 포함된 박스용 신규 스티커 디자인 제작', completed: false },
        { id: 33, text: '행사용 대형 현수막(5m * 80cm) 신규 제작 발주', completed: false },
        { id: 34, text: '절임배추 하차 및 물빼기 도구 사전 준비', completed: false },
        { id: 35, text: '포장용 상자 및 속넣기 작업대 셋팅 계획 수립', completed: false },
      ],
      description:
        '매년 연말에 진행되는 대표 사회공헌 사업입니다. 작년 물가 상승 및 박스 혼선 이슈를 반영하여 새로운 디자인의 구별 스티커를 제작하고 예산을 재조정할 계획입니다.',
      schedules: [
        { id: 301, district: '전체지역', type: '물빼기 및 하차 (08:00)', date: '2026.11.25', memberIds: [1, 2], contact: '건축사회관 1층', completed: false },
        { id: 302, district: '전체지역', type: '상자 조립 (09:00)', date: '2026.11.25', memberIds: [3, 4, 5], contact: '건축사회관 1층', completed: false },
        { id: 303, district: '전체지역', type: '김치 속넣기 (10:00)', date: '2026.11.25', memberIds: [6, 7, 8], contact: '건축사회관 1층', completed: false },
        { id: 304, district: '전체지역', type: '포장 및 상차 (12:00)', date: '2026.11.25', memberIds: [9, 10], contact: '건축사회관 1층', completed: false },
      ],
    },
    {
      id: 4,
      title: '안심홀 (문고리 사고 예방)',
      icon: ICONS.wrench,
      theme: 'primary',
      tasks: [
        { id: 41, text: '안심홀 안내 리플렛 구청 민원실 비치 현황 파악', completed: true },
        { id: 42, text: '집고쳐주기 대상 가구 방문 시 병행 설치 사전 안내', completed: false },
        { id: 43, text: '실리콘 마개 및 타공 장비 수량 파악 및 점검', completed: false },
      ],
      description:
        '화장실 문 갇힘 사고를 예방하기 위한 타공 및 실리콘 마개 설치 사업입니다. 적은 예산으로 진행 가능하며 집고쳐주기 사업 답사 및 시공 시 병행하여 추진됩니다.',
      schedules: [
        { id: 401, district: '광진구', type: '병행시공', date: '상시', memberIds: [], contact: '광진구 민원실 협조', completed: false },
        { id: 402, district: '강서구', type: '병행시공', date: '상시', memberIds: [], contact: '강서구 민원실 협조', completed: false },
        { id: 403, district: '금천구', type: '병행시공', date: '상시', memberIds: [9], contact: '금천구 건축과 협조', completed: false },
      ],
    },
    {
      id: 5,
      title: '건축사대회 연계 헌혈 봉사',
      icon: ICONS.activity,
      theme: 'secondary',
      tasks: [
        { id: 51, text: '대한적십자사 헌혈 버스 배차 협의', completed: false },
        { id: 52, text: '건축사대회 참석자 대상 헌혈 독려 안내문 발송', completed: false },
        { id: 53, text: '헌혈증서 기부 및 서약서 작성 창구 운영 계획 수립', completed: false },
      ],
      description: '하반기 건축사대회 행사와 연계하여 진행하는 헌혈 캠페인 및 헌혈증서 기부 활동입니다.',
      schedules: [{ id: 501, district: '건축사대회장', type: '본행사', date: '2026.11.05 (예정)', memberIds: [], contact: '사무처 협조', completed: false }],
    },
  ];

  const INITIAL_MEMBERS = [
    { id: 1, name: '박병걸', role: '위원장', group: '임원진' },
    { id: 2, name: '정경선', role: '책임이사', group: '임원진' },
    { id: 3, name: '황경순', role: '부위원장', group: '임원진' },
    { id: 4, name: '김혜진', role: '총무위원', group: '임원진' },
    { id: 5, name: '김영랑', role: '위원', group: '위원' },
    { id: 6, name: '김윤상', role: '위원', group: '위원' },
    { id: 7, name: '류상현', role: '위원', group: '위원' },
    { id: 8, name: '백수정', role: '위원', group: '위원' },
    { id: 9, name: '이정이', role: '위원', group: '위원' },
    { id: 10, name: '형원균', role: '위원', group: '위원' },
  ];

  function isMemberAdmin(role) {
    return ['위원장', '부위원장', '총무위원'].includes(role);
  }

  function safeId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  function formatMeetingDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const yyyy = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}년 ${mm}월 ${dd}일(${days[d.getDay()]}) ${hh}:${mi}`;
  }

  function parseYmdFromDotDate(dateStr) {
    const match = String(dateStr || '').match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (!match) return Infinity;
    const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return d.getTime();
  }

  function formatScheduleDateCell(dateStr) {
    const raw = String(dateStr || '').trim();
    if (!raw) return '';
    // 첫 공백을 기준으로 2줄 표기 (예: "2026.05.15 (예정)" -> "2026.05.15" / "(예정)")
    const idx = raw.indexOf(' ');
    if (idx === -1) return escapeHtml(raw);
    const first = raw.slice(0, idx).trim();
    const rest = raw.slice(idx + 1).trim();
    return `
      <div class="datecell">
        <div class="datecell__main">${escapeHtml(first)}</div>
        <div class="datecell__sub">${escapeHtml(rest)}</div>
      </div>
    `;
  }

  function calculateProgress(tasks, schedules) {
    const total = (tasks?.length || 0) + (schedules?.length || 0);
    if (total === 0) return 0;
    const completed =
      (tasks?.filter((t) => t.completed).length || 0) + (schedules?.filter((s) => s.completed).length || 0);
    return Math.round((completed / total) * 100);
  }

  function sortSchedulesByMonthStr(schedules) {
    const getMonthNum = (monthStr) => {
      const match = String(monthStr || '').match(/(\d+)/);
      return match ? Number.parseInt(match[1], 10) : 99;
    };
    return [...schedules].sort((a, b) => getMonthNum(a.month) - getMonthNum(b.month));
  }

  // 회의 일정은 exactDate 기준으로 자동 예정/완료 처리
  function getMeetingAutoStatus(exactDate) {
    const d = new Date(exactDate);
    if (Number.isNaN(d.getTime())) return 'upcoming';
    return d.getTime() < Date.now() ? 'completed' : 'upcoming';
  }

  function getMonthStrFromExactDate(exactDate) {
    const d = new Date(exactDate);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getMonth() + 1}월`;
  }

  function normalizeMeetingSchedules() {
    let changed = false;
    const next = state.schedulesData.map((s) => {
      if (!s?.isMeeting) return s;
      const autoStatus = getMeetingAutoStatus(s.exactDate);
      const monthStr = getMonthStrFromExactDate(s.exactDate) || s.month || '';
      if (s.status !== autoStatus || s.month !== monthStr) {
        changed = true;
        return { ...s, status: autoStatus, month: monthStr };
      }
      return s;
    });
    if (changed) {
      state.schedulesData = sortSchedulesByMonthStr(next);
      saveState();
    }
  }

  function themeColors(theme, isCompleted = false) {
    if (isCompleted) {
      return {
        chipBg: '#e2e8f0',
        chipText: '#475569',
        accent: '#94a3b8',
        softBg: '#f1f5f9',
      };
    }
    if (theme === 'secondary') {
      return { chipBg: '#fef3c7', chipText: '#92400e', accent: '#f59e0b', softBg: '#fffbeb' };
    }
    return { chipBg: '#dbeafe', chipText: '#1d4ed8', accent: '#2563eb', softBg: '#eff6ff' };
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function icon(name, extra = '') {
    return `<i data-lucide="${escapeHtml(name)}" class="${escapeHtml(extra)}"></i>`;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveState() {
    const persist = {
      membersData: state.membersData,
      schedulesData: state.schedulesData,
      projectsData: state.projectsData,
      currentUserId: state.currentUser?.id ?? null,
      activeTab: state.activeTab,
      projectsExpandedProjectId: state.projectsExpandedProjectId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
  }

  function hydrateFromStorage() {
    const saved = loadState();
    if (!saved) return;
    if (Array.isArray(saved.membersData)) state.membersData = saved.membersData;
    if (Array.isArray(saved.schedulesData)) state.schedulesData = saved.schedulesData;
    if (Array.isArray(saved.projectsData)) state.projectsData = saved.projectsData;
    if (saved.projectsExpandedProjectId != null && typeof saved.projectsExpandedProjectId === 'number') {
      state.projectsExpandedProjectId = saved.projectsExpandedProjectId;
    }

    // 항상 첫 화면은 로그인 화면이어야 하므로,
    // 마지막 방문 탭/로그인 세션은 복원하지 않습니다.
    state.currentUser = null;
    state.activeTab = 'dashboard';
    state.modal = null;

    // 기존 저장소에 남아있는 마지막 탭/로그인 값도 제거(데이터는 유지)
    if (saved.currentUserId != null || typeof saved.activeTab === 'string') {
      try {
        const nextPersist = { ...saved };
        delete nextPersist.currentUserId;
        delete nextPersist.activeTab;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPersist));
      } catch {
        // ignore
      }
    }
  }

  const state = {
    membersData: structuredClone(INITIAL_MEMBERS),
    schedulesData: structuredClone(INITIAL_SCHEDULES),
    projectsData: structuredClone(INITIAL_PROJECTS),
    currentUser: null,
    activeTab: 'dashboard',
    modal: null, // { type, ...payload }
    /** 사업별 현황 탭에서 펼쳐진 상세(아코디언) */
    projectsExpandedProjectId: null,
    /** 펼침 애니메이션/스크롤을 위한 일회성 UI 상태(저장 안 함) */
    uiExpandAnimateId: null,
    uiScrollToProjectId: null,
  };

  hydrateFromStorage();
  normalizeMeetingSchedules();

  function setModal(modal) {
    state.modal = modal;
    render();
  }

  function showMessage(title, content) {
    setModal({ type: 'message', title, content });
  }

  function logout() {
    state.currentUser = null;
    state.activeTab = 'dashboard';
    state.modal = null;
    state.projectsExpandedProjectId = null;
    saveState();
    render();
  }

  function setActiveTab(tab) {
    state.activeTab = tab;
    if (tab !== 'projects') state.projectsExpandedProjectId = null;
    saveState();
    render();
  }

  function login(member) {
    state.currentUser = member;
    saveState();
    render();
  }

  /* --- Mutations (React handlers 포팅) --- */
  function toggleParticipation(projectId, scheduleId, memberId) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        schedules: (p.schedules || []).map((s) => {
          if (s.id !== scheduleId) return s;
          const ids = Array.isArray(s.memberIds) ? s.memberIds : [];
          const isIn = ids.includes(memberId);
          return { ...s, memberIds: isIn ? ids.filter((id) => id !== memberId) : [...ids, memberId] };
        }),
      };
    });
    saveState();
    render();
  }

  function toggleScheduleCompletion(projectId, scheduleId) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, schedules: p.schedules.map((s) => (s.id === scheduleId ? { ...s, completed: !s.completed } : s)) };
    });
    saveState();
    render();
  }

  function toggleTask(projectId, taskId) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) };
    });
    saveState();
    render();
  }

  function addTask(projectId, text) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: [...p.tasks, { id: safeId(), text, completed: false }] };
    });
    saveState();
    render();
  }

  function updateTask(projectId, taskId, newText) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, text: newText } : t)) };
    });
    saveState();
    render();
  }

  function deleteTask(projectId, taskId) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) };
    });
    saveState();
    render();
  }

  function addAnnualSchedule(payload) {
    state.schedulesData = sortSchedulesByMonthStr([...state.schedulesData, { ...payload, id: safeId() }]);
    saveState();
    render();
  }

  function updateAnnualSchedule(id, updated) {
    state.schedulesData = sortSchedulesByMonthStr(state.schedulesData.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    saveState();
    render();
  }

  function deleteAnnualSchedule(id) {
    state.schedulesData = state.schedulesData.filter((s) => s.id !== id);
    saveState();
    render();
  }

  function addMember(newMember) {
    state.membersData = [...state.membersData, { ...newMember, id: safeId() }];
    saveState();
    render();
  }

  function updateMember(id, updated) {
    state.membersData = state.membersData.map((m) => (m.id === id ? { ...m, ...updated } : m));
    if (state.currentUser?.id === id) {
      state.currentUser = { ...state.currentUser, ...updated };
    }
    saveState();
    render();
  }

  function deleteMember(id) {
    state.membersData = state.membersData.filter((m) => m.id !== id);
    if (state.currentUser?.id === id) {
      state.currentUser = null;
    }
    saveState();
    render();
  }

  function addProject(newProject) {
    state.projectsData = [...state.projectsData, { ...newProject, id: safeId(), tasks: [], schedules: [] }];
    saveState();
    render();
  }

  function updateProjectInfo(projectId, updatedInfo) {
    state.projectsData = state.projectsData.map((p) => (p.id === projectId ? { ...p, ...updatedInfo } : p));
    saveState();
    render();
  }

  function deleteProject(projectId) {
    state.projectsData = state.projectsData.filter((p) => p.id !== projectId);
    if (state.projectsExpandedProjectId === projectId) state.projectsExpandedProjectId = null;
    saveState();
    render();
  }

  function addProjectSchedule(projectId, newSchedule) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      const schedules = [...(p.schedules || []), { ...newSchedule, id: safeId(), memberIds: [], completed: false }];
      return { ...p, schedules };
    });
    saveState();
    render();
  }

  function updateProjectSchedule(projectId, scheduleId, updatedSchedule) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, schedules: p.schedules.map((s) => (s.id === scheduleId ? { ...s, ...updatedSchedule } : s)) };
    });
    saveState();
    render();
  }

  function deleteProjectSchedule(projectId, scheduleId) {
    state.projectsData = state.projectsData.map((p) => {
      if (p.id !== projectId) return p;
      return { ...p, schedules: p.schedules.filter((s) => s.id !== scheduleId) };
    });
    saveState();
    render();
  }

  /* --- View helpers --- */
  function pageTitle(tab) {
    if (tab === 'dashboard') return '대시보드';
    if (tab === 'schedule') return '연간 일정 관리';
    if (tab === 'projects') return '사업별 현황';
    if (tab === 'checklist') return '사업별 체크리스트';
    if (tab === 'members') return '위원 명단';
    return '대시보드';
  }

  function upcomingMeeting() {
    return state.schedulesData.find((s) => s.isMeeting && s.status !== 'completed') || null;
  }

  function upcomingPrimarySchedule() {
    const all = [];
    for (const project of state.projectsData) {
      if (project.theme === 'secondary') continue;
      for (const s of project.schedules || []) {
        if (s.completed) continue;
        all.push({
          ...s,
          projectId: project.id,
          projectTitle: project.title,
          projectIcon: project.icon,
          projectDesc: project.description,
          projectTheme: project.theme,
        });
      }
    }
    all.sort((a, b) => parseYmdFromDotDate(a.date) - parseYmdFromDotDate(b.date));
    return all[0] || null;
  }

  function getUpcomingSchedulesTop2() {
    const all = [];
    for (const project of state.projectsData) {
      for (const s of project.schedules || []) {
        if (s.completed) continue;
        all.push({
          ...s,
          projectId: project.id,
          projectTitle: project.title,
          projectIcon: project.icon,
          projectTheme: project.theme,
        });
      }
    }
    all.sort((a, b) => parseYmdFromDotDate(a.date) - parseYmdFromDotDate(b.date));
    return all.slice(0, 2);
  }

  function memberNameById(id) {
    return state.membersData.find((m) => m.id === id)?.name || '';
  }

  function renderMemberNames(ids) {
    if (!ids || ids.length === 0) return '없음';
    return ids.map(memberNameById).filter(Boolean).join(', ');
  }

  function typePill(type, projectTheme) {
    const t = String(type || '');
    if (t.includes('사전')) return `<span class="pill pill--slate">${escapeHtml(type)}</span>`;
    if (projectTheme === 'secondary') return `<span class="pill pill--amber">${escapeHtml(type)}</span>`;
    if (t.includes('본봉사') || t.includes('병행') || t.includes('본행사')) return `<span class="pill pill--blue">${escapeHtml(type)}</span>`;
    return `<span class="pill pill--indigo">${escapeHtml(type)}</span>`;
  }

  /* --- Render: Login --- */
  function isMobileLayout() {
    try {
      return window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    } catch {
      return false;
    }
  }

  function viewLogin() {
    const selectedId = state.modal?.type === 'login_select' ? state.modal.selectedMemberId : null;
    const password = state.modal?.type === 'login_select' ? state.modal.password : '';
    const error = state.modal?.type === 'login_select' ? state.modal.error : '';
    const stage = state.modal?.type === 'login_select' ? state.modal.stage : 'select'; // 'select' | 'password'

    const cards = state.membersData
      .map((m) => {
        const isSelected = selectedId === m.id;
        const isAdmin = isMemberAdmin(m.role);
        const avatarCls = isAdmin ? 'avatar avatar--admin' : 'avatar avatar--user';
        const avatarBg = isAdmin ? '' : 'style="background: #e2e8f0; color:#475569"';
        return `
          <button class="memberbtn ${isSelected ? 'is-selected' : ''}" data-action="login_pick" data-id="${m.id}">
            <div class="memberbtn__inner">
              <div class="${avatarCls}" ${!isAdmin ? avatarBg : ''}>${escapeHtml(m.name.charAt(0))}</div>
              <div>
                <div class="memberbtn__name">${escapeHtml(m.name)}</div>
                <div class="memberbtn__role">${escapeHtml(m.role)}</div>
              </div>
            </div>
          </button>
        `;
      })
      .join('');

    const selectedMember = state.membersData.find((m) => m.id === selectedId) || null;
    const requiresPassword = !!selectedMember && isMemberAdmin(selectedMember.role);
    const mobile = isMobileLayout();

    if (mobile && requiresPassword && stage === 'password') {
      return `
        <div class="login">
          <div class="login__box login__box--centered">
            <div class="login__hero">
              <h1>사회공헌위원회 시스템</h1>
              <p>관리자 비밀번호를 입력해주세요</p>
            </div>
            <div class="login__inner">
              <div class="login-password">
                <button class="btn btn--ghost login-password__back" data-action="login_back">
                  ${icon(ICONS.chevronRight)} 위원 다시 선택
                </button>
                <div class="login-password__picked">
                  <div class="${isMemberAdmin(selectedMember.role) ? 'avatar avatar--admin' : 'avatar avatar--user'}" style="flex:0 0 auto">
                    ${escapeHtml(selectedMember.name.charAt(0))}
                  </div>
                  <div style="min-width:0">
                    <div class="login-password__name">${escapeHtml(selectedMember.name)}</div>
                    <div class="login-password__role">${escapeHtml(selectedMember.role)}</div>
                  </div>
                </div>

                <div class="adminhint">
                  <label class="label" style="display:flex;align-items:center;gap:8px">
                    ${icon(ICONS.lock)}
                    관리자 비밀번호
                  </label>
                  <input
                    class="input"
                    type="password"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    enterkeyhint="done"
                    autocomplete="current-password"
                    placeholder="비밀번호를 입력하세요"
                    value="${escapeHtml(password)}"
                    data-field="login_password"
                  />
                  ${error ? `<div class="error" style="margin-top:10px">${escapeHtml(error)}</div>` : ''}
                </div>

                <button class="btn btn--primary" style="width:100%" data-action="login_submit">
                  접속하기
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="login">
        <div class="login__box login__box--centered">
          <div class="login__hero">
            <h1>사회공헌위원회 시스템</h1>
            <p>2026년 통합 관리 대시보드 로그인</p>
          </div>
          <div class="login__inner">
            <h2 class="login__title">접속할 위원을 선택해주세요</h2>
            <div class="membergrid membergrid--login">
              ${cards}
            </div>

            <div class="login__form space-y">
              ${requiresPassword ? `
                <div class="adminhint">
                  <label class="label" style="display:flex;align-items:center;gap:8px">
                    ${icon(ICONS.lock)}
                    관리자 비밀번호
                  </label>
                  <input
                    class="input"
                    type="password"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    enterkeyhint="done"
                    autocomplete="current-password"
                    placeholder="비밀번호를 입력하세요"
                    value="${escapeHtml(password)}"
                    data-field="login_password"
                  />
                  <div class="help">* 위원장, 부위원장, 총무위원은 접근 권한 확인이 필요합니다.</div>
                </div>
              ` : ''}

              ${error ? `<div class="error" style="text-align:center">${escapeHtml(error)}</div>` : ''}

              <button class="btn btn--primary" style="width:100%" data-action="login_submit" ${selectedId ? '' : 'disabled'}>
                접속하기
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* --- Render: App shell --- */
  function viewShell(innerHtml) {
    const user = state.currentUser;
    const isAdmin = user ? isMemberAdmin(user.role) : false;
    const avatarClass = isAdmin ? 'avatar avatar--admin' : 'avatar avatar--user';

    const navItem = (tab, label, iconName) => `
      <button class="navbtn ${state.activeTab === tab ? 'is-active' : ''}" data-action="tab" data-tab="${tab}">
        ${icon(iconName)}
        <span>${escapeHtml(label)}</span>
      </button>
    `;

    const mnavItem = (tab, label, iconName) => `
      <button class="mnavbtn ${state.activeTab === tab ? 'is-active' : ''}" data-action="tab" data-tab="${tab}">
        ${icon(iconName)}
        <span>${escapeHtml(label)}</span>
      </button>
    `;

    return `
      <div class="layout">
        <aside class="sidebar">
          <div class="sidebar__brand">
            <div class="brand__title">
              서울특별시건축사회<br/>
              <span class="brand__accent">사회공헌위원회</span>
            </div>
            <div class="brand__sub">2026 통합 관리 시스템</div>
          </div>
          <nav class="sidebar__nav">
            ${navItem('dashboard','대시보드', ICONS.dashboard)}
            ${navItem('schedule','연간 일정 관리', ICONS.schedule)}
            ${navItem('projects','사업별 현황', ICONS.projects)}
            ${navItem('checklist','체크리스트', ICONS.checklist)}
            ${navItem('members','위원 명단', ICONS.members)}
          </nav>
          <div class="sidebar__footer">
            <button class="navbtn" data-action="message" data-title="설정" data-content="설정 페이지는 준비 중입니다.">
              ${icon(ICONS.settings)}
              <span>설정</span>
            </button>
          </div>
        </aside>

        <main class="main">
          <header class="topbar">
            <div class="topbar__title">${escapeHtml(pageTitle(state.activeTab))}</div>
            <div class="topbar__right">
              <button class="btn btn--icon btn--ghost" title="알림" data-action="message" data-title="알림" data-content="새로운 알림이 없습니다.">
                ${icon(ICONS.bell)}
              </button>
              <div class="userchip">
                <div class="userchip__text">
                  <div class="userchip__name">${escapeHtml(user?.name || '')}</div>
                  <div class="userchip__role">${escapeHtml(user?.role || '')}</div>
                </div>
                <div class="${avatarClass}">${escapeHtml((user?.name || '?').charAt(0))}</div>
                <button class="btn btn--icon btn--ghost" title="로그아웃" data-action="logout">
                  ${icon(ICONS.logout)}
                </button>
              </div>
            </div>
          </header>

          <div class="content">
            ${innerHtml}
          </div>
        </main>

        <nav class="mobile-nav">
          ${mnavItem('dashboard','홈', ICONS.dashboard)}
          ${mnavItem('schedule','일정', ICONS.schedule)}
          ${mnavItem('projects','사업', ICONS.projects)}
          ${mnavItem('checklist','체크리스트', ICONS.checklist)}
          ${mnavItem('members','명단', ICONS.members)}
        </nav>
      </div>
    `;
  }

  /* --- Views: Dashboard --- */
  function viewDashboard() {
    const user = state.currentUser;
    const isAdmin = isMemberAdmin(user.role);
    const meeting = upcomingMeeting();
    const activeProjectsCount = state.projectsData.filter((p) => calculateProgress(p.tasks, p.schedules) < 100).length;
    const focus = upcomingPrimarySchedule();

    const myUpcomingParticipationCount = (() => {
      const uid = user.id;
      let cnt = 0;
      for (const p of state.projectsData) {
        for (const s of p.schedules || []) {
          if (s.completed) continue;
          if ((s.memberIds || []).includes(uid)) cnt += 1;
        }
      }
      return cnt;
    })();

    const openChecklistCount = (() => {
      let cnt = 0;
      for (const p of state.projectsData) {
        for (const t of p.tasks || []) {
          if (!t.completed) cnt += 1;
        }
      }
      return cnt;
    })();

    const nextTwoSchedules = (() => {
      const all = [];
      for (const p of state.projectsData) {
        for (const s of p.schedules || []) {
          if (s.completed) continue;
          all.push({
            projectTitle: p.title,
            projectTheme: p.theme,
            district: s.district,
            type: s.type,
            date: s.date,
          });
        }
      }
      all.sort((a, b) => parseYmdFromDotDate(a.date) - parseYmdFromDotDate(b.date));
      return all.slice(0, 2);
    })();

    const meetingBlock = meeting
      ? `
        <div class="notice">
          <div class="notice__icon">${icon(ICONS.bell)}</div>
          <div style="flex:1;min-width:0">
            <p class="notice__title">다가오는 회의 안내</p>
            <p class="notice__text">
              <span style="font-weight:950">${escapeHtml(meeting.title)}</span>가
              <span style="font-weight:950;text-decoration:underline;text-decoration-color:#bfdbfe">${escapeHtml(formatMeetingDate(meeting.exactDate))}</span>
              에 예정되어 있습니다.<br/>
              (안건: ${escapeHtml(meeting.agenda || '')})
            </p>
          </div>
          ${isAdmin ? `
            <button class="btn btn--icon btn--ghost" title="회의 일정 수정" data-action="meeting_edit">
              ${icon(ICONS.edit3)}
            </button>
          ` : ''}
        </div>
      `
      : `
        <div class="card card__pad" style="display:flex;gap:12px;align-items:flex-start;background:#f8fafc">
          <div class="notice__icon" style="background:#e2e8f0;color:#94a3b8">${icon(ICONS.bell)}</div>
          <div>
            <p class="notice__title" style="color:#64748b">다가오는 회의 안내</p>
            <p class="notice__text" style="color:#94a3b8">현재 예정된 회의 일정이 없습니다.</p>
          </div>
        </div>
      `;

    const statCard = (title, value, subtitle) => `
      <div class="card stat">
        <div class="stat__label">${escapeHtml(title)}</div>
        <div class="stat__value">${escapeHtml(value)}</div>
        <div class="stat__sub">${escapeHtml(subtitle)}</div>
      </div>
    `;

    const nextScheduleBlock = `
      <div class="card card__pad">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
          <h2 class="card__title">다가오는 사업 일정</h2>
          <button class="btn btn--ghost" data-action="tab" data-tab="projects">${icon(ICONS.chevronRight)} 사업별 현황</button>
        </div>
        ${
          nextTwoSchedules.length
            ? `<div class="space-y">
                ${nextTwoSchedules
                  .map((s) => {
                    const themeCls = s.projectTheme === 'secondary' ? 'pill--amber' : 'pill--blue';
                    return `
                      <div class="card" style="background:#f8fafc;border-color:#f1f5f9;padding:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
                        <div style="min-width:0">
                          <div class="kicker"><span class="pill ${themeCls}">${escapeHtml(s.projectTitle)}</span></div>
                          <div style="font-weight:950;margin-top:6px">${escapeHtml(s.district)} · ${escapeHtml(s.type)}</div>
                          <div class="help" style="margin-top:6px">${escapeHtml(s.date)}</div>
                        </div>
                      </div>
                    `;
                  })
                  .join('')}
              </div>`
            : `<div class="card" style="background:#f8fafc;border-color:#f1f5f9;padding:18px;text-align:center;color:#64748b">예정된 세부 일정이 없습니다.</div>`
        }
      </div>
    `;

    const focusBlock = focus
      ? (() => {
          const c = themeColors('primary');
          return `
            <div class="card card__pad">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
                <h2 class="card__title">현재 집중 업무</h2>
                ${isAdmin ? `
                  <button class="btn btn--ghost" data-action="message"
                    data-title="업무 연동 안내"
                    data-content="사업별 현황에서 주요 사업의 세부 일정을 관리하면, 가장 가까운 일정이 이곳에 자동으로 반영됩니다.">
                    ${icon(ICONS.edit)} 연동 안내
                  </button>
                ` : ''}
              </div>
              <div class="card" style="background:#f8fafc;border-color:#f1f5f9;padding:14px;display:flex;align-items:center;gap:14px">
                <div style="width:40px;height:40px;border-radius:999px;background:${c.chipBg};color:${c.chipText};display:flex;align-items:center;justify-content:center;flex:0 0 auto">
                  ${icon(focus.projectIcon || ICONS.briefcase)}
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(focus.projectTitle)} - ${escapeHtml(focus.type)}</div>
                  <div class="kicker" style="margin-top:6px;color:#2563eb">일정: ${escapeHtml(focus.date)} | 장소: ${escapeHtml(focus.district)}</div>
                  <div class="help" style="margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(focus.projectDesc || '')}</div>
                </div>
                <button class="btn btn--primary nowrap" data-action="tab" data-tab="projects">상세보기</button>
              </div>
            </div>
          `;
        })()
      : `
        <div class="card card__pad">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
            <h2 class="card__title">현재 집중 업무</h2>
          </div>
          <div class="card" style="background:#f8fafc;border-color:#f1f5f9;padding:18px;text-align:center;color:#64748b">
            현재 예정된 주요 사업 일정이 없습니다.
          </div>
        </div>
      `;

    return `
      <div class="space-y">
        ${meetingBlock}
        <div class="grid grid--3">
          ${statCard('진행중인 사업', `${activeProjectsCount} 건`, '세부일정 및 체크리스트 기준')}
          ${statCard('나의 참여 예정', `${myUpcomingParticipationCount} 건`, '사업별 세부일정 기준')}
          ${statCard('미완료 체크리스트', `${openChecklistCount} 항목`, '사업별 체크리스트 기준')}
        </div>
        ${focusBlock}
        ${nextScheduleBlock}
      </div>
    `;
  }

  /* --- Views: Annual Schedule --- */
  function viewAnnualSchedule() {
    const isAdmin = isMemberAdmin(state.currentUser.role);
    const items = state.schedulesData
      .map((item) => {
        const dotStyle =
          item.status === 'completed'
            ? 'background:#2563eb;border-color:#2563eb'
            : item.status === 'current'
              ? 'background:white;border-color:#2563eb;box-shadow:0 0 0 6px rgba(37,99,235,.10)'
              : 'background:white;border-color:#cbd5e1';

        const titleCls = item.status === 'completed' ? 'style="opacity:.6;text-decoration:line-through"' : '';
        const titleWeight = item.isMeeting ? 600 : 950;
        const badge = item.isMeeting
          ? `<span class="pill pill--indigo badge-meeting">${icon(ICONS.users)} 회의</span>`
          : '';

        const meetingDetail = item.isMeeting
          ? `
            <div class="card" style="background:${item.status === 'completed' ? '#f8fafc' : '#eef2ff'};border-color:${item.status === 'completed' ? '#e2e8f0' : '#e0e7ff'};padding:12px;margin-top:10px;${item.status === 'completed' ? 'opacity:.75;' : ''}">
              <div style="font-size:12px;color:${item.status === 'completed' ? '#64748b' : '#3730a3'}"><b>일시:</b> ${escapeHtml(formatMeetingDate(item.exactDate))}</div>
              <div style="font-size:12px;color:${item.status === 'completed' ? '#64748b' : '#3730a3'};margin-top:6px"><b>안건:</b> ${escapeHtml(item.agenda || '')}</div>
            </div>
          `
          : item.desc
            ? `<div class="help" style="color:#dc2626;margin-top:8px"><b>주의</b> ${escapeHtml(item.desc)}</div>`
            : '';

        const adminBtns = isAdmin
          ? `
            <div style="display:flex;gap:6px;justify-content:flex-end;align-items:center">
              <button class="btn btn--icon btn--sm btn--ghost" title="수정" data-action="annual_edit" data-id="${item.id}">
                ${icon(item.isMeeting ? ICONS.edit3 : ICONS.edit)}
              </button>
              <button class="btn btn--icon btn--sm btn--danger" title="삭제" data-action="annual_delete" data-id="${item.id}">
                ${icon(ICONS.trash)}
              </button>
            </div>
          `
          : '';

        return `
          <div class="annual-item" style="display:flex;gap:12px;align-items:flex-start">
            <div style="position:relative;flex:0 0 auto;width:22px;display:flex;justify-content:center">
              <div style="width:14px;height:14px;border-radius:999px;border:2px solid #cbd5e1;${dotStyle};margin-top:3px"></div>
            </div>
            <div class="annual-item__body" style="flex:1;min-width:0">
              <div class="annual-item__row" style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between">
                <div class="annual-item__main" style="display:flex;gap:14px;flex:1;min-width:0">
                  <div class="annual-item__month" style="width:92px;flex:0 0 auto;font-weight:950;color:#334155;font-size:1.2em;line-height:1.2">${escapeHtml(item.month)}</div>
                  <div class="annual-item__content" style="flex:1;min-width:0">
                    <div class="annual-item__title" ${titleCls} style="font-weight:${titleWeight};display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                      <span>${escapeHtml(item.title)}</span>
                      ${badge}
                    </div>
                    ${meetingDetail}
                  </div>
                </div>
                ${adminBtns}
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div class="card card__pad">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px">
          <h2 class="card__title">2026년 연간 주요 일정</h2>
          ${isAdmin ? `
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn--soft-indigo" data-action="annual_add_meeting">${icon(ICONS.users)} 회의 일정 추가</button>
              <button class="btn btn--soft-blue" data-action="annual_add">${icon(ICONS.plus)} 일정 추가</button>
            </div>
          ` : ''}
        </div>

        <div class="space-y" style="border-left:2px solid #f1f5f9;padding-left:10px;margin-left:6px">
          ${items || '<div class="muted">등록된 연간 일정이 없습니다.</div>'}
        </div>
      </div>
    `;
  }

  /* --- Views: Checklist --- */
  function viewChecklist() {
    const isAdmin = isMemberAdmin(state.currentUser.role);
    const primaryProjects = state.projectsData.filter((p) => p.theme !== 'secondary');
    const secondaryProjects = state.projectsData.filter((p) => p.theme === 'secondary');

    const sortProjectsByCompletion = (projects) => {
      return [...projects].sort((a, b) => {
        const doneA = a.tasks.length > 0 && a.tasks.every((t) => t.completed);
        const doneB = b.tasks.length > 0 && b.tasks.every((t) => t.completed);
        if (doneA === doneB) return 0;
        return doneA ? 1 : -1; // 완료는 아래로
      });
    };

    const renderProjectCard = (project) => {
        const done = project.tasks.filter((t) => t.completed).length;
        const total = project.tasks.length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        const isAllDone = total > 0 && done === total;
        const isPrimary = project.theme !== 'secondary';
        const colors = themeColors(project.theme);
        const progressBarClass = pct === 100 ? 'progress__bar is-green' : `progress__bar ${isPrimary ? '' : 'is-amber'}`;

        const tasks = project.tasks
          .map((t) => {
            const isEditing = state.modal?.type === 'task_edit' && state.modal.taskId === t.id;
            if (isEditing) {
              return `
                <li class="check-item is-editing">
                  <div class="row" style="align-items:center">
                    <input class="input" data-field="task_edit_text" value="${escapeHtml(state.modal.text)}" />
                    <button class="btn btn--icon btn--sm btn--ghost" title="저장" data-action="task_edit_save" data-project="${project.id}">${icon(ICONS.save)}</button>
                    <button class="btn btn--icon btn--sm btn--ghost" title="취소" data-action="task_edit_cancel">${icon(ICONS.x)}</button>
                  </div>
                </li>
              `;
            }

            return `
              <li class="check-item ${t.completed ? 'is-done' : ''}">
                <label class="check-item__left">
                  <input type="checkbox" ${t.completed ? 'checked' : ''} data-action="task_toggle" data-project="${project.id}" data-task="${t.id}" style="margin-top:3px" />
                  <span class="check-item__text">
                    ${escapeHtml(t.text)}
                  </span>
                </label>
                ${isAdmin ? `
                  <div class="check-item__actions">
                    <button class="btn btn--icon btn--sm btn--ghost" title="수정" data-action="task_edit" data-project="${project.id}" data-task="${t.id}">${icon(ICONS.edit)}</button>
                    <button class="btn btn--icon btn--sm btn--danger" title="삭제" data-action="task_delete" data-project="${project.id}" data-task="${t.id}">${icon(ICONS.trash)}</button>
                  </div>
                ` : ''}
              </li>
            `;
          })
          .join('');

        const addRow = isAdmin
          ? `
            <div class="check-add">
              <div class="row row-8-2" style="align-items:center">
                <input class="input" placeholder="새로운 체크리스트 항목 입력..." data-field="task_new_text" data-project="${project.id}" value="${escapeHtml((state.modal?.type === 'task_new' && state.modal.projectId === project.id) ? state.modal.text : '')}" />
                <button class="btn btn--secondary nowrap" data-action="task_add" data-project="${project.id}">${icon(ICONS.plus)} 추가</button>
              </div>
            </div>
          `
          : '';

        return `
          <section class="check-card ${isAllDone ? 'is-complete' : ''}">
            <header class="check-card__head" style="background:${colors.softBg}">
              <div class="check-card__title">
                <span class="check-card__icon" style="color:${colors.chipText}">${icon(project.icon || ICONS.briefcase)}</span>
                <span class="check-card__name">${escapeHtml(project.title)}</span>
              </div>
              <div class="check-card__meta">
                <span class="check-card__count">${done} / ${total} 완료</span>
                <span class="check-card__pct">${pct}%</span>
              </div>
            </header>

            <div class="check-card__body">
              <div class="progress check-card__progress">
                <div class="${progressBarClass}" style="width:${pct}%"></div>
              </div>
              <ul class="check-list">
                ${tasks}
              </ul>
            </div>
            ${addRow}
          </section>
        `;
    };

    const renderSection = (title, desc, projects) => {
      if (!projects.length) return '';
      return `
        <div class="check-section">
          <div class="check-section__head">
            <div>
              <div class="check-section__title">${escapeHtml(title)}</div>
              <div class="check-section__desc">${escapeHtml(desc)}</div>
            </div>
          </div>
          <div class="check-grid">
            ${sortProjectsByCompletion(projects).map(renderProjectCard).join('')}
          </div>
        </div>
      `;
    };

    return `
      <div class="checklist-page">
        <div class="checklist-page__head">
          <div>
            <h2 class="card__title">사업별 체크리스트</h2>
            <div class="help" style="margin-top:6px">체크(완료)와 세부 일정 진행도를 한눈에 관리합니다.</div>
          </div>
        </div>

        ${renderSection('주요 사업', '연간 주요 사회공헌 사업 체크리스트', primaryProjects)}
        ${renderSection('부속 사업', '연계/부속 사업 체크리스트', secondaryProjects)}
      </div>
    `;
  }

  /* --- Views: Projects (세부 일정 = 카드 아래 펼침) --- */
  function viewProjectInlineDetail(project) {
    const isAdmin = isMemberAdmin(state.currentUser.role);
    const colors = themeColors(project.theme);
    const progress = calculateProgress(project.tasks, project.schedules);

    const rows = (project.schedules || [])
      .map((s) => {
        const participating = (s.memberIds || []).includes(state.currentUser.id);
        const isPrimary = project.theme !== 'secondary';
        const btnColors = themeColors(project.theme);
        const disabled = s.completed ? 'disabled' : '';
        return `
            <tr class="${s.completed ? 'row-muted' : ''}">
              <td style="text-align:center">
                ${
                  isAdmin
                    ? `
                      <button class="btn" data-action="proj_schedule_toggle_done" data-project="${project.id}" data-schedule="${s.id}"
                        style="padding:6px 10px;border-radius:10px;border:1px solid ${s.completed ? '#bbf7d0' : '#e2e8f0'};background:${s.completed ? '#dcfce7' : '#f1f5f9'};color:${s.completed ? '#166534' : '#475569'};font-size:12px">
                        ${s.completed ? '완료됨' : '예정/진행'}
                      </button>
                    `
                    : `<span class="pill ${s.completed ? 'pill--green' : 'pill--slate'}">${s.completed ? '완료됨' : '예정'}</span>`
                }
              </td>
              <td style="font-weight:950;${s.completed ? 'text-decoration:line-through;color:#64748b' : ''}">${escapeHtml(s.district)}</td>
              <td>${typePill(s.type, project.theme)}</td>
              <td class="muted">${formatScheduleDateCell(s.date)}</td>
              <td class="muted" style="line-height:1.55">
                ${escapeHtml(renderMemberNames(s.memberIds))}
                ${
                  (s.memberIds || []).length
                    ? `<span class="kicker" style="margin-left:6px;color:${isPrimary ? '#2563eb' : '#b45309'}">(${(s.memberIds || []).length}명)</span>`
                    : ''
                }
              </td>
              <td class="muted2" style="font-size:12px">${escapeHtml(s.contact || '')}</td>
              <td style="text-align:center">
                <button
                  class="participation-btn ${project.theme === 'secondary' ? 'theme-secondary' : 'theme-primary'} ${participating ? 'is-active' : ''} ${s.completed ? 'is-disabled' : ''}"
                  data-action="participate_toggle"
                  data-project="${project.id}"
                  data-schedule="${s.id}"
                  ${disabled}
                >
                  ${participating ? `${icon(ICONS.checkCircle)} 참여 중` : `${icon(ICONS.circle)} 참여하기`}
                </button>
              </td>
              ${
                isAdmin
                  ? `
                    <td style="text-align:center">
                      <div style="display:flex;justify-content:center;gap:6px">
                        <button class="btn btn--icon btn--sm btn--ghost" title="수정" data-action="proj_schedule_edit" data-project="${project.id}" data-schedule="${s.id}">${icon(ICONS.edit)}</button>
                        <button class="btn btn--icon btn--sm btn--danger" title="삭제" data-action="proj_schedule_delete" data-project="${project.id}" data-schedule="${s.id}">${icon(ICONS.trash)}</button>
                      </div>
                    </td>
                  `
                  : ''
              }
            </tr>
          `;
      })
      .join('');

    return `
      <div class="expand-panel__inner">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:12px;min-width:0">
            <div style="width:40px;height:40px;border-radius:12px;background:${colors.chipBg};color:${colors.chipText};display:flex;align-items:center;justify-content:center;flex:0 0 auto">
              ${icon(project.icon || ICONS.briefcase)}
            </div>
            <div style="min-width:0">
              <div style="font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(project.title)}</div>
              <div class="help" style="margin:4px 0 0">체크리스트와 일정을 포함한 통합 진척도: <b style="color:${colors.accent}">${progress}%</b></div>
            </div>
          </div>
          <button class="btn btn--soft-slate btn--sm" data-action="project_detail_toggle" data-id="${project.id}">
            ${icon(ICONS.x)} 닫기
          </button>
        </div>

        <div class="divider"></div>

        <div class="space-y">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <div class="kicker">세부 일정 및 인원 배정 현황</div>
            ${isAdmin ? `<button class="btn btn--soft-blue btn--sm" data-action="proj_schedule_add" data-project="${project.id}">${icon(ICONS.plus)} 일정 추가</button>` : ''}
          </div>

          ${
            (project.schedules || []).length
              ? `
                <div class="tablewrap">
                  <table class="proj-detail-table proj-detail-table--wrap">
                    <colgroup>
                      <col class="col-status" />
                      <col class="col-district" />
                      <col class="col-type" />
                      <col class="col-date" />
                      <col class="col-members" />
                      <col class="col-contact" />
                      <col class="col-mine" />
                      ${isAdmin ? '<col class="col-admin" />' : ''}
                    </colgroup>
                    <thead>
                      <tr>
                        <th style="text-align:center" class="nowrap">상태</th>
                        <th class="nowrap">지역구</th>
                        <th class="nowrap">구분</th>
                        <th class="nowrap">일정/시간</th>
                        <th style="min-width:220px">참여 위원</th>
                        <th class="nowrap">담당자/비고</th>
                        <th class="nowrap" style="text-align:center">나의 참여</th>
                        ${isAdmin ? `<th class="nowrap" style="text-align:center">관리</th>` : ''}
                      </tr>
                    </thead>
                    <tbody>
                      ${rows}
                    </tbody>
                  </table>
                </div>
              `
              : `
                <div class="card" style="background:#f8fafc;border-color:#f1f5f9;padding:18px;text-align:center;color:#64748b">
                  등록된 세부 일정이 없습니다. 관리자에게 문의하세요.
                </div>
              `
          }
        </div>
      </div>
    `;
  }

  function viewProjects() {
    const user = state.currentUser;
    const isAdmin = isMemberAdmin(user.role);
    const upcoming = getUpcomingSchedulesTop2();

    const sortedProjects = [...state.projectsData].sort((a, b) => {
      const pa = calculateProgress(a.tasks, a.schedules);
      const pb = calculateProgress(b.tasks, b.schedules);
      if (pa === 100 && pb !== 100) return 1;
      if (pa !== 100 && pb === 100) return -1;
      return 0;
    });

    const upcomingWidget = upcoming.length
      ? `
        <section class="upcoming-divider">
          <div class="kicker" style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            ${icon(ICONS.clock)}
            가장 가까운 예정 일정
          </div>
          <div class="grid grid--2">
            ${upcoming
              .map((s) => {
                const isParticipating = s.memberIds.includes(user.id);
                return `
                  <div class="card card__pad upcoming-card-green" style="position:relative;overflow:hidden">
                    <div class="upcoming-card-green__bar"></div>
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding-left:10px">
                      <div style="min-width:0">
                        <div class="kicker upcoming-card-green__kicker">${escapeHtml(s.projectTitle)}</div>
                        <div style="font-weight:950;margin-top:4px">${escapeHtml(s.district)} - ${escapeHtml(s.type)}</div>
                        <div class="help" style="margin-top:6px"><span class="cal-icon">${icon(ICONS.calendar)}</span> ${escapeHtml(s.date)}</div>
                      </div>
                      <div class="upcoming-card-green__icon">
                        ${icon(s.projectIcon || ICONS.briefcase)}
                      </div>
                    </div>
                    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;gap:10px;padding-left:10px">
                      <div class="help" style="margin:0">참여 <b style="color:#334155">${s.memberIds.length}</b>명</div>
                      <button
                        class="participation-btn theme-green ${isParticipating ? 'is-active' : ''}"
                        data-action="participate_toggle"
                        data-project="${s.projectId}"
                        data-schedule="${s.id}"
                      >
                        ${isParticipating ? `${icon(ICONS.checkCircle)} 참여 중` : `${icon(ICONS.circle)} 참여하기`}
                      </button>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </section>
      `
      : '';

    function renderProjectCard(p) {
      const progress = calculateProgress(p.tasks, p.schedules);
      const isCompleted = progress === 100;
      const isPrimary = p.theme !== 'secondary';
      const colors = themeColors(p.theme, isCompleted);
      const isExpanded = state.projectsExpandedProjectId === p.id;

      const badgeText = isCompleted ? '완료된 사업' : isPrimary ? '주요사업' : '부속사업';
      const badgeBg = isCompleted ? '#64748b' : isPrimary ? '#2563eb' : '#f59e0b';

      const progressBarClass = isCompleted ? 'progress__bar is-slate' : `progress__bar ${isPrimary ? '' : 'is-amber'}`;
      const grayscale = isCompleted ? 'filter:grayscale(1);opacity:.85' : '';

      const detailLabel = isExpanded ? '세부 일정 닫기' : '세부 일정 및 참여 관리';
      const detailIcon = isExpanded ? icon(ICONS.x) : icon(ICONS.chevronRight);
      const panelOpenClass = state.uiExpandAnimateId === p.id ? '' : ' is-open';
      const inlinePanel = isExpanded
        ? `<div class="expand-panel expand-panel--inline${panelOpenClass}" data-project-panel="${p.id}">
             ${viewProjectInlineDetail(p)}
           </div>`
        : '';
      return `
        <div class="project-col">
          <div class="card project-card" data-project-card="${p.id}" style="overflow:hidden;position:relative;${grayscale}">
            <div style="position:absolute;right:0;top:0;background:${badgeBg};color:white;padding:6px 10px;font-size:10px;font-weight:950;border-bottom-left-radius:12px">${badgeText}</div>
            <div class="card__pad" style="padding-top:22px">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
                <div style="display:flex;gap:12px;min-width:0">
                  <div style="width:48px;height:48px;border-radius:14px;background:${colors.chipBg};color:${colors.chipText};display:flex;align-items:center;justify-content:center;flex:0 0 auto">
                    ${icon(p.icon || ICONS.briefcase)}
                  </div>
                  <div style="min-width:0">
                    <div style="font-weight:950;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(p.title)}</div>
                    <div class="help" style="margin-top:6px">통합 진척도: <b style="color:${colors.accent}">${progress}%</b></div>
                  </div>
                </div>
                ${isAdmin ? `
                  <div style="display:flex;gap:6px">
                    <button class="btn btn--icon btn--sm btn--ghost" title="사업 수정" data-action="project_edit" data-id="${p.id}">${icon(ICONS.edit)}</button>
                    <button class="btn btn--icon btn--sm btn--danger" title="사업 삭제" data-action="project_delete" data-id="${p.id}">${icon(ICONS.trash)}</button>
                  </div>
                ` : ''}
              </div>

              <div class="progress" style="margin:14px 0 12px">
                <div class="${progressBarClass}" style="width:${progress}%"></div>
              </div>

              <div class="card" style="background:#f8fafc;border-color:#f1f5f9;padding:12px;color:#475569;font-size:13px;line-height:1.5">
                ${escapeHtml(p.description || '사업 설명이 없습니다.')}
              </div>
            </div>
            <div style="background:#f8fafc;border-top:1px solid #f1f5f9;padding:12px;text-align:center">
              <button class="btn btn--ghost" style="width:100%;font-weight:950;color:${colors.accent}" data-action="project_detail_toggle" data-id="${p.id}">
                ${escapeHtml(detailLabel)} ${detailIcon}
              </button>
            </div>
          </div>
          ${inlinePanel}
        </div>
      `;
    }

    function renderExpandedRow(projectId) {
      const p = state.projectsData.find((x) => x.id === projectId);
      if (!p) return '';
      const panelOpenClass = state.uiExpandAnimateId === p.id ? '' : ' is-open';
      return `
        <div class="project-expand-row">
          <div class="expand-panel expand-panel--row${panelOpenClass}" data-project-panel="${p.id}">
            ${viewProjectInlineDetail(p)}
          </div>
        </div>
      `;
    }

    const projectRows = [];
    for (let i = 0; i < sortedProjects.length; i += 2) {
      const left = sortedProjects[i];
      const right = sortedProjects[i + 1];
      const expandedInThisRow =
        state.projectsExpandedProjectId != null &&
        (state.projectsExpandedProjectId === left.id || state.projectsExpandedProjectId === (right?.id ?? -1))
          ? state.projectsExpandedProjectId
          : null;

      projectRows.push(`
        <div class="project-grid-row">
          ${renderProjectCard(left)}
          ${right ? renderProjectCard(right) : `<div class="project-col" aria-hidden="true"></div>`}
        </div>
        ${expandedInThisRow ? renderExpandedRow(expandedInThisRow) : ''}
      `);
    }

    return `
      <div class="space-y">
        ${upcomingWidget}
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <h2 class="card__title">주요 사업 현황</h2>
          ${isAdmin ? `<button class="btn btn--primary" data-action="project_add">${icon(ICONS.plus)} 신규 사업 등록</button>` : ''}
        </div>
        <div class="projects-rows">
          ${projectRows.join('')}
        </div>
      </div>
    `;
  }

  /* --- Views: Members --- */
  function viewMembers() {
    const isAdmin = isMemberAdmin(state.currentUser.role);

    function getMemberParticipations(memberId, isCompleted) {
      const out = [];
      for (const project of state.projectsData) {
        const targets = (project.schedules || []).filter((s) => (s.memberIds || []).includes(memberId) && !!s.completed === isCompleted);
        if (targets.length) {
          out.push({
            projectTitle: project.title,
            theme: project.theme,
            details: targets.map((s) => `${s.district}(${s.type})`),
          });
        }
      }
      return out;
    }

    const cards = state.membersData
      .map((m) => {
        const isAdminUser = isMemberAdmin(m.role);
        const active = getMemberParticipations(m.id, false);
        const done = getMemberParticipations(m.id, true);

        const colors = themeColors(isAdminUser ? 'secondary' : 'primary');

        const listBlock = (title, list, strike) => `
          <div style="border-top:1px solid #f1f5f9;padding-top:12px;margin-top:12px">
            <div class="kicker">${escapeHtml(title)}</div>
            <div style="margin-top:10px" class="space-y">
              ${
                list.length
                  ? list
                      .map((p) => `
                        <div style="font-size:12px">
                          <div style="font-weight:900;color:${p.theme === 'secondary' ? '#b45309' : '#0f172a'};${strike ? 'text-decoration:line-through;opacity:.75' : ''}">
                            ${escapeHtml(p.projectTitle)}
                          </div>
                          <div style="color:${strike ? '#94a3b8' : '#64748b'};border-left:2px solid #e2e8f0;padding-left:8px;margin-top:4px;line-height:1.45;${strike ? 'text-decoration:line-through' : ''}">
                            ${escapeHtml(p.details.join(', '))}
                          </div>
                        </div>
                      `)
                      .join('')
                  : `<div class="help" style="font-style:italic;margin:0">${strike ? '아직 완료된 활동이 없습니다.' : '현재 예정된 일정이 없습니다.'}</div>`
              }
            </div>
          </div>
        `;

        return `
          <div class="card card__pad" style="position:relative">
            ${isAdmin ? `
              <div style="position:absolute;right:10px;top:10px;display:flex;gap:6px">
                <button class="btn btn--icon btn--sm btn--ghost" title="수정" data-action="member_edit" data-id="${m.id}">${icon(ICONS.edit)}</button>
                <button class="btn btn--icon btn--sm btn--danger" title="삭제" data-action="member_delete" data-id="${m.id}">${icon(ICONS.trash)}</button>
              </div>
            ` : ''}
            <div style="display:flex;gap:12px;align-items:center">
              <div style="width:48px;height:48px;border-radius:999px;background:${colors.chipBg};color:${colors.chipText};display:flex;align-items:center;justify-content:center;font-weight:950;font-size:16px">
                ${escapeHtml(m.name.charAt(0))}
              </div>
              <div>
                <div style="font-weight:950">${escapeHtml(m.name)}</div>
                <div class="help" style="margin:4px 0 0">${escapeHtml(m.role)}</div>
              </div>
            </div>
            ${listBlock('진행 예정인 활동', active, false)}
            ${listBlock('완료된 활동', done, true)}
          </div>
        `;
      })
      .join('');

    return `
      <div class="space-y">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <h2 class="card__title">전체 위원 명단</h2>
          ${isAdmin ? `<button class="btn btn--primary" data-action="member_add">${icon(ICONS.plus)} 위원 추가</button>` : ''}
        </div>
        <div class="grid grid--4">
          ${cards}
        </div>
      </div>
    `;
  }

  /* --- Modal renderers --- */
  function renderModal() {
    const m = state.modal;
    if (!m) return '';

    const closeBtn = `<button class="btn btn--icon btn--ghost" data-action="modal_close" title="닫기">${icon(ICONS.x)}</button>`;

    if (m.type === 'message') {
      return `
        <div class="overlay" data-action="overlay_close">
          <div class="modal modal--sm" role="dialog" aria-modal="true">
            <div class="modal__head">
              <div style="display:flex;align-items:center;gap:10px">
                <div class="notice__icon" style="width:44px;height:44px">${icon(ICONS.bell)}</div>
                <h3 class="modal__title">${escapeHtml(m.title)}</h3>
              </div>
              ${closeBtn}
            </div>
            <div class="modal__body">
              <div class="muted" style="font-size:13px;line-height:1.55">${escapeHtml(m.content)}</div>
            </div>
            <div class="modal__foot">
              <button class="btn btn--primary" data-action="modal_close" style="width:100%">확인</button>
            </div>
          </div>
        </div>
      `;
    }

    if (m.type === 'annual_form') {
      const isMeeting = !!m.isMeeting;
      const title = m.editingId ? (isMeeting ? '회의 일정 수정' : '일반 일정 수정') : (isMeeting ? '새 회의 일정 추가' : '일반 일정 추가');
      return `
        <div class="overlay" data-action="overlay_close">
          <div class="modal modal--sm" role="dialog" aria-modal="true">
            <div class="modal__head">
              <h3 class="modal__title" style="display:flex;align-items:center;gap:10px">
                ${isMeeting ? icon(ICONS.users) : icon(ICONS.calendar)}
                ${escapeHtml(title)}
              </h3>
              ${closeBtn}
            </div>
            <div class="modal__body space-y">
              <div>
                <label class="label">${isMeeting ? '회의명 (차수)' : '일정명'}</label>
                <input class="input" data-field="annual_title" value="${escapeHtml(m.form.title || '')}" placeholder="${isMeeting ? '예: 제3회 사회공헌위원회 회의' : '주요 일정 내용을 입력하세요'}" />
              </div>

              ${
                isMeeting
                  ? `
                    <div>
                      <label class="label">일시</label>
                      <div class="row">
                        <input class="input" type="date" data-field="annual_date" value="${escapeHtml((m.form.exactDate || '').split('T')[0] || '')}" />
                        <select class="select" data-field="annual_time" style="max-width:120px">
                          ${TIME_OPTIONS.map((t) => `<option value="${t}" ${((m.form.exactDate || '').split('T')[1]?.slice(0,5) || '10:00') === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="label">주요 안건</label>
                      <textarea class="textarea" data-field="annual_agenda" placeholder="회의에서 논의할 주요 내용을 입력하세요">${escapeHtml(m.form.agenda || '')}</textarea>
                    </div>
                  `
                  : `
                    <div>
                      <label class="label">시기 (월)</label>
                      <input class="input" data-field="annual_month" value="${escapeHtml(m.form.month || '')}" placeholder="예: 7월, 10월 말" />
                    </div>
                    <div>
                      <label class="label">비고 및 주의사항 (선택)</label>
                      <input class="input" data-field="annual_desc" value="${escapeHtml(m.form.desc || '')}" placeholder="예: ※ 기온 25도 이하 권장" />
                    </div>
                  `
              }

              <div>
                <label class="label">진행 상태</label>
                <select class="select" data-field="annual_status">
                  <option value="upcoming" ${m.form.status === 'upcoming' ? 'selected' : ''}>예정 (Upcoming)</option>
                  <option value="current" ${m.form.status === 'current' ? 'selected' : ''}>진행 중 (Current)</option>
                  <option value="completed" ${m.form.status === 'completed' ? 'selected' : ''}>완료 (Completed)</option>
                </select>
              </div>
              ${m.error ? `<div class="error">${escapeHtml(m.error)}</div>` : ''}
            </div>
            <div class="modal__foot">
              <button class="btn btn--soft-slate" data-action="modal_close">취소</button>
              <button class="btn ${isMeeting ? 'btn--soft-indigo' : 'btn--primary'}" data-action="annual_save">저장하기</button>
            </div>
          </div>
        </div>
      `;
    }

    if (m.type === 'project_form') {
      const title = m.editingId ? '사업 내용 수정' : '신규 사업 등록';
      return `
        <div class="overlay" data-action="overlay_close">
          <div class="modal modal--sm" role="dialog" aria-modal="true">
            <div class="modal__head">
              <h3 class="modal__title">${escapeHtml(title)}</h3>
              ${closeBtn}
            </div>
            <div class="modal__body space-y">
              <div>
                <label class="label">사업명 (필수)</label>
                <input class="input" data-field="project_title" value="${escapeHtml(m.form.title || '')}" placeholder="예: 지역아동센터 벽화 그리기" />
              </div>
              <div>
                <label class="label">사업 분류 (테마)</label>
                <div class="row" style="gap:12px">
                  <label class="card" style="padding:12px;cursor:pointer;border-color:${m.form.theme === 'primary' ? '#93c5fd' : '#e2e8f0'};background:${m.form.theme === 'primary' ? '#eff6ff' : 'white'}">
                    <input type="radio" name="theme" value="primary" data-field="project_theme" ${m.form.theme === 'primary' ? 'checked' : ''} />
                    <span style="margin-left:8px;font-weight:900">주요 사업 (파랑)</span>
                  </label>
                  <label class="card" style="padding:12px;cursor:pointer;border-color:${m.form.theme === 'secondary' ? '#fde68a' : '#e2e8f0'};background:${m.form.theme === 'secondary' ? '#fffbeb' : 'white'}">
                    <input type="radio" name="theme" value="secondary" data-field="project_theme" ${m.form.theme === 'secondary' ? 'checked' : ''} />
                    <span style="margin-left:8px;font-weight:900">부속 사업 (주황)</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="label">사업 설명</label>
                <textarea class="textarea" data-field="project_description" placeholder="사업의 목적 및 주요 내용을 간단히 기재하세요">${escapeHtml(m.form.description || '')}</textarea>
              </div>
              ${m.error ? `<div class="error">${escapeHtml(m.error)}</div>` : ''}
            </div>
            <div class="modal__foot">
              <button class="btn btn--soft-slate" data-action="modal_close">취소</button>
              <button class="btn btn--primary" data-action="project_save">저장하기</button>
            </div>
          </div>
        </div>
      `;
    }

    if (m.type === 'proj_schedule_form') {
      const project = state.projectsData.find((p) => p.id === m.projectId);
      if (!project) return '';
      const title = m.editingId ? '세부 일정 수정' : '세부 일정 추가';
      return `
        <div class="overlay" data-action="overlay_close">
          <div class="modal modal--sm" role="dialog" aria-modal="true">
            <div class="modal__head">
              <h3 class="modal__title">${escapeHtml(title)}</h3>
              ${closeBtn}
            </div>
            <div class="modal__body space-y">
              <div>
                <label class="label">지역구</label>
                <input class="input" data-field="ps_district" value="${escapeHtml(m.form.district || '')}" placeholder="예: 강동구" />
              </div>
              <div>
                <label class="label">구분</label>
                <input class="input" data-field="ps_type" value="${escapeHtml(m.form.type || '')}" placeholder="예: 사전청소, 본봉사" />
              </div>
              <div>
                <label class="label">일정/시간</label>
                <input class="input" data-field="ps_date" value="${escapeHtml(m.form.date || '')}" placeholder="예: 2026.05.15 (예정)" />
              </div>
              <div>
                <label class="label">담당자/비고</label>
                <input class="input" data-field="ps_contact" value="${escapeHtml(m.form.contact || '')}" placeholder="예: 오전/오후반 편성" />
              </div>
              ${m.error ? `<div class="error">${escapeHtml(m.error)}</div>` : ''}
            </div>
            <div class="modal__foot">
              <button class="btn btn--soft-slate" data-action="modal_close">취소</button>
              <button class="btn btn--primary" data-action="proj_schedule_save">저장하기</button>
            </div>
          </div>
        </div>
      `;
    }

    if (m.type === 'member_form') {
      const title = m.editingId ? '위원 정보 수정' : '신규 위원 등록';
      return `
        <div class="overlay" data-action="overlay_close">
          <div class="modal modal--sm" role="dialog" aria-modal="true">
            <div class="modal__head">
              <h3 class="modal__title">${escapeHtml(title)}</h3>
              ${closeBtn}
            </div>
            <div class="modal__body space-y">
              <div>
                <label class="label">이름</label>
                <input class="input" data-field="member_name" value="${escapeHtml(m.form.name || '')}" placeholder="예: 홍길동" />
              </div>
              <div>
                <label class="label">직책</label>
                <input class="input" data-field="member_role" value="${escapeHtml(m.form.role || '')}" placeholder="예: 위원장, 부위원장, 위원 등" />
              </div>
              <div>
                <label class="label">그룹 구분</label>
                <select class="select" data-field="member_group">
                  <option value="임원진" ${m.form.group === '임원진' ? 'selected' : ''}>임원진 (주황색 프로필)</option>
                  <option value="위원" ${m.form.group === '위원' ? 'selected' : ''}>위원 (파란색 프로필)</option>
                </select>
                <div class="help">* 직책이 '위원장', '부위원장', '총무위원'인 경우 자동으로 관리자 권한이 부여됩니다.</div>
              </div>
              ${m.error ? `<div class="error">${escapeHtml(m.error)}</div>` : ''}
            </div>
            <div class="modal__foot">
              <button class="btn btn--soft-slate" data-action="modal_close">취소</button>
              <button class="btn btn--primary" data-action="member_save">저장하기</button>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  /* --- Router render --- */
  function renderApp() {
    if (!state.currentUser) return viewLogin();
    if (state.activeTab === 'dashboard') return viewShell(viewDashboard());
    if (state.activeTab === 'schedule') return viewShell(viewAnnualSchedule());
    if (state.activeTab === 'projects') return viewShell(viewProjects());
    if (state.activeTab === 'checklist') return viewShell(viewChecklist());
    if (state.activeTab === 'members') return viewShell(viewMembers());
    return viewShell(viewDashboard());
  }

  function render() {
    // 회의 일정 상태 자동 동기화(예정/완료)
    normalizeMeetingSchedules();

    const activeEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const activeMeta = activeEl
      ? {
          field: activeEl.getAttribute('data-field'),
          project: activeEl.getAttribute('data-project'),
          task: activeEl.getAttribute('data-task'),
          selStart: typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
          selEnd: typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null,
        }
      : null;

    ROOT.innerHTML = renderApp() + renderModal();
    try {
      window.lucide?.createIcons?.();
    } catch {
      // ignore
    }

    if (activeMeta?.field) {
      let selector = `[data-field="${CSS.escape(activeMeta.field)}"]`;
      if (activeMeta.project) selector += `[data-project="${CSS.escape(activeMeta.project)}"]`;
      if (activeMeta.task) selector += `[data-task="${CSS.escape(activeMeta.task)}"]`;
      const nextEl = ROOT.querySelector(selector);
      if (nextEl instanceof HTMLElement) {
        nextEl.focus({ preventScroll: true });
        if (
          typeof activeMeta.selStart === 'number' &&
          typeof activeMeta.selEnd === 'number' &&
          typeof nextEl.setSelectionRange === 'function'
        ) {
          try {
            nextEl.setSelectionRange(activeMeta.selStart, activeMeta.selEnd);
          } catch {
            // ignore
          }
        }
      }
    }

    // 사업별 현황: 펼침 애니메이션 & 스크롤
    if (state.uiExpandAnimateId != null) {
      const id = state.uiExpandAnimateId;
      state.uiExpandAnimateId = null;
      const panels = ROOT.querySelectorAll(`.expand-panel[data-project-panel="${CSS.escape(String(id))}"]`);
      if (panels.length) {
        requestAnimationFrame(() => {
          panels.forEach((p) => p instanceof HTMLElement && p.classList.add('is-open'));
        });
      }
    }
    if (state.uiScrollToProjectId != null) {
      const id = state.uiScrollToProjectId;
      state.uiScrollToProjectId = null;
      const card = ROOT.querySelector(`.project-card[data-project-card="${CSS.escape(String(id))}"]`);
      if (card instanceof HTMLElement) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /* --- Events --- */
  function closestActionEl(target) {
    if (!(target instanceof Element)) return null;
    return target.closest('[data-action]');
  }

  function upsertLoginModal(partial) {
    const current =
      state.modal?.type === 'login_select'
        ? state.modal
        : { type: 'login_select', selectedMemberId: null, password: '', error: '', stage: 'select' };
    state.modal = { ...current, ...partial, type: 'login_select' };
    render();
  }

  document.addEventListener('input', (e) => {
    // IME(한글) 조합 중에는 렌더를 막아야 글자가 끊기지 않습니다.
    if (e.isComposing) return;
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const field = el.getAttribute('data-field');
    if (!field) return;

    if (field === 'login_password') {
      // 모바일에서 input마다 전체 rerender(ROOT.innerHTML 교체)하면
      // 키보드가 닫혔다가 다시 열리는 현상이 발생할 수 있어, 로그인 비밀번호는 DOM 값을 신뢰하고 상태만 갱신합니다.
      if (state.modal?.type !== 'login_select') {
        state.modal = { type: 'login_select', selectedMemberId: null, password: '', error: '' };
      }
      state.modal.password = el.value;
      state.modal.error = '';
      return;
    }

    const m = state.modal;
    if (!m) {
      // checklist inline new task input is stored in modal to keep it controlled-ish
      if (field === 'task_new_text') {
        const projectId = Number(el.getAttribute('data-project'));
        state.modal = { type: 'task_new', projectId, text: el.value };
        render();
      }
      return;
    }

    const writeForm = (key) => {
      state.modal = { ...m, form: { ...(m.form || {}), [key]: el.value }, error: '' };
      render();
    };

    if (m.type === 'annual_form') {
      if (field === 'annual_month') return writeForm('month');
      if (field === 'annual_title') return writeForm('title');
      if (field === 'annual_desc') return writeForm('desc');
      if (field === 'annual_status') return writeForm('status');
      if (field === 'annual_agenda') return writeForm('agenda');
      if (field === 'annual_date') {
        const time = (m.form.exactDate || '').split('T')[1]?.slice(0, 5) || '10:00';
        state.modal = { ...m, form: { ...(m.form || {}), exactDate: `${el.value}T${time}` }, error: '' };
        render();
        return;
      }
    }

    if (m.type === 'project_form') {
      if (field === 'project_title') return writeForm('title');
      if (field === 'project_description') return writeForm('description');
    }

    if (m.type === 'proj_schedule_form') {
      if (field === 'ps_district') return writeForm('district');
      if (field === 'ps_type') return writeForm('type');
      if (field === 'ps_date') return writeForm('date');
      if (field === 'ps_contact') return writeForm('contact');
    }

    if (m.type === 'member_form') {
      if (field === 'member_name') return writeForm('name');
      if (field === 'member_role') return writeForm('role');
      if (field === 'member_group') return writeForm('group');
    }

    if (m.type === 'task_edit' && field === 'task_edit_text') {
      state.modal = { ...m, text: el.value };
      render();
    }

    if (m.type === 'task_new' && field === 'task_new_text') {
      const projectId = Number(el.getAttribute('data-project'));
      state.modal = { type: 'task_new', projectId, text: el.value };
      render();
    }
  });

  // 일부 브라우저/IME 조합 종료 시 마지막 값 반영 보장
  document.addEventListener('compositionend', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const field = el.getAttribute('data-field');
    if (!field) return;
    // compositionend 직후 input 이벤트가 안 오거나 늦는 경우가 있어 한 번 렌더 유도
    // (현재 값은 DOM에 들어가 있으므로 input 핸들러와 동일 로직을 최소로만 재실행)
    const event = new Event('input', { bubbles: true });
    el.dispatchEvent(event);
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const field = el.getAttribute('data-field');
    if (!field) return;

    const m = state.modal;
    const writeForm = (key, value) => {
      if (!m) return;
      state.modal = { ...m, form: { ...(m.form || {}), [key]: value }, error: '' };
      render();
    };

    if (m?.type === 'annual_form') {
      if (field === 'annual_status') return writeForm('status', el.value);
      if (field === 'annual_time') {
        const date = (m.form.exactDate || '').split('T')[0] || new Date().toISOString().split('T')[0];
        return writeForm('exactDate', `${date}T${el.value}`);
      }
    }

    if (m?.type === 'project_form' && field === 'project_theme') {
      return writeForm('theme', el.value);
    }

    if (m?.type === 'member_form' && field === 'member_group') {
      return writeForm('group', el.value);
    }
  });

  document.addEventListener('click', (e) => {
    const actionEl = closestActionEl(e.target);
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    const idAttr = actionEl.getAttribute('data-id');
    const id = idAttr != null ? Number(idAttr) : null;

    if (action === 'overlay_close') {
      // 모달 내부 클릭은 무시하고, 오버레이(배경) 자체 클릭일 때만 닫기
      if (e.target !== actionEl) return;
      setModal(null);
      return;
    }
    if (action === 'modal_close') {
      setModal(null);
      return;
    }

    if (action === 'message') {
      showMessage(actionEl.getAttribute('data-title') || '', actionEl.getAttribute('data-content') || '');
      return;
    }

    if (action === 'logout') {
      logout();
      return;
    }

    if (action === 'tab') {
      setActiveTab(actionEl.getAttribute('data-tab') || 'dashboard');
      return;
    }

    /* Login actions */
    if (action === 'login_pick') {
      const picked = Number(actionEl.getAttribute('data-id'));
      const member = state.membersData.find((m) => m.id === picked) || null;
      const nextStage = isMobileLayout() && member && isMemberAdmin(member.role) ? 'password' : 'select';
      upsertLoginModal({ selectedMemberId: picked, password: '', error: '', stage: nextStage });
      return;
    }
    if (action === 'login_back') {
      upsertLoginModal({ selectedMemberId: null, password: '', error: '', stage: 'select' });
      return;
    }
    if (action === 'login_submit') {
      const modal = state.modal?.type === 'login_select' ? state.modal : null;
      const pickedId = modal?.selectedMemberId;
      if (!pickedId) {
        upsertLoginModal({ error: '이름을 선택해주세요.' });
        return;
      }
      const member = state.membersData.find((m) => m.id === pickedId);
      if (!member) {
        upsertLoginModal({ error: '선택한 위원을 찾을 수 없습니다.' });
        return;
      }
      if (isMemberAdmin(member.role)) {
        if ((modal?.password || '') === '2026') {
          state.modal = null;
          login(member);
        } else {
          upsertLoginModal({ error: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        state.modal = null;
        login(member);
      }
      return;
    }

    /* Dashboard meeting edit */
    if (action === 'meeting_edit') {
      const meeting = upcomingMeeting();
      if (!meeting) return;
      setModal({
        type: 'annual_form',
        isMeeting: true,
        editingId: meeting.id,
        form: { title: meeting.title, exactDate: meeting.exactDate || '', agenda: meeting.agenda || '', status: meeting.status || 'upcoming' },
        error: '',
      });
      return;
    }

    /* Annual schedule CRUD */
    if (action === 'annual_add') {
      setModal({ type: 'annual_form', isMeeting: false, editingId: null, form: { month: '', title: '', desc: '', status: 'upcoming' }, error: '' });
      return;
    }
    if (action === 'annual_add_meeting') {
      setModal({ type: 'annual_form', isMeeting: true, editingId: null, form: { title: '', exactDate: '', agenda: '', status: 'upcoming' }, error: '' });
      return;
    }
    if (action === 'annual_edit') {
      if (!id) return;
      const item = state.schedulesData.find((s) => s.id === id);
      if (!item) return;
      if (item.isMeeting) {
        setModal({
          type: 'annual_form',
          isMeeting: true,
          editingId: item.id,
          form: { title: item.title, exactDate: item.exactDate || '', agenda: item.agenda || '', status: item.status || 'upcoming' },
          error: '',
        });
      } else {
        setModal({
          type: 'annual_form',
          isMeeting: false,
          editingId: item.id,
          form: { month: item.month || '', title: item.title || '', desc: item.desc || '', status: item.status || 'upcoming' },
          error: '',
        });
      }
      return;
    }
    if (action === 'annual_delete') {
      if (!id) return;
      if (window.confirm('이 일정을 삭제하시겠습니까?')) deleteAnnualSchedule(id);
      return;
    }
    if (action === 'annual_save') {
      const m = state.modal;
      if (!m || m.type !== 'annual_form') return;

      if (m.isMeeting) {
        const title = String(m.form.title || '').trim();
        const exactDate = String(m.form.exactDate || '').trim();
        if (!title || !exactDate) {
          setModal({ ...m, error: '회의명과 일시는 필수 입력 항목입니다.' });
          return;
        }
        const d = new Date(exactDate);
        const monthStr = Number.isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}월`;
        const payload = {
          ...m.form,
          title,
          exactDate,
          month: monthStr,
          isMeeting: true,
          status: getMeetingAutoStatus(exactDate),
        };
        if (m.editingId) updateAnnualSchedule(m.editingId, payload);
        else addAnnualSchedule(payload);
        setModal(null);
        return;
      }

      const month = String(m.form.month || '').trim();
      const title = String(m.form.title || '').trim();
      if (!month || !title) {
        setModal({ ...m, error: '시기와 일정명은 필수 입력 항목입니다.' });
        return;
      }
      const payload = { ...m.form, month, title, isMeeting: false };
      if (m.editingId) updateAnnualSchedule(m.editingId, payload);
      else addAnnualSchedule(payload);
      setModal(null);
      return;
    }

    /* Participation toggle */
    if (action === 'participate_toggle') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const scheduleId = Number(actionEl.getAttribute('data-schedule'));
      toggleParticipation(projectId, scheduleId, state.currentUser.id);
      return;
    }

    /* Checklist actions */
    if (action === 'task_toggle') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const taskId = Number(actionEl.getAttribute('data-task'));
      toggleTask(projectId, taskId);
      return;
    }
    if (action === 'task_edit') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const taskId = Number(actionEl.getAttribute('data-task'));
      const project = state.projectsData.find((p) => p.id === projectId);
      const task = project?.tasks.find((t) => t.id === taskId);
      if (!task) return;
      setModal({ type: 'task_edit', projectId, taskId, text: task.text });
      return;
    }
    if (action === 'task_edit_cancel') {
      setModal(null);
      return;
    }
    if (action === 'task_edit_save') {
      const m = state.modal;
      if (!m || m.type !== 'task_edit') return;
      const text = String(m.text || '').trim();
      if (text) updateTask(m.projectId, m.taskId, text);
      setModal(null);
      return;
    }
    if (action === 'task_delete') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const taskId = Number(actionEl.getAttribute('data-task'));
      if (window.confirm('이 항목을 삭제하시겠습니까?')) deleteTask(projectId, taskId);
      return;
    }
    if (action === 'task_add') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const m = state.modal?.type === 'task_new' && state.modal.projectId === projectId ? state.modal : null;
      const text = String(m?.text || '').trim();
      if (!text) return;
      addTask(projectId, text);
      state.modal = null;
      render();
      return;
    }

    /* Project CRUD / detail */
    if (action === 'project_add') {
      setModal({ type: 'project_form', editingId: null, form: { title: '', description: '', theme: 'primary' }, error: '' });
      return;
    }
    if (action === 'project_edit') {
      const projectId = Number(actionEl.getAttribute('data-id'));
      const p = state.projectsData.find((x) => x.id === projectId);
      if (!p) return;
      setModal({ type: 'project_form', editingId: p.id, form: { title: p.title, description: p.description || '', theme: p.theme || 'primary' }, error: '' });
      return;
    }
    if (action === 'project_delete') {
      const projectId = Number(actionEl.getAttribute('data-id'));
      const p = state.projectsData.find((x) => x.id === projectId);
      if (!p) return;
      if (window.confirm(`'${p.title}' 사업을 정말 삭제하시겠습니까?`)) deleteProject(projectId);
      return;
    }
    if (action === 'project_save') {
      const m = state.modal;
      if (!m || m.type !== 'project_form') return;
      const title = String(m.form.title || '').trim();
      if (!title) {
        setModal({ ...m, error: '사업명은 필수 입력 항목입니다.' });
        return;
      }
      const theme = m.form.theme === 'secondary' ? 'secondary' : 'primary';
      const iconName = theme === 'primary' ? ICONS.briefcase : ICONS.activity;
      const payload = { title, description: String(m.form.description || ''), theme, icon: iconName };
      if (m.editingId) updateProjectInfo(m.editingId, payload);
      else addProject(payload);
      setModal(null);
      return;
    }
    if (action === 'project_detail_toggle') {
      const projectId = Number(actionEl.getAttribute('data-id'));
      const willOpen = state.projectsExpandedProjectId !== projectId;
      state.projectsExpandedProjectId = willOpen ? projectId : null;
      if (willOpen) {
        state.uiExpandAnimateId = projectId;
        state.uiScrollToProjectId = projectId;
      }
      saveState();
      render();
      return;
    }

    /* Project detail schedule CRUD */
    if (action === 'proj_schedule_add') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      setModal({ type: 'proj_schedule_form', projectId, editingId: null, form: { district: '', type: '', date: '', contact: '' }, error: '' });
      return;
    }
    if (action === 'proj_schedule_edit') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const scheduleId = Number(actionEl.getAttribute('data-schedule'));
      const p = state.projectsData.find((x) => x.id === projectId);
      const s = p?.schedules.find((x) => x.id === scheduleId);
      if (!s) return;
      setModal({ type: 'proj_schedule_form', projectId, editingId: scheduleId, form: { district: s.district, type: s.type, date: s.date, contact: s.contact || '' }, error: '' });
      return;
    }
    if (action === 'proj_schedule_delete') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const scheduleId = Number(actionEl.getAttribute('data-schedule'));
      if (window.confirm('이 일정을 삭제하시겠습니까?')) deleteProjectSchedule(projectId, scheduleId);
      return;
    }
    if (action === 'proj_schedule_toggle_done') {
      const projectId = Number(actionEl.getAttribute('data-project'));
      const scheduleId = Number(actionEl.getAttribute('data-schedule'));
      toggleScheduleCompletion(projectId, scheduleId);
      return;
    }
    if (action === 'proj_schedule_save') {
      const m = state.modal;
      if (!m || m.type !== 'proj_schedule_form') return;
      const district = String(m.form.district || '').trim();
      const type = String(m.form.type || '').trim();
      if (!district || !type) {
        setModal({ ...m, error: '지역구와 구분은 필수 입력 항목입니다.' });
        return;
      }
      if (m.editingId) updateProjectSchedule(m.projectId, m.editingId, { ...m.form, district, type });
      else addProjectSchedule(m.projectId, { ...m.form, district, type });
      setModal(null);
      return;
    }

    /* Members CRUD */
    if (action === 'member_add') {
      setModal({ type: 'member_form', editingId: null, form: { name: '', group: '위원', role: '위원' }, error: '' });
      return;
    }
    if (action === 'member_edit') {
      const memberId = Number(actionEl.getAttribute('data-id'));
      const mbr = state.membersData.find((x) => x.id === memberId);
      if (!mbr) return;
      setModal({ type: 'member_form', editingId: memberId, form: { name: mbr.name, group: mbr.group || '위원', role: mbr.role }, error: '' });
      return;
    }
    if (action === 'member_delete') {
      const memberId = Number(actionEl.getAttribute('data-id'));
      const mbr = state.membersData.find((x) => x.id === memberId);
      if (!mbr) return;
      if (window.confirm(`'${mbr.name}' 위원을 정말 삭제하시겠습니까?`)) deleteMember(memberId);
      return;
    }
    if (action === 'member_save') {
      const m = state.modal;
      if (!m || m.type !== 'member_form') return;
      const name = String(m.form.name || '').trim();
      const role = String(m.form.role || '').trim();
      const group = m.form.group === '임원진' ? '임원진' : '위원';
      if (!name || !role) {
        setModal({ ...m, error: '이름과 직책은 필수 입력 항목입니다.' });
        return;
      }
      const payload = { name, role, group };
      if (m.editingId) updateMember(m.editingId, payload);
      else addMember(payload);
      setModal(null);
      return;
    }
  });

  // 첫 렌더 시 로그인 modal state 초기화
  if (!state.currentUser) {
    state.modal = { type: 'login_select', selectedMemberId: null, password: '', error: '', stage: 'select' };
  }

  render();
})();
