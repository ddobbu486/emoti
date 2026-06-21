/* ===================== 설정 ===================== */
const MODEL = "gemini-3.1-flash-image";
const API_URL = (key) => `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

// 위저드 단계 정의
const STEPS = [
  {
    key: "species",
    title: "사람인가요, 동물인가요?",
    sub: "캐릭터의 종족을 골라주세요. 동물/사물을 고르면 그 형태를 기반으로 캐릭터를 디자인해요.",
    multi: false,
    searchable: true,
    options: [
      "사람", "강아지", "고양이", "곰", "토끼", "햄스터", "다람쥐", "여우", "너구리", "펭귄",
      "오리", "병아리", "올빼미", "양", "소", "돼지", "염소", "공룡", "도마뱀", "개구리",
      "물고기", "문어", "거북이", "외계인", "유령", "정체불명의 생물체", "감자", "만두", "주먹밥", "구름",
      "달걀", "버섯", "고슴도치", "수달", "알파카", "판다"
    ]
  },
  {
    key: "age",
    title: "나이대를 골라주세요",
    sub: "캐릭터의 말투와 분위기에 영향을 줘요.",
    multi: false,
    options: ["10대", "20대 초반", "20대 후반", "30대 초반", "30대 후반", "40대", "50대 이상", "나이 무관(동물/사물 캐릭터)"]
  },
  {
    key: "gender",
    title: "성별을 골라주세요",
    sub: "캐릭터 외형의 기본 톤이에요.",
    multi: false,
    options: ["여성", "남성", "중성적", "무성(동물/사물 캐릭터)"]
  },
  {
    key: "personality",
    title: "성격을 골라주세요",
    sub: "캐릭터의 기본 성격이에요. 여러 개 선택 가능해요.",
    multi: true,
    searchable: true,
    options: [
      "상냥한", "낙천적인", "성실한", "리액션큰", "예의바른", "무뚝뚝한", "장난꾸러기", "엉뚱한", "차분한", "츤데레",
      "다정한", "직진하는", "소심한", "당당한", "허당끼있는", "느긋한", "예민한", "유쾌한", "진지한", "애교많은",
      "쿨한", "걱정많은", "긍정에너지", "삐딱한", "눈치빠른", "낯가리는", "무례한", "게으른", "사교적인", "겁많은",
      "수다스러운", "솔직한", "내성적인", "외향적인", "고집센", "순둥순둥한", "철없는", "어른스러운", "허세있는", "겸손한",
      "냉정한", "감성적인", "단순한", "꼼꼼한", "덜렁대는", "느릿느릿한", "성격급한", "감정기복있는", "눈물많은", "잘삐지는",
      "독립적인", "의존적인", "리더십있는", "팔로워형", "현실적인", "몽상가같은", "계산적인", "순수한", "능청스러운", "푼수같은"
    ]
  },
  {
    key: "job",
    title: "직업을 골라주세요",
    sub: "캐릭터가 속한 세계관이에요.",
    multi: false,
    searchable: true,
    options: [
      "은행원", "보험설계사", "엔지니어", "데이터분석가", "AI개발자", "PM", "스타트업직원", "작가", "웹툰작가", "일러스트레이터",
      "영상편집자", "사진작가", "선생님", "프리랜서", "학생", "직장인", "대학원생", "공무원", "디자이너", "마케터",
      "영업직", "의사", "간호사", "요식업 사장님", "자영업자", "주부", "주부아빠", "운동선수", "연구원", "변호사",
      "회계사", "세무사", "취준생", "무직/백수", "아르바이트생", "강사/과외선생님", "엄마", "아빠", "바리스타", "승무원",
      "소방관", "경찰관", "군인", "낚시꾼", "농부", "어부", "트럭운전사", "택배기사", "배달라이더", "유튜버",
      "BJ/스트리머", "헤어디자이너", "메이크업아티스트", "수의사", "약사", "건축가", "인테리어디자이너", "요리사/셰프", "제빵사", "플로리스트",
      "통역사", "번역가", "성우", "배우", "가수", "댄서", "운동코치/트레이너", "도서관 사서", "여행가이드", "승려/종교인"
    ]
  },
  {
    key: "relation",
    title: "주로 누구한테 보낼까요?",
    sub: "받는 대상에 따라 톤이 달라져요.",
    multi: false,
    options: ["직장동료", "후배", "상사", "친구", "스터디원", "연인", "썸타는 사람", "가족", "부모님", "형제자매", "동호회 사람들", "단톡방", "고객/거래처", "온라인 친구"]
  },
  {
    key: "hobby",
    title: "취미를 골라주세요",
    sub: "캐릭터의 디테일을 살려줄 요소예요. 여러 개 선택 가능해요.",
    multi: true,
    options: ["커피", "운동", "독서", "게임", "여행", "음악", "요리", "고양이", "강아지", "그림", "캠핑", "넷플릭스", "맛집탐방", "사진찍기", "쇼핑", "필라테스/요가", "낚시", "골프", "전시회/공연", "재테크", "반려식물", "보드게임", "노래방"]
  },
  {
    key: "exercise",
    title: "운동 강도는요?",
    sub: "포즈의 역동성에 반영돼요.",
    multi: false,
    options: ["전혀 안함", "가볍게", "꾸준히", "헬스매니아", "러닝/마라톤", "요가/필라테스 위주"]
  },
  {
    key: "tone",
    title: "말투를 골라주세요",
    sub: "텍스트가 들어가는 컷에 반영돼요.",
    multi: false,
    options: ["존댓말", "반말", "존댓말+반말 섞임", "사투리(말투에 명시)", "텍스트 없이 표정만", "이모지 많이 쓰는 말투", "단답형 무뚝뚝 말투"]
  },
  {
    key: "speechHabit",
    title: "말버릇이나 추임새가 있다면 적어주세요 (선택)",
    sub: "예: 문장 끝마다 '~당', '~데이', '음...' 자주 씀, '헐'을 자주 씀 등",
    freeText: true
  },
  {
    key: "colorMood",
    title: "선호하는 색감/분위기를 골라주세요",
    sub: "스티커 전체 톤에 반영돼요.",
    multi: false,
    options: ["파스텔톤", "비비드/원색", "모노톤(흑백+포인트컬러)", "어스톤(자연스러운 베이지/브라운)", "네온/형광", "레트로톤"]
  },
  {
    key: "visual",
    title: "비주얼 포인트가 있다면 적어주세요 (선택)",
    sub: "예: 단정한 가르마 머리, 동그란 안경, 리본 머리띠, 항상 들고 있는 소품 등 (캐릭터 이미지를 올렸다면 비워둬도 돼요)",
    freeText: true
  },
  {
    key: "killingPoint",
    title: "이 캐릭터만의 '킬링포인트'가 있다면 적어주세요 (선택)",
    sub: "이게 있으면 32컷이 훨씬 독특해져요. 예: 표정이 항상 영혼없음 / 뭘 해도 어설픔 / 갑자기 진지해짐 / 늘 억울한 표정 / 혼잣말이 많음 / 의욕은 넘치는데 결과는 늘 망함",
    freeText: true
  }
];

let current = 0;
const answers = {};

/* ===================== 32컷 상황 리스트 ===================== */
const SITUATIONS = [
  "안녕 인사", "반가워", "응 긍정", "아니 부정", "고마워",
  "미안해", "사랑해", "축하해", "화이팅 응원", "좋아 만족",
  "싫어 거부", "슬퍼 눈물", "화나 분노", "놀람", "빵터짐 웃김",
  "졸려 피곤", "배고파", "추워", "더워", "아파 골골",
  "바빠 정신없음", "심심해", "부끄러워", "자랑스러워 뿌듯", "안녕히가세요 배웅",
  "환영해 인사", "축하 파티", "박수 칭찬", "한숨 한숨", "멘붕 당황",
  "굿잡 엄지척", "사랑둥이 애정표현"
];

/* ===================== 캐릭터 시드(일관성용) ===================== */
let characterSeed = "";
let wizardCompleted = false;

// 업로드한 캐릭터 이미지 (base64, mime) — 있으면 모든 컷의 레퍼런스로 사용
let charImageBase64 = null;
let charImageMime = null;

// 업로드가 없을 경우, 첫 번째로 생성된 컷을 이후 컷들의 레퍼런스로 재사용해 일관성 유지
let autoReferenceBase64 = null;
let autoReferenceMime = null;

/* ===================== DOM ===================== */
const stepArea = document.getElementById("stepArea");
const stepLabel = document.getElementById("stepLabel");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const wizard = document.getElementById("wizard");
const resultSection = document.getElementById("resultSection");
const conceptSummary = document.getElementById("conceptSummary");
const grid = document.getElementById("grid");
const downloadZipBtn = document.getElementById("downloadZipBtn");
const genStatus = document.getElementById("genStatus");

const previewStage = document.getElementById("previewStage");
const previewImgBox = document.getElementById("previewImgBox");
const previewBtn = document.getElementById("previewBtn");
const previewRetryBtn = document.getElementById("previewRetryBtn");
const confirmAllBtn = document.getElementById("confirmAllBtn");
const previewError = document.getElementById("previewError");
const fullResultStage = document.getElementById("fullResultStage");

const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKey");
const keyStatus = document.getElementById("keyStatus");

const charImageInput = document.getElementById("charImageInput");
const charPreviewBox = document.getElementById("charPreviewBox");
const charPreview = document.getElementById("charPreview");
const charRemove = document.getElementById("charRemove");

/* ===================== API 키 저장/로드 ===================== */
function loadKey() {
  const k = localStorage.getItem("emoticon_ai_gemini_key");
  if (k) {
    apiKeyInput.value = k;
    keyStatus.textContent = "저장됨";
    keyStatus.classList.add("ok");
  }
}
saveKeyBtn.addEventListener("click", () => {
  const v = apiKeyInput.value.trim();
  if (!v) return;
  localStorage.setItem("emoticon_ai_gemini_key", v);
  keyStatus.textContent = "저장됨";
  keyStatus.classList.add("ok");
});
loadKey();

/* ===================== 캐릭터 이미지 업로드 ===================== */
charImageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const dataUrl = await fileToDataURL(file);
  const [meta, base64] = dataUrl.split(",");
  charImageMime = meta.match(/data:(.*);base64/)[1];
  charImageBase64 = base64;
  charPreview.src = dataUrl;
  charPreviewBox.classList.remove("hidden");
});
charRemove.addEventListener("click", () => {
  charImageBase64 = null;
  charImageMime = null;
  charImageInput.value = "";
  charPreviewBox.classList.add("hidden");
});
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ===================== 위저드 렌더 ===================== */
function renderStep() {
  const step = STEPS[current];
  stepLabel.textContent = `STEP ${current + 1} / ${STEPS.length}`;
  progressBar.style.width = `${((current + 1) / STEPS.length) * 100}%`;

  let html = `<h2 class="step-title">${step.title}</h2><p class="step-sub">${step.sub}</p>`;

  if (step.freeText) {
    const val = answers[step.key] || "";
    html += `<textarea class="free-text" id="freeTextInput" placeholder="자유롭게 적어주세요">${val}</textarea>`;
  } else {
    if (step.searchable) {
      html += `<input type="text" id="optionSearch" class="option-search" placeholder="입력해서 빠르게 찾기 (예: 사교)">`;
    }
    html += `<div class="option-grid" id="optionGrid">`;
    step.options.forEach(opt => {
      const selected = step.multi
        ? (answers[step.key] || []).includes(opt)
        : answers[step.key] === opt;
      html += `<button type="button" class="option-btn${selected ? " selected" : ""}" data-opt="${opt}">${opt}</button>`;
    });
    html += `</div>`;
  }

  stepArea.innerHTML = html;

  if (!step.freeText) {
    stepArea.querySelectorAll(".option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const opt = btn.dataset.opt;
        if (step.multi) {
          const arr = answers[step.key] || (answers[step.key] = []);
          const idx = arr.indexOf(opt);
          if (idx >= 0) arr.splice(idx, 1); else arr.push(opt);
        } else {
          answers[step.key] = opt;
        }
        renderStep();
      });
    });
    if (step.searchable) {
      const searchInput = document.getElementById("optionSearch");
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        document.querySelectorAll("#optionGrid .option-btn").forEach(btn => {
          const match = btn.dataset.opt.toLowerCase().includes(q);
          btn.style.display = match ? "" : "none";
        });
      });
    }
  } else {
    document.getElementById("freeTextInput").addEventListener("input", e => {
      answers[step.key] = e.target.value;
    });
  }

  prevBtn.style.visibility = current === 0 ? "hidden" : "visible";
  nextBtn.textContent = current === STEPS.length - 1 ? "컨셉 완성 ✓" : "다음 >";
}

prevBtn.addEventListener("click", () => {
  if (current > 0) { current--; renderStep(); }
});
nextBtn.addEventListener("click", () => {
  if (current < STEPS.length - 1) {
    current++; renderStep();
  } else {
    finishWizard();
  }
});

/* ===================== 위저드 완료 → 결과 화면 ===================== */
function finishWizard() {
  characterSeed = buildCharacterSeed();
  wizardCompleted = true;
  wizard.classList.add("hidden");
  resultSection.classList.remove("hidden");
  conceptSummary.innerHTML = buildConceptNarrative() +
    (charImageBase64
      ? `<br><br><b>레퍼런스</b><br>업로드한 캐릭터 이미지를 기준으로 그려요`
      : `<br><br><b>레퍼런스</b><br>업로드 이미지 없음 → 미리보기 1컷을 기준 캐릭터로 자동 고정`);

  // 상태 초기화
  previewStage.classList.remove("hidden");
  fullResultStage.classList.add("hidden");
  previewImgBox.innerHTML = "대기중";
  previewBtn.classList.remove("hidden");
  previewRetryBtn.classList.add("hidden");
  confirmAllBtn.classList.add("hidden");
  previewError.classList.add("hidden");
  previewBtn.disabled = false;
  previewBtn.textContent = "1컷 미리보기 생성";

  resultSection.scrollIntoView({ behavior: "smooth" });
}

function buildCharacterSeed() {
  const species = answers.species || "사람";
  const age = answers.age || "무관";
  const gender = answers.gender || "무관";
  const p = (answers.personality || []).join(", ") || "평범한";
  const job = answers.job || "직장인";
  const rel = answers.relation || "친구";
  const hobby = (answers.hobby || []).join(", ") || "특별히 없음";
  const ex = answers.exercise || "가볍게";
  const tone = answers.tone || "존댓말";
  const speechHabit = answers.speechHabit || "특별한 말버릇 없음";
  const colorMood = answers.colorMood || "파스텔톤";
  const visual = answers.visual || "특징 없음, 디자이너 재량";
  const killingPoint = answers.killingPoint || "";

  return [
    `[캐릭터 컨셉]`,
    `종족: ${species}${species !== "사람" ? " (사람이 아니라 이 동물/사물을 의인화한 캐릭터)" : ""}`,
    `나이대: ${age}`,
    `성별: ${gender}`,
    `성격: ${p}`,
    `직업: ${job}`,
    `주 사용 관계: ${rel}`,
    `취미: ${hobby}`,
    `운동 강도: ${ex}`,
    `말투: ${tone}`,
    `말버릇/추임새: ${speechHabit}`,
    `색감/분위기: ${colorMood}`,
    `비주얼 포인트: ${visual}`,
    killingPoint ? `킬링포인트(이 캐릭터 특유의 개그 코드, 모든 컷에 일관되게 녹여낼 것): ${killingPoint}` : ``,
  ].filter(Boolean).join("\n");
}

// 스샷처럼 컨셉/타겟/받아보는 대상/추천 캐릭터 주체 형식으로 풀어서 보여주는 서술형 요약
function buildConceptNarrative() {
  const species = answers.species || "사람";
  const age = answers.age || "나이 무관";
  const gender = answers.gender || "성별 무관";
  const p = (answers.personality || []).join(", ") || "평범한";
  const job = answers.job || "직장인";
  const rel = answers.relation || "친구";
  const hobby = (answers.hobby || []).join(", ") || "특별한 취미 없음";
  const ex = answers.exercise || "가볍게";
  const tone = answers.tone || "존댓말";
  const speechHabit = answers.speechHabit || "";
  const colorMood = answers.colorMood || "파스텔톤";
  const visual = answers.visual || "";
  const killingPoint = answers.killingPoint || "";

  const conceptTitle = `${p.split(", ")[0] || "개성있는"} ${species} ${job} 컨셉`;

  const lines = [];
  lines.push(`<b>컨셉</b>\n${conceptTitle}`);
  lines.push(`<b>종족</b>\n${species}`);
  lines.push(`<b>나이/성별</b>\n${age} · ${gender}`);
  lines.push(`<b>성격</b>\n${p}`);
  lines.push(`<b>말투</b>\n${tone}${speechHabit ? ` (${speechHabit})` : ""}`);
  lines.push(`<b>타겟</b>\n${age}, ${job}로 살아가며 일상과 직장에서 자신의 개성을 드러내고 싶은, ${(answers.hobby || []).length ? hobby + " 같은 취미를 즐기는" : ""} 사용자층`);
  lines.push(`<b>받아보는 대상</b>\n${rel} 등 평소 자주 연락하는 가까운 관계`);
  lines.push(`<b>추천 캐릭터 주체</b>\n${p}을(를) 가진 ${age} ${gender} ${species} ${job} 캐릭터, 운동은 ${ex} 정도로 즐기는 편`);
  if (visual) lines.push(`<b>비주얼 포인트</b>\n${visual}`);
  if (killingPoint) lines.push(`<b>킬링포인트</b>\n${killingPoint}`);
  lines.push(`<b>색감/분위기</b>\n${colorMood}`);

  return lines.map(l => l.replace(/\n/g, "<br>")).join("<br><br>");
}


/* ===================== 그림체 스타일 가이드 (카카오 이모티콘 인기작 기준) ===================== */
const STYLE_GUIDE = `[그림체 스타일 — 반드시 지킬 것]
실제 카카오 이모티콘 스토어 인기작들(예: 멍충해요 황토강아지, 꿀꿀꿀 해피그, 은은한 곰, 화병아리 같은 스타일)을 참고 기준으로 삼아 그려줘. 이건 게임/애니메이션 캐릭터 컨셉아트가 아니라 "카톡으로 주고받는 이모티콘"이야. 절대 사람 비율로 그리지 마.

- 비율: 머리가 몸 전체의 50~70%를 차지할 정도로 머리가 압도적으로 크고, 몸통은 짧고 둥근 덩어리 형태. 목은 거의 안 보이거나 없는 것처럼. 팔다리는 아주 짧고 뭉툭하게 (사람처럼 길고 늘씬한 팔다리 절대 금지).
- 의상: 옷을 입힌다면 단색 셔츠/스웨터 정도로 아주 단순하게. 주름, 단추, 지퍼, 로고, 패턴 같은 디테일은 절대 넣지 마. 목도리나 리본처럼 간단한 액세서리 1개 정도면 충분해.
- 소품 금지: 가방, 배낭, 휴대폰, 책 같은 들고 다니는 소품은 넣지 마. 캐릭터의 개성은 옷 색이나 안경/리본 같은 아주 작은 디테일 1개로만 표현해. 손에 무언가를 들어야 하는 상황(예: 커피, 휴대폰)이 아니면 손/팔은 그냥 단순하게 둬.
- 외곽선: 굵고 깔끔한 검은색 선.
- 음영: 입체적인 3D 렌더링, 여러 방향 광원, 광택 하이라이트 절대 금지. 한 방향의 아주 옅고 단순한 그림자나 볼터치 정도만 허용.
- 색: 채도가 과하지 않은 차분한 단색 위주, 2~5가지 색. 배경은 순수 흰색.
- 표정: 얼굴 비중을 크게 잡고, 표정과 포즈만으로 상황이 직관적으로 읽히게. 눈/코/입은 아주 단순한 도형이나 선으로.
- 절대 사실적인 털 질감, 피부 질감, 포토리얼한 렌더링, 정교한 일러스트 느낌으로 가지 마. 매끈하고 정성스러운 컨셉아트가 아니라 단순하고 둥글둥글한 마스코트 캐릭터여야 해.
- 톤: 예쁘고 단정하게 그리려 하지 마. 실제 인기 카카오 이모티콘들은 약간 "병맛"스럽고 허당미 있는 게 매력이야. 눈을 반쯤 풀린 흐리멍텅한 표정, 일그러진 얼굴, 과장된 리액션, 엉뚱하고 예상 못한 포즈를 적극적으로 시도해. 무난하고 안전한 표정보다는, 보는 사람이 피식 웃게 되는 디테일을 넣어줘.
- 아이디어(가장 중요): 감정 단어를 사전적으로 직역하지 마. 매 컷마다 위 캐릭터의 직업/성격/말버릇/킬링포인트를 적극적으로 끌어와서, "이 상황"과 "이 캐릭터" 사이에서 생기는 아이러니나 반전으로 웃음 포인트를 만들어. 예를 들어 직업이 "백수"인 캐릭터의 "바빠 정신없음"이라면 실제로는 할 일이 없으면서 괜히 분주한 척하는 모습처럼, 컨셉과 상황이 충돌하면서 생기는 디테일을 적극적으로 넣어. 킬링포인트가 있다면 32컷 전체에 걸쳐 그 개그 코드가 계속 드러나도록 일관되게 활용해.
- "그냥 무난하게 잘 그린 감정 표현 일러스트"가 되는 걸 가장 경계해. 보는 사람이 "어? 이거 뭐지 ㅋㅋ" 하고 피식 웃을 만한 디테일이 매 컷에 최소 하나는 있어야 해.`;

/* ===================== Gemini 이미지 생성 ===================== */
async function generateOneImage(situation, referenceB64, referenceMime) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) throw new Error("API 키를 입력해주세요");

  const promptText = `카카오톡 이모티콘 스타일의 귀여운 캐릭터 스티커를 그려줘.

${referenceB64 ? "함께 첨부한 이미지 속 캐릭터와 외형(얼굴형, 색, 특징)을 동일하게 유지하면서," : "아래 컨셉에 맞는 캐릭터를 새로 디자인해서,"} 이번 컷에서는 "${situation}" 감정/상황을 표정과 포즈로 표현해줘.

${characterSeed}

${STYLE_GUIDE}

규칙:
- 정사각형 1:1 비율, 배경은 순수 흰색 또는 투명
- 캐릭터 1마리만, 화면 중앙에 꽉 차게
- 텍스트나 말풍선 글자는 넣지 말고 표정과 포즈로만 표현
- 매 컷마다 같은 캐릭터처럼 보이도록 외형을 통일
- 위 컨셉의 "비주얼 포인트"가 있다면 옷 색깔이나 안경/리본처럼 아주 작은 디테일 1개로만 가볍게 반영해. 가방, 소품, 복잡한 의상으로 표현하지 마.`;

  const parts = [{ text: promptText }];
  if (referenceB64) {
    parts.push({ inline_data: { mime_type: referenceMime, data: referenceB64 } });
  }

  let res;
  try {
    res = await fetch(API_URL(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
      })
    });
  } catch (networkErr) {
    throw new Error(`네트워크 오류: ${networkErr.message}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 오류 (HTTP ${res.status})\n${errText.slice(0, 500)}`);
  }

  const data = await res.json();

  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error(`요청이 차단됐어요 (사유: ${blockReason}). 컨셉 문구를 조금 바꿔보세요.`);
  }

  const cParts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = cParts.find(p => p.inlineData || p.inline_data);
  if (!imgPart) {
    const textPart = cParts.find(p => p.text);
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(
      `이미지를 받지 못했어요 (finishReason: ${finishReason || "알 수 없음"})` +
      (textPart ? `\n모델 응답: ${textPart.text.slice(0, 200)}` : "") +
      `\n원문 응답 일부: ${JSON.stringify(data).slice(0, 300)}`
    );
  }
  const inline = imgPart.inlineData || imgPart.inline_data;
  return { base64: inline.data, mime: inline.mimeType || inline.mime_type || "image/png" };
}

/* ===================== 턴어라운드(삼면도) 미리보기 ===================== */
const results = new Array(SITUATIONS.length).fill(null); // {base64, mime}

async function generateTurnaround(referenceB64, referenceMime) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) throw new Error("API 키를 입력해주세요");

  const promptText = `캐릭터 턴어라운드(삼면도) 시트를 그려줘.

${referenceB64 ? "함께 첨부한 이미지 속 캐릭터와 외형(얼굴형, 색, 특징)을 동일하게 유지하면서," : "아래 컨셉에 맞는 캐릭터를 새로 디자인해서,"} 정면 / 측면(옆모습) / 후면(뒷모습) 3가지 각도를 한 이미지 안에 가로로 나란히 배치해서 그려줘.

${characterSeed}

${STYLE_GUIDE}

규칙:
- 가로로 긴 비율(3:1 또는 4:1 느낌), 배경은 순수 흰색
- 3개의 포즈 모두 같은 캐릭터, 같은 크기, 같은 중립적인 무표정/기본 자세 (캐릭터 설정 시트처럼)
- 텍스트, 라벨, 화살표는 넣지 말 것
- 이 시트가 이후 32가지 표정/포즈를 그릴 때 기준이 되는 캐릭터 설정이므로 외형을 명확하고 일관되게 그릴 것
- 위 컨셉의 "비주얼 포인트"가 있다면 옷 색깔이나 안경/리본처럼 아주 작은 디테일 1개로만 가볍게 반영해. 가방, 소품, 복잡한 의상으로 표현하지 마.`;

  const parts = [{ text: promptText }];
  if (referenceB64) {
    parts.push({ inline_data: { mime_type: referenceMime, data: referenceB64 } });
  }

  let res;
  try {
    res = await fetch(API_URL(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
      })
    });
  } catch (networkErr) {
    throw new Error(`네트워크 오류: ${networkErr.message}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 오류 (HTTP ${res.status})\n${errText.slice(0, 500)}`);
  }

  const data = await res.json();
  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error(`요청이 차단됐어요 (사유: ${blockReason}). 컨셉 문구를 조금 바꿔보세요.`);
  }

  const cParts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = cParts.find(p => p.inlineData || p.inline_data);
  if (!imgPart) {
    const textPart = cParts.find(p => p.text);
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(
      `이미지를 받지 못했어요 (finishReason: ${finishReason || "알 수 없음"})` +
      (textPart ? `\n모델 응답: ${textPart.text.slice(0, 200)}` : "") +
      `\n원문 응답 일부: ${JSON.stringify(data).slice(0, 300)}`
    );
  }
  const inline = imgPart.inlineData || imgPart.inline_data;
  return { base64: inline.data, mime: inline.mimeType || inline.mime_type || "image/png" };
}

async function runPreview() {
  if (!apiKeyInput.value.trim()) {
    alert("먼저 상단에 Gemini API 키를 입력하고 저장해주세요.");
    return;
  }
  previewBtn.disabled = true;
  previewBtn.textContent = "그리는 중...";
  previewError.classList.add("hidden");
  previewRetryBtn.classList.add("hidden");
  confirmAllBtn.classList.add("hidden");
  previewImgBox.innerHTML = "그리는 중...";

  try {
    const refB64 = charImageBase64;
    const refMime = charImageMime;
    const turnaround = await generateTurnaround(refB64, refMime);
    autoReferenceBase64 = turnaround.base64;
    autoReferenceMime = turnaround.mime;

    const url = `data:${turnaround.mime};base64,${turnaround.base64}`;
    previewImgBox.innerHTML = `<img src="${url}" alt="턴어라운드 미리보기">`;
    previewBtn.classList.add("hidden");
    previewRetryBtn.classList.remove("hidden");
    confirmAllBtn.classList.remove("hidden");
  } catch (e) {
    console.error(e);
    previewImgBox.innerHTML = "실패";
    previewError.textContent = e.message;
    previewError.classList.remove("hidden");
    previewBtn.classList.remove("hidden");
    previewBtn.disabled = false;
    previewBtn.textContent = "다시 시도";
  }
}
previewBtn.addEventListener("click", runPreview);
previewRetryBtn.addEventListener("click", () => {
  previewBtn.classList.remove("hidden");
  previewBtn.disabled = false;
  previewBtn.textContent = "다시 그리기";
  previewRetryBtn.classList.add("hidden");
  confirmAllBtn.classList.add("hidden");
  previewImgBox.innerHTML = "대기중";
});

/* ===================== 그리드 ===================== */
function buildEmptyGrid() {
  grid.innerHTML = "";
  SITUATIONS.forEach((sit, i) => {
    const cell = document.createElement("div");
    cell.className = "cell pending";
    cell.id = `cell-${i}`;
    cell.innerHTML = `
      <div class="cell-img">대기중</div>
      <div class="cell-label">${i + 1}. ${sit}</div>
    `;
    grid.appendChild(cell);
  });
}

async function renderCellResult(i, result) {
  const cell = document.getElementById(`cell-${i}`);
  const imgBox = cell.querySelector(".cell-img");
  cell.classList.remove("pending", "error");
  const url = `data:${result.mime};base64,${result.base64}`;
  imgBox.innerHTML = `<img src="${url}" alt="${SITUATIONS[i]}">`;
  if (!cell.querySelector(".cell-dl")) {
    const dl = document.createElement("div");
    dl.className = "cell-dl";
    dl.textContent = "PNG 저장";
    dl.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${String(i + 1).padStart(2, "0")}_${SITUATIONS[i].replace(/\s+/g, "_")}.png`;
      a.click();
    });
    cell.appendChild(dl);
  }
}

/* ===================== 32컷 생성 (턴어라운드를 레퍼런스로 사용) ===================== */
async function generateRest() {
  fullResultStage.classList.remove("hidden");
  buildEmptyGrid();
  downloadZipBtn.disabled = true;

  const total = SITUATIONS.length;
  let done = 0;
  genStatus.textContent = `생성 중... ${done} / ${total}`;

  // 턴어라운드 이미지를 모든 컷의 공통 레퍼런스로 사용 (업로드 이미지보다 턴어라운드가 더 정확한 기준)
  const referenceB64 = autoReferenceBase64 || charImageBase64;
  const referenceMime = autoReferenceMime || charImageMime;

  const CONCURRENCY = 3;
  let cursor = 0;

  async function worker() {
    while (cursor < total) {
      const i = cursor++;
      const cell = document.getElementById(`cell-${i}`);
      try {
        const r = await generateOneImage(SITUATIONS[i], referenceB64, referenceMime);
        results[i] = r;
        await renderCellResult(i, r);
      } catch (e) {
        cell.classList.remove("pending");
        cell.classList.add("error");
        cell.querySelector(".cell-img").textContent = "실패";
        cell.title = e.message;
        console.error(`[${i}] ${SITUATIONS[i]}`, e);
      }
      done++;
      genStatus.textContent = `생성 중... ${done} / ${total}`;
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, worker);
  await Promise.all(workers);

  const successCount = results.filter(Boolean).length;
  genStatus.textContent = `완료! ${successCount} / ${total} (실패한 컷에 마우스를 올리면 에러 내용을 볼 수 있어요)`;
  downloadZipBtn.disabled = successCount === 0;
  fullResultStage.scrollIntoView({ behavior: "smooth" });
}
confirmAllBtn.addEventListener("click", generateRest);

/* ===================== ZIP 다운로드 ===================== */
downloadZipBtn.addEventListener("click", async () => {
  const zip = new JSZip();
  zip.file("concept.txt", characterSeed);
  if (autoReferenceBase64) {
    const ext = (autoReferenceMime && autoReferenceMime.includes("png")) ? "png" : "jpg";
    zip.file(`00_턴어라운드.${ext}`, autoReferenceBase64, { base64: true });
  }
  results.forEach((r, i) => {
    if (r) {
      const num = String(i + 1).padStart(2, "0");
      const name = SITUATIONS[i].replace(/\s+/g, "_");
      const ext = (r.mime && r.mime.includes("png")) ? "png" : "jpg";
      zip.file(`${num}_${name}.${ext}`, r.base64, { base64: true });
    }
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "emoticon_32cuts.zip";
  a.click();
  URL.revokeObjectURL(url);
});

/* ===================== 초기화 ===================== */
renderStep();

/* ===================== 탭 전환 ===================== */
const tabBtnSticker = document.getElementById("tabBtnSticker");
const tabBtnMini = document.getElementById("tabBtnMini");
const tabSticker = document.getElementById("tabSticker");
const tabMini = document.getElementById("tabMini");
const miniConceptStatus = document.getElementById("miniConceptStatus");
const miniConceptInput = document.getElementById("miniConceptInput");
const generateMiniBtn = document.getElementById("generateMiniBtn");
const generateMiniRestBtn = document.getElementById("generateMiniRestBtn");
const downloadMiniZipBtn = document.getElementById("downloadMiniZipBtn");
const miniGenStatus = document.getElementById("miniGenStatus");
const miniGrid = document.getElementById("miniGrid");
const miniTypeGrid = document.getElementById("miniTypeGrid");
const randomMiniConceptBtn = document.getElementById("randomMiniConceptBtn");

function updateMiniConceptStatus() {
  if (wizardCompleted) {
    miniConceptStatus.textContent = "32컷 탭에서 만든 캐릭터 컨셉을 가져왔어요. 그대로 사용하거나, 아래에 추가 설명을 적어 보완할 수 있어요.";
  } else {
    miniConceptStatus.textContent = "아직 32컷 탭에서 캐릭터 컨셉을 완성하지 않았어요. 없어도 아래 입력창에 간단히 적고 바로 시작할 수 있어요.";
  }
}

tabBtnSticker.addEventListener("click", () => {
  tabBtnSticker.classList.add("active");
  tabBtnMini.classList.remove("active");
  tabSticker.classList.remove("hidden");
  tabMini.classList.add("hidden");
});
tabBtnMini.addEventListener("click", () => {
  tabBtnMini.classList.add("active");
  tabBtnSticker.classList.remove("active");
  tabMini.classList.remove("hidden");
  tabSticker.classList.add("hidden");
  updateMiniConceptStatus();
});

/* ===================== 미니 이모티콘 ===================== */
// 실제 카카오 미니이모티콘 인기작 분석 결과 4가지 패턴으로 재구성 (스티커 32컷과는 완전히 다른 컨셉)
const MINI_TYPES = {
  object: {
    icon: "🍓",
    name: "사물/오브젝트 모음형",
    desc: "캐릭터 없이 귀여운 사물 42개 (가장 흔한 패턴)",
    items: [
      "무지개", "해바라기", "하트", "프레첼", "별", "포크", "컵케이크", "스탠드 조명",
      "크리스마스 트리", "햇님", "비구름", "사과", "음표", "아이스크림콘", "제비", "폭죽 모양 별",
      "비행기", "기차", "산", "자동차", "집", "선물상자", "버섯", "체리",
      "왕관", "네잎클로버", "알록달록 빌딩", "계란후라이", "토스트빵", "토끼", "곰돌이", "사과주스",
      "커피잔", "햄버거", "소프트아이스크림", "딸기", "우산", "책", "손목시계", "초승달",
      "나비", "꽃다발"
    ]
  },
  text: {
    icon: "🔤",
    name: "한글자·단어 텍스트형",
    desc: "짧은 단어를 타이포그래피로 디자인",
    items: [
      "만", "헐", "뭐", "럽", "꿀", "짱", "굳", "큐",
      "응", "고", "돈", "밥", "잼", "짠", "쇼", "빡",
      "힘", "술", "똥", "별", "축", "야", "오", "특",
      "북", "상", "하", "해", "밤", "빵", "킹", "쪽",
      "콜", "흙", "와", "음", "헉", "대박", "굿", "화이팅",
      "안녕", "진짜"
    ]
  },
  character: {
    icon: "🐹",
    name: "캐릭터 얼굴+장식 혼합형",
    desc: "캐릭터 얼굴만 작게, 표정 + 장식 아이콘",
    items: [
      "기쁜 얼굴", "슬픈 얼굴", "놀란 얼굴", "화난 얼굴", "부끄러운 얼굴", "졸린 얼굴", "무표정", "우는 얼굴",
      "사랑스러운 하트눈 얼굴", "당황한 얼굴", "시크한 얼굴", "신난 얼굴", "골난 얼굴", "토라진 얼굴",
      "하트", "별", "무지개", "구름", "음표", "말풍선", "다이아몬드", "반짝임 효과",
      "폭죽", "네잎클로버", "도넛 모양 구름", "눈물방울", "빗방울", "번개", "불꽃", "깃발",
      "리본", "왕관", "케이크", "선물상자", "시계", "달", "해", "나뭇잎",
      "꽃", "우산", "가방", "신발"
    ]
  },
  shape: {
    icon: "🔢",
    name: "도형·숫자 채팅꾸미기형",
    desc: "숫자/화살표/체크를 패턴 뱃지 형태로",
    items: [
      "숫자 0", "숫자 1", "숫자 2", "숫자 3", "숫자 4", "숫자 5", "숫자 6", "숫자 7",
      "숫자 8", "숫자 9", "위쪽 화살표", "아래쪽 화살표", "왼쪽 화살표", "오른쪽 화살표",
      "체크 표시", "엑스 표시", "느낌표", "물음표", "동그라미", "세모", "네모", "별 모양",
      "하트 모양", "다이아몬드 모양", "말풍선", "우산", "나무", "집 모양",
      "신용카드 모양", "자물쇠", "열쇠", "돋보기", "시계", "캘린더", "편지봉투", "위치 핀",
      "깃발", "전화기", "음표", "반짝임", "구름", "달"
    ]
  }
};

let selectedMiniType = "object";
let currentMiniItems = MINI_TYPES[selectedMiniType].items.slice();
let miniResults = new Array(currentMiniItems.length).fill(null);
let miniStyleRefBase64 = null;
let miniStyleRefMime = null;
const MINI_PREVIEW_COUNT = 5;

/* ---- 랜덤 컨셉 추천 (아이디어 막힐 때) ---- */
// 테마(내용)와 화풍(색감/스타일)을 분리해서 곱셈으로 다양성을 키움
const MINI_THEMES = {
  object: [
    "캠핑/차박 용품 (텐트, 랜턴, 코펠, 캠프파이어)",
    "디저트 카페 메뉴 (마카롱, 라떼, 와플, 크로플)",
    "여름 바다휴가 소품 (튜브, 조개, 파라솔, 아이스크림)",
    "자취생 생활밀착 소품 (택배상자, 분리수거, 라면, 즉석밥)",
    "크리스마스/연말 소품 (트리, 양말, 눈사람, 핫초코)",
    "식집사(반려식물) 소품 (화분, 분무기, 다육이, 새싹)",
    "문구점 소품 (연필, 지우개, 자, 풀, 스테이플러)",
    "가랜드/파티 데코 소품 (깃발 가랜드, 풍선, 폭죽, 케이크 초)",
    "다꾸(다이어리 꾸미기) 소품 (스티커, 마스킹테이프, 클립, 도장)",
    "베이킹 도구 (오븐, 거품기, 머핀틀, 밀대)",
    "우주/별자리 소품 (로켓, 행성, 별, UFO)",
    "동물원 동물 모음", "바다생물 모음 (물고기, 문어, 불가사리, 산호)",
    "전통 명절 소품 (한복, 떡, 윷, 연)", "생일파티 소품 (케이크, 풍선, 고깔모자, 선물)",
    "겨울스포츠 용품 (스키, 스노보드, 장갑, 목도리)", "봄꽃놀이 소품 (벚꽃, 돗자리, 도시락, 나비)",
    "악기/음악 소품 (기타, 피아노, 헤드폰, 음표)", "여행/지도 소품 (캐리어, 비행기, 여권, 지도)",
    "학교/학생 준비물 (책가방, 필통, 시간표, 칠판)", "베이커리 빵 모음 (크루아상, 식빵, 도넛, 베이글)"
  ],
  text: [
    "헬스/오운완 운동 용어", "직장인 야근·칼퇴 용어", "술자리·회식 용어", "수험생·공시생 용어",
    "학교/학생 용어 (숙제, 급식, 방학, 야자)", "연애/썸 용어", "다이어트 용어",
    "육아맘 용어", "게임 용어 (귀환, 갱, 와드, 풀피)", "자취생 생활 용어",
    "아날로그 손편지 말투 (안녕, 보고싶어, 답장줘)", "신입사원 용어 (출근, 보고, 컨펌, 칼퇴)"
  ],
  character: [
    "고양이 집사 일상 표정", "곰돌이 직장인 리액션", "강아지 댕댕이 표정",
    "토끼 학생 리액션", "병아리 신입사원 표정", "햄스터 자취생 표정"
  ],
  shape: [
    "채팅 꾸미기용 도형/숫자", "마스킹테이프 콜라주풍 도형", "색종이 공작풍 도형/숫자",
    "버블레터(통통한 폰트) 알파벳", "필름 사진 프레임 모양 도형"
  ]
};

const MINI_STYLE_MOODS = [
  "파스텔톤의 부드러운 색감",
  "비비드한 원색 컬러",
  "흑백 라인 아트 (색 없이 선으로만)",
  "네온/형광 컬러",
  "레트로 톤 (채도 낮은 빈티지 색감)",
  "수채화풍의 번짐 있는 느낌",
  "색종이를 오려붙인 듯한 페이퍼크래프트풍",
  "마스킹테이프를 붙인 듯한 콜라주풍",
  "손글씨가 더해진 아날로그 편지지풍",
  "굵은 사인펜으로 쓱쓱 그린 듯한 손그림풍"
];

function pickRandomMiniConcept() {
  const types = Object.keys(MINI_THEMES);
  const type = types[Math.floor(Math.random() * types.length)];
  const themeList = MINI_THEMES[type];
  const theme = themeList[Math.floor(Math.random() * themeList.length)];
  const mood = MINI_STYLE_MOODS[Math.floor(Math.random() * MINI_STYLE_MOODS.length)];
  selectedMiniType = type;
  miniConceptInput.value = `${theme}. 화풍은 ${mood}으로.`;
  resetMiniState();
  renderMiniTypeGrid();
}

/* ---- 타입 선택 UI ---- */
function resetMiniState() {
  currentMiniItems = MINI_TYPES[selectedMiniType].items.slice();
  miniResults = new Array(currentMiniItems.length).fill(null);
  miniStyleRefBase64 = null;
  miniStyleRefMime = null;
  miniGrid.innerHTML = "";
  miniGenStatus.textContent = "";
  generateMiniBtn.classList.remove("hidden");
  generateMiniBtn.disabled = false;
  generateMiniBtn.textContent = "예시 5개 먼저 생성";
  generateMiniRestBtn.classList.add("hidden");
  downloadMiniZipBtn.disabled = true;
}

function renderMiniTypeGrid() {
  miniTypeGrid.innerHTML = "";
  Object.entries(MINI_TYPES).forEach(([key, t]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mini-type-btn" + (key === selectedMiniType ? " selected" : "");
    btn.innerHTML = `<span class="ti">${t.icon}</span>${t.name}<br><span style="font-weight:400;color:var(--gray);font-size:11px;">${t.desc}</span>`;
    btn.addEventListener("click", () => {
      selectedMiniType = key;
      resetMiniState();
      renderMiniTypeGrid();
    });
    miniTypeGrid.appendChild(btn);
  });
}
renderMiniTypeGrid();

function getMiniConceptText() {
  const extra = miniConceptInput.value.trim();
  const base = characterSeed || "";
  if (base && extra) return `${base}\n추가 테마 설명: ${extra}`;
  if (base) return base;
  if (extra) return `[테마]\n${extra}`;
  return `[테마]\n특별한 설정 없음, 귀엽고 단순한 느낌`;
}

/* ---- 테마 입력 시 그 테마에 맞는 42개 아이템 리스트를 AI가 직접 구성 ---- */
async function buildThemedItemList(typeKey, theme) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) throw new Error("API 키를 입력해주세요");

  const typeGuide = {
    object: "캐릭터 없이 그 테마와 관련된 귀여운 '사물/오브젝트' 이름들 (예: 테마가 캠핑이면 텐트, 랜턴, 코펠 등)",
    text: "그 테마와 관련된 짧은 한글 단어/감탄사 (예: 테마가 헬스면 '오운완', '벌크업', '단백질' 등 1~4글자 단어)",
    character: "그 테마에 맞는 캐릭터의 작은 표정/리액션 라벨 (예: '기쁜 표정', '졸린 표정') + 어울리는 장식 기호 몇 개",
    shape: "그 테마 색감/분위기에 맞는 도형, 숫자, 화살표, 기호 라벨"
  };

  const promptText = `너는 카카오 미니이모티콘 기획자야. 아래 테마에 맞는 미니이모티콘 항목 라벨을 정확히 42개 만들어줘.

테마: "${theme}"
타입: ${typeGuide[typeKey]}

규칙:
- 42개 전부 이 테마 하나로 통일된, 서로 어울리는 항목들이어야 해 (관련 없는 항목 섞지 마)
- 각 라벨은 반드시 단일 사물/단어/표정 하나만 가리켜야 해. "텐트와 랜턴"처럼 여러 개를 묶어서 표현하지 마
- 각 라벨은 짧은 한글 단어/구절로, 2~10자 내외
- 중복 없이 다양하게
- 결과는 반드시 JSON 배열 형식으로만 응답해. 다른 설명이나 마크다운 코드블록 없이 ["항목1","항목2",...] 형태로만.`;

  const res = await fetch(API_URL(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { responseModalities: ["TEXT"] }
    })
  });

  if (!res.ok) throw new Error(`테마 리스트 생성 실패 (HTTP ${res.status})`);

  const data = await res.json();
  const textPart = (data?.candidates?.[0]?.content?.parts || []).find(p => p.text);
  if (!textPart) throw new Error("테마 리스트를 받지 못했어요");

  const cleaned = textPart.text.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("리스트 형식을 해석하지 못했어요");

  const list = JSON.parse(match[0]);
  if (!Array.isArray(list) || list.length === 0) throw new Error("빈 리스트가 반환됐어요");

  // 42개로 맞추기 (부족하면 기본 리스트에서 보충, 넘치면 자르기)
  let result = list.slice(0, 42).map(String);
  if (result.length < 42) {
    const fallback = MINI_TYPES[typeKey].items;
    let i = 0;
    while (result.length < 42 && i < fallback.length) {
      if (!result.includes(fallback[i])) result.push(fallback[i]);
      i++;
    }
  }
  return result;
}

async function generateMiniItem(label) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) throw new Error("API 키를 입력해주세요");

  const concept = getMiniConceptText();
  const charRefB64 = charImageBase64 || autoReferenceBase64;
  const charRefMime = charImageMime || autoReferenceMime;

  let typeInstruction = "";
  let useCharRef = false;

  if (selectedMiniType === "object") {
    typeInstruction = `이건 "사물/오브젝트 모음형" 미니이모티콘이야. 캐릭터를 그리지 말고, "${label}" 자체를 귀엽고 단순한 라인+컬러 일러스트로 그려줘. 세트 전체가 하나의 화풍(같은 선 두께, 같은 색감 톤)으로 통일돼야 해.`;
  } else if (selectedMiniType === "text") {
    typeInstruction = `이건 "한글자·단어 텍스트형" 미니이모티콘이야. 그림이 아니라 한글 글자/단어 "${label}" 자체를 그래픽 타이포그래피로 디자인해줘. 글자가 화면의 메인 비주얼이고, 필요하면 아주 작은 장식(테두리, 그림자, 색 배경)만 더해. 글자는 크고 명확하게 한눈에 읽혀야 해.`;
  } else if (selectedMiniType === "character") {
    typeInstruction = label.includes("얼굴") || label.includes("표정")
      ? `이건 캐릭터의 얼굴만 아주 작게 표현하는 표정 아이콘이야. 몸 전체를 그릴 필요 없고, 표정 자체가 한눈에 읽혀야 해. 매번 똑같은 캐릭터처럼 보이도록 얼굴형, 색, 특징을 통일해.`
      : `이건 캐릭터 없이 쓰이는 순수 장식/효과 기호야. 캐릭터를 억지로 넣지 말고, 테마의 색감/화풍 톤만 맞춰서 기호 자체를 그려줘.`;
    useCharRef = true;
  } else if (selectedMiniType === "shape") {
    typeInstruction = `이건 "도형·숫자 채팅꾸미기형" 미니이모티콘이야. "${label}"을 심플한 도형/숫자/기호로, 패턴이 있는 배경이나 단색 배경의 작은 뱃지 형태로 그려줘. 세트 전체가 통일된 색 팔레트(2~3가지 포인트 컬러)를 써야 해.`;
  }

  const hasStyleRef = !!miniStyleRefBase64;
  const styleRefInstruction = hasStyleRef
    ? `\n\n중요: 함께 첨부한 이미지는 이 세트의 첫 번째로 완성된 항목이야. 색감, 선 굵기, 톤, (텍스트형이면 폰트 디자인까지) 반드시 이 이미지와 동일한 스타일을 유지해서 그려줘. 세트 전체가 같은 시리즈처럼 보여야 해.`
    : "";

  const promptText = `카카오 "미니 이모티콘" 스타일의 아주 작고 단순한 아이콘 하나를 그려줘.
미니 이모티콘은 32컷 스티커와 완전히 다른 컨셉이야 — 카톡 말풍선 안에서 텍스트와 함께 작게 쓰이는 거라서 디테일을 극도로 최소화하고 한눈에 알아볼 수 있게 그려야 해.

이번에 그릴 항목: "${label}"

${typeInstruction}

${concept}

${STYLE_GUIDE}${styleRefInstruction}

규칙:
- 정사각형 1:1 비율, 배경은 완전 투명 또는 순수 흰색
- 32컷 스티커보다 훨씬 더 단순하고 작게 봐도 알아볼 수 있을 정도로 디테일을 극도로 절제
- 세트 내 다른 항목들과 일관된 화풍/색감을 반드시 유지
- 매우 중요: 캔버스 안에는 "${label}" 단 하나의 사물/글자/캐릭터만 그려. 여러 개의 사물을 한 화면에 나열하거나, 콜라주·무드보드처럼 여러 아이템을 모아 그리지 마. 예를 들어 항목이 "텐트"라면 텐트 하나만 그리고, 랜턴이나 모닥불 같은 다른 사물을 같이 넣지 마.`;

  const parts = [{ text: promptText }];
  // 스타일 기준 이미지가 있으면 최우선으로 그걸 레퍼런스로 사용 (없을 때만 캐릭터 업로드 이미지 사용)
  if (hasStyleRef) {
    parts.push({ inline_data: { mime_type: miniStyleRefMime, data: miniStyleRefBase64 } });
  } else if (useCharRef && charRefB64) {
    parts.push({ inline_data: { mime_type: charRefMime, data: charRefB64 } });
  }

  let res;
  try {
    res = await fetch(API_URL(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
      })
    });
  } catch (networkErr) {
    throw new Error(`네트워크 오류: ${networkErr.message}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 오류 (HTTP ${res.status})\n${errText.slice(0, 500)}`);
  }

  const data = await res.json();
  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) throw new Error(`요청이 차단됐어요 (사유: ${blockReason})`);

  const cParts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = cParts.find(p => p.inlineData || p.inline_data);
  if (!imgPart) {
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(`이미지를 받지 못했어요 (finishReason: ${finishReason || "알 수 없음"})`);
  }
  const inline = imgPart.inlineData || imgPart.inline_data;
  return { base64: inline.data, mime: inline.mimeType || inline.mime_type || "image/png" };
}

function buildMiniGrid() {
  miniGrid.innerHTML = "";
  currentMiniItems.forEach((label, i) => {
    const cell = document.createElement("div");
    cell.className = "cell pending";
    cell.id = `mini-cell-${i}`;
    cell.innerHTML = `
      <div class="cell-img">대기중</div>
      <div class="cell-label">${i + 1}. ${label}</div>
    `;
    miniGrid.appendChild(cell);
  });
}

async function renderMiniCellResult(i, result) {
  const cell = document.getElementById(`mini-cell-${i}`);
  const imgBox = cell.querySelector(".cell-img");
  cell.classList.remove("pending", "error");
  const url = `data:${result.mime};base64,${result.base64}`;
  imgBox.innerHTML = `<img src="${url}" alt="${currentMiniItems[i]}">`;
  if (!cell.querySelector(".cell-dl")) {
    const dl = document.createElement("div");
    dl.className = "cell-dl";
    dl.textContent = "PNG 저장";
    dl.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `mini_${String(i + 1).padStart(2, "0")}_${currentMiniItems[i].replace(/\s+/g, "_")}.png`;
      a.click();
    });
    cell.appendChild(dl);
  }
}

async function generateMiniRange(startIndex, endIndexExclusive) {
  if (!apiKeyInput.value.trim()) {
    alert("먼저 상단에 Gemini API 키를 입력하고 저장해주세요.");
    return;
  }
  generateMiniBtn.disabled = true;
  generateMiniRestBtn.disabled = true;
  downloadMiniZipBtn.disabled = true;

  const total = endIndexExclusive - startIndex;
  let done = 0;
  miniGenStatus.textContent = `생성 중... 0 / ${total}`;

  // 첫 항목을 먼저 단독 생성해서 스타일 기준으로 고정 (일관성 확보)
  let cursor = startIndex;
  if (startIndex === 0 && !miniStyleRefBase64) {
    const cell0 = document.getElementById(`mini-cell-0`);
    try {
      const r0 = await generateMiniItem(currentMiniItems[0]);
      miniResults[0] = r0;
      miniStyleRefBase64 = r0.base64;
      miniStyleRefMime = r0.mime;
      await renderMiniCellResult(0, r0);
    } catch (e) {
      cell0.classList.remove("pending");
      cell0.classList.add("error");
      cell0.querySelector(".cell-img").textContent = "실패";
      cell0.title = e.message;
      console.error(`[mini 0]`, e);
    }
    done++;
    cursor = 1;
    miniGenStatus.textContent = `생성 중... ${done} / ${total}`;
  }

  const CONCURRENCY = 3;

  async function worker() {
    while (cursor < endIndexExclusive) {
      const i = cursor++;
      const cell = document.getElementById(`mini-cell-${i}`);
      try {
        const r = await generateMiniItem(currentMiniItems[i]);
        miniResults[i] = r;
        await renderMiniCellResult(i, r);
      } catch (e) {
        cell.classList.remove("pending");
        cell.classList.add("error");
        cell.querySelector(".cell-img").textContent = "실패";
        cell.title = e.message;
        console.error(`[mini ${i}] ${currentMiniItems[i]}`, e);
      }
      done++;
      miniGenStatus.textContent = `생성 중... ${done} / ${total}`;
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, worker);
  await Promise.all(workers);

  const successCount = miniResults.filter(Boolean).length;
  miniGenStatus.textContent = `완료! ${successCount} / ${currentMiniItems.length}`;
  generateMiniBtn.disabled = false;
  downloadMiniZipBtn.disabled = successCount === 0;
}

async function startMiniPreview() {
  const theme = miniConceptInput.value.trim();

  if (!apiKeyInput.value.trim()) {
    alert("먼저 상단에 Gemini API 키를 입력하고 저장해주세요.");
    return;
  }

  generateMiniBtn.disabled = true;

  if (theme) {
    generateMiniBtn.textContent = "테마 분석 중...";
    try {
      currentMiniItems = await buildThemedItemList(selectedMiniType, theme);
      miniResults = new Array(currentMiniItems.length).fill(null);
    } catch (e) {
      console.error(e);
      miniGenStatus.textContent = `테마 리스트 생성 실패, 기본 리스트로 진행합니다 (${e.message})`;
      currentMiniItems = MINI_TYPES[selectedMiniType].items.slice();
      miniResults = new Array(currentMiniItems.length).fill(null);
    }
  } else {
    currentMiniItems = MINI_TYPES[selectedMiniType].items.slice();
    miniResults = new Array(currentMiniItems.length).fill(null);
  }

  miniStyleRefBase64 = null;
  miniStyleRefMime = null;

  buildMiniGrid();
  generateMiniBtn.textContent = "예시 생성 중...";
  await generateMiniRange(0, MINI_PREVIEW_COUNT);
  generateMiniBtn.classList.add("hidden");
  generateMiniRestBtn.classList.remove("hidden");
  generateMiniRestBtn.disabled = false;
}
generateMiniBtn.addEventListener("click", startMiniPreview);

generateMiniRestBtn.addEventListener("click", async () => {
  generateMiniRestBtn.textContent = "나머지 생성 중...";
  await generateMiniRange(MINI_PREVIEW_COUNT, currentMiniItems.length);
  generateMiniRestBtn.classList.add("hidden");
});

downloadMiniZipBtn.addEventListener("click", async () => {
  const zip = new JSZip();
  zip.file("concept.txt", `타입: ${MINI_TYPES[selectedMiniType].name}\n테마: ${miniConceptInput.value.trim() || "(기본)"}\n\n${getMiniConceptText()}`);
  miniResults.forEach((r, i) => {
    if (r) {
      const num = String(i + 1).padStart(2, "0");
      const name = currentMiniItems[i].replace(/\s+/g, "_");
      const ext = (r.mime && r.mime.includes("png")) ? "png" : "jpg";
      zip.file(`${num}_${name}.${ext}`, r.base64, { base64: true });
    }
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mini_emoticons.zip";
  a.click();
  URL.revokeObjectURL(url);
});

randomMiniConceptBtn.addEventListener("click", pickRandomMiniConcept);
