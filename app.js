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

const tabBtnGpt = document.getElementById("tabBtnGpt");
const tabGpt = document.getElementById("tabGpt");

function activateTab(name) {
  tabBtnSticker.classList.toggle("active", name === "sticker");
  tabBtnMini.classList.toggle("active", name === "mini");
  tabBtnGpt.classList.toggle("active", name === "gpt");
  tabSticker.classList.toggle("hidden", name !== "sticker");
  tabMini.classList.toggle("hidden", name !== "mini");
  tabGpt.classList.toggle("hidden", name !== "gpt");
  if (name === "mini") updateMiniConceptStatus();
  if (name === "gpt") updateGptConceptStatus();
}
tabBtnSticker.addEventListener("click", () => activateTab("sticker"));
tabBtnMini.addEventListener("click", () => activateTab("mini"));
tabBtnGpt.addEventListener("click", () => activateTab("gpt"));

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
  },
  parts: {
    icon: "🧩",
    name: "캐릭터 파츠 조합형",
    desc: "얼굴·몸통·팔다리를 따로 그려서 사용자가 직접 조합하는 실제 인기 패턴",
    items: [
      "정면 기본 얼굴", "활짝 웃는 얼굴", "윙크하는 얼굴", "놀란 얼굴", "삐친 얼굴", "졸린 얼굴",
      "곤히 자는 얼굴", "하트눈 얼굴", "당황한 얼굴", "시크한 옆모습 얼굴", "우는 얼굴", "무표정 얼굴",
      "양팔 벌린 몸통", "팔짱 낀 몸통", "엎드린 몸통", "앉아있는 몸통", "기지개 켜는 몸통", "웅크린 몸통",
      "걷는 다리", "뛰는 다리", "한쪽 다리 든 다리", "쪼그려 앉은 다리", "다리 꼬고 서있는 다리", "점프하는 다리",
      "손 흔드는 팔", "박수치는 손", "브이하는 손", "엄지척 손", "하트 만드는 손", "거수경례하는 손",
      "우산 든 손", "커피컵 든 손", "휴대폰 든 손", "꽃다발 든 손", "풍선 든 손", "책 든 손",
      "리본 머리장식", "안경", "모자", "목도리", "왕관 장식", "효과음 말풍선(반짝/땀)"
    ]
  },
  weather: {
    icon: "🌤",
    name: "날씨·시간·계절형",
    desc: "해/구름/비/눈/시계처럼 날씨와 시간 흐름을 표현하는 위젯형 아이콘",
    items: [
      "맑은 해", "구름 낀 해", "흐린 구름", "비구름", "천둥번개", "소나기",
      "무지개", "눈구름", "함박눈", "진눈깨비", "안개", "강풍",
      "초승달", "그믐달", "보름달", "반달", "별이 빛나는 밤하늘", "별똥별",
      "일출", "일몰", "노을", "아침 안개", "한낮 햇살", "밤하늘",
      "봄 벚꽃", "여름 장마", "가을 단풍", "겨울 첫눈", "황사", "미세먼지 마스크",
      "온도계(더움)", "온도계(추움)", "우산", "장화", "에어컨", "히터",
      "벽시계", "모래시계", "알람시계", "달력 한장", "해바라기시계", "나침반"
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
    "학교/학생 준비물 (책가방, 필통, 시간표, 칠판)", "베이커리 빵 모음 (크루아상, 식빵, 도넛, 베이글)",
    "분식집 메뉴 모음 (떡볶이, 순대, 튀김, 어묵)", "한식 밥상 소품 (밥그릇, 젓가락, 김치, 된장찌개)",
    "야시장/포장마차 소품 (붕어빵, 호떡, 오뎅, 포차 등불)", "주방 살림 소품 (냄비, 도마, 앞치마, 뒤집개)",
    "목욕탕/사우나 소품 (수건, 때밀이장갑, 바가지, 식혜)", "낚시 용품 (낚싯대, 미끼통, 물고기, 아이스박스)",
    "정원가꾸기 소품 (모종삽, 물뿌리개, 장갑, 화분)", "헬스장 용품 (아령, 짐볼, 운동화, 단백질쉐이크)",
    "비오는 날 소품 (장화, 우산, 빗방울, 물웅덩이)", "가을 단풍 소품 (낙엽, 밤, 호박, 은행잎)",
    "봄맞이 청소 소품 (빗자루, 걸레, 분무기, 먼지떨이)", "전자기기/IT 소품 (노트북, 마우스, 충전기, 헤드셋)",
    "축구/스포츠 경기 소품 (축구공, 호루라기, 트로피, 운동화)", "베트남/동남아 여행 소품 (쌀국수, 코끼리, 야자수, 모자)",
    "일본 여행 소품 (스시, 도리이, 벚꽃, 라멘)", "유럽 여행 소품 (에펠탑, 크로와상, 풍차, 자전거)",
    "반려동물 용품 (사료그릇, 목줄, 장난감, 캣타워)", "공룡/쥬라기 소품 (공룡알, 화석, 발자국, 나뭇잎)",
    "마법사/판타지 소품 (마법지팡이, 물약병, 책, 모자)", "해적/바다모험 소품 (보물상자, 닻, 나침반, 해골깃발)",
    "병아리콩/비건 식재료 모음", "전통시장 소품 (장바구니, 저울, 채소, 생선)",
    "온천여행 소품 (온천계란, 유카타, 노천탕, 수건)", "분재/한옥 정원 소품 (분재, 돌담, 연못, 처마)",
    "사진관/필름카메라 소품 (필름카메라, 폴라로이드, 인화지, 삼각대)", "야구장 직관 소품 (응원봉, 치킨, 모자, 글러브)",
    "동물병원/펫시터 소품 (체온계, 약, 붕대, 청진기)", "비행기 여행 소품 (여권, 탑승권, 목베개, 캐리어)",
    "오피스 책상 소품 (모니터, 키보드, 머그컵, 메모지)", "신혼/웨딩 소품 (부케, 반지, 청첩장, 웨딩케이크)",
    "할로윈 소품 (호박등, 마녀모자, 거미줄, 사탕)", "발렌타인/화이트데이 소품 (초콜릿, 사탕, 장미, 편지)",
    "여름축제/불꽃놀이 소품 (불꽃놀이, 부채, 평상, 수박)", "스키장 리조트 소품 (곤돌라, 핫팩, 고글, 눈사람)",
    "독서실/스터디카페 소품 (스톱워치, 형광펜, 귀마개, 텀블러)", "한강피크닉 소품 (돗자리, 치킨, 자전거, 블루투스스피커)",
    "문방구/완구점 소품 (딱지, 구슬, 뽑기캡슐, 장난감로봇)", "편의점 소품 (삼각김밥, 컵라면, 아이스컵, 바코드)",
    "베란다/홈가드닝 소품 (텃밭상자, 호스, 화분받침, 새모이통)", "수족관/아쿠아리움 소품 (어항, 산호초, 열대어, 잠수부피규어)",
    "골프 라운딩 소품 (골프공, 티, 카트, 우승컵)", "테니스/배드민턴 소품 (라켓, 셔틀콕, 네트, 스코어보드)",
    "사무실 탕비실 소품 (믹스커피, 정수기, 종이컵, 비타민)", "이사/포장이사 소품 (박스테이프, 뽁뽁이, 사다리차, 라벨지)",
    "영화관 데이트 소품 (팝콘, 3D안경, 티켓, 콜라)", "노래방 소품 (마이크, 탬버린, 미러볼, 점수판)",
    "전통차/티타임 소품 (찻주전자, 다과, 부채, 방석)", "마라톤/러닝크루 소품 (운동화, 번호표, 메달, 물병)",
    "스킨스쿠버/물놀이 소품 (오리발, 산소통, 물안경, 구명조끼)", "캠퍼 밴라이프 소품 (캠핑카, 접이식의자, 화로대, 별자리)",
    "분식 야식 배달 소품 (배달가방, 영수증, 젓가락, 단무지)", "겨울 군밤/붕어빵 노점 소품 (군밤, 호빵, 화로, 종이봉투)",
    "새학기 신학기 준비물 (새가방, 새신발, 입학식, 명찰)", "졸업식 소품 (학사모, 꽃다발, 졸업장, 카네이션)",
    "도시락/소풍 소품 (도시락통, 보온병, 깔개, 김밥)", "다육식물/원예 소품 (분갈이흙, 미니삽, 라벨핀, 화분망)",
    "공방/DIY 소품 (글루건, 비즈, 실타래, 가위)", "전통 한옥스테이 소품 (한지창, 화로, 차상, 댓돌)"
  ],
  text: [
    "헬스/오운완 운동 용어", "직장인 야근·칼퇴 용어", "술자리·회식 용어", "수험생·공시생 용어",
    "학교/학생 용어 (숙제, 급식, 방학, 야자)", "연애/썸 용어", "다이어트 용어",
    "육아맘 용어", "게임 용어 (귀환, 갱, 와드, 풀피)", "자취생 생활 용어",
    "아날로그 손편지 말투 (안녕, 보고싶어, 답장줘)", "신입사원 용어 (출근, 보고, 컨펌, 칼퇴)",
    "MZ세대 신조어 (갓생, 인싸, 갈비, 핫플)", "사투리 감탄사 (아이고, 우야노, 오메, 거시기)",
    "운세/사주 용어 (대길, 길운, 액땜, 운수대통)", "택배/배송 용어 (배송중, 도착완료, 빠른배송, 새벽배송)",
    "주식/재테크 용어 (떡상, 손절, 존버, 익절)", "응원/팬심 용어 (최애, 입덕, 직캠, 떼창)",
    "명절/연휴 인사말 (새해복많이받으세요, 풍성한한가위, 즐거운명절)", "출산/육아 축하 용어 (백일, 돌잔치, 순풍, 무럭무럭)",
    "동아리/모임 용어 (정모, 번개, 총무, 회비)", "캠퍼스 라이프 용어 (학식, 과제, 종강, 출첵)",
    "반려동물 집사 용어 (츄르, 산책, 간식, 까꿍)", "퇴사/이직 용어 (탈출, 사직서, 이직성공, 자유)",
    "연말정산/세금 용어 (환급, 13월의월급, 절세, 정산완료)", "K-드라마 명대사 느낌 단어 (어쩌라고, 진심이야, 두고봐)",
    "응급/위로 멘트 (힘내, 괜찮아, 토닥토닥, 같이가자)", "축구/응원 구호 (대한민국, 골, 파이팅, 짜릿)",
    "결혼식 축하 용어 (축하해, 백년해로, 행복해라, 잘살아)", "이사/집들이 용어 (집들이, 새출발, 이사축하, 따뜻한집)",
    "친구 단톡방 드립 (ㅇㅋ, ㄱㄱ, 안물안궁, 레전드)", "콜센터/고객응대 용어 (확인해드릴게요, 죄송합니다, 잠시만요, 감사합니다)",
    "병원/약국 용어 (얼른나아요, 푹쉬세요, 약챙겨드세요, 쾌차)", "여행 인사말 (잘다녀와, 안전여행, 좋은추억, 행복한여행)",
    "시험/합격 응원 (합격기원, 화이팅, 끝까지, 행운을빌어)", "K-팝 팬덤 용어 (영업성공, 컴백, 떼창, 입덕부정기)",
    "회의/업무 보고 용어 (수고하셨습니다, 검토중, 확인했습니다, 회의시작)", "온라인 쇼핑 용어 (장바구니, 품절임박, 무료배송, 적립금)",
    "운동회/체육대회 구호 (이겨라, 청군이겨라, 화이팅, 우승)", "팀플/조별과제 용어 (분담완료, 마감임박, 단톡확인, 발표준비)",
    "헬스장 PT 용어 (3대500, 벌크업, 근손실, 단백질)", "반려식물 집사 용어 (물줄게, 햇빛욕, 새잎돋음, 분갈이)",
    "온라인 강의 용어 (출석체크, 과제제출, 줌접속, 강의시작)"
  ],
  character: [
    "고양이 집사 일상 표정", "곰돌이 직장인 리액션", "강아지 댕댕이 표정",
    "토끼 학생 리액션", "병아리 신입사원 표정", "햄스터 자취생 표정",
    "여우 영업직 리액션", "판다 헬스인 표정", "펭귄 백수 일상 표정",
    "양 명상/요가인 표정", "곰 캠핑러 표정", "다람쥐 다이어터 표정",
    "수달 직장맘 표정", "고슴도치 내향인 표정", "알파카 무기력 일상 표정",
    "오리 유치원 선생님 표정", "너구리 장난꾸러기 표정", "올빼미 야근러 표정",
    "거북이 느긋한 은퇴자 표정", "문어 멀티태스킹 직장인 표정", "사슴 감성러 표정",
    "두더지 집순이 표정", "코알라 무기력 직장인 표정", "앵무새 수다쟁이 표정",
    "물범 게으름뱅이 표정", "여우원숭이 텐션높은 인싸 표정", "거미 부지런한 N잡러 표정",
    "호랑이 단호한 팀장 표정", "사자 허세있는 리더 표정", "곰돌이 새내기 집사 표정",
    "토끼 츤데레 표정", "고양이 집순이 무기력 표정", "강아지 흥분 잘하는 막내 표정",
    "병아리 졸업생 표정", "다람쥐 도토리 모으는 자린고비 표정", "햄스터 야식러버 표정"
  ],
  shape: [
    "채팅 꾸미기용 도형/숫자", "마스킹테이프 콜라주풍 도형", "색종이 공작풍 도형/숫자",
    "버블레터(통통한 폰트) 알파벳", "필름 사진 프레임 모양 도형",
    "네온사인 간판풍 도형/숫자", "도장/스탬프풍 도형", "리본/배지 모양 장식 도형",
    "픽셀아트풍 도형/숫자", "손그림 낙서풍 화살표·체크", "야광 형광펜 밑줄/강조 도형",
    "압화(말린 꽃)풍 장식 도형", "캘린더/다이어리 마크용 도형", "졸업장/상장풍 리본 도형",
    "영수증/티켓풍 직사각 도형", "퍼즐조각 모양 도형", "지퍼백/포장지 라벨풍 도형",
    "보석/원석 컷팅 모양 도형", "낙서장 별표/하트 강조 도형", "신호등/표지판풍 도형",
    "완료 체크 도장풍 도형 (승인, 완료, 검토중 뱃지)", "단추/패치 모양 도형", "타일/모자이크 패턴 도형",
    "캔디/사탕 포장지 모양 도형", "엽서 우표풍 도형", "교통표지판풍 화살표/금지 도형",
    "말풍선 모양 변형 도형 (구름, 톱니, 별 모양 말풍선)", "리듬게임 노트바풍 도형"
  ],
  parts: [
    "직장인 캐릭터 파츠 (정장, 넥타이, 서류가방 든 손)", "학생 캐릭터 파츠 (교복, 책가방, 안경)",
    "운동선수 캐릭터 파츠 (운동복, 운동화, 땀방울 효과)", "헬스인 캐릭터 파츠 (탱크탑, 아령 든 손, 근육)",
    "댄서 캐릭터 파츠 (다양한 춤 동작 다리, 음표 효과)", "요리사 캐릭터 파츠 (앞치마, 조리도구 든 손, 모자)",
    "여행자 캐릭터 파츠 (캐리어 든 손, 선글라스, 모자)", "겨울옷 캐릭터 파츠 (패딩, 목도리, 장갑 낀 손)",
    "여름옷 캐릭터 파츠 (반팔, 부채 든 손, 선크림)", "산타/연말 캐릭터 파츠 (산타모자, 선물자루, 종)",
    "신랑신부 캐릭터 파츠 (웨딩드레스, 턱시도, 부케 든 손)", "마법사 캐릭터 파츠 (망토, 지팡이 든 손, 마법모자)",
    "경찰/소방관 캐릭터 파츠 (제복, 모자, 호루라기)", "요가인 캐릭터 파츠 (다양한 요가 자세 몸통/다리)"
  ],
  weather: [
    "장마철 우산쓰기 시리즈", "한여름 폭염 시리즈 (선풍기, 부채, 아이스크림)",
    "겨울 한파 시리즈 (눈사람, 핫팩, 모닥불)", "봄꽃 개화 시리즈 (벚꽃, 새싹, 나비)",
    "가을 단풍 절기 시리즈 (낙엽, 보름달, 추수)", "태풍/황사 주의 시리즈",
    "별자리/우주 밤하늘 시리즈", "해와 달의 하루 흐름 시리즈 (새벽~밤)",
    "비 오는 날 감성 시리즈 (우산, 장화, 물웅덩이, 무지개)", "눈 내리는 날 감성 시리즈 (눈송이, 눈사람, 썰매)",
    "사계절 온도계 시리즈", "절기(입춘, 하지, 동지 등) 아이콘 시리즈"
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
  "굵은 사인펜으로 쓱쓱 그린 듯한 손그림풍",
  "크레파스로 칠한 듯한 까슬한 질감",
  "젤리/말랑말랑한 광택이 있는 입체 느낌",
  "흑백 + 빨간색 포인트 하나만 들어간 투톤",
  "도트(픽셀) 그래픽풍",
  "동화책 삽화풍의 따뜻한 색연필 질감",
  "빈티지 인쇄물처럼 살짝 색이 어긋난 인쇄톤",
  "홀로그램/펄 광택이 도는 영롱한 색감",
  "스테인드글라스처럼 굵은 검은 테두리 + 채도 높은 색면",
  "흑백 목판화/리노컷 느낌의 거친 질감",
  "크림/생크림처럼 몽글몽글한 파스텔 입체 아이싱 느낌",
  "야광/형광 잉크가 살짝 번진 듯한 느낌",
  "옛날 만화책(망점 인쇄) 느낌",
  "자수/패브릭 패치 느낌",
  "수묵화풍의 먹색 번짐 (동양화 느낌)",
  "샤프펜으로 그린 듯한 연필 스케치 + 옅은 채색",
  "유리병 속 미니어처처럼 동그란 입체감",
  "크레파스 + 흰색 크레용 하이라이트의 어린이 그림책 느낌",
  "그라데이션이 부드럽게 들어간 산뜻한 톤",
  "올드 필름 사진처럼 살짝 누렇게 바랜 색감",
  "반짝이 가루를 뿌린 듯한 글리터 포인트",
  "두꺼운 마커로 채색한 듯한 평면적 컬러링",
  "패턴 배경(물방울/줄무늬)이 살짝 깔린 느낌",
  "한지/전통 종이 질감이 느껴지는 색감",
  "비누/석고방향제처럼 매트하고 부드러운 질감",
  "야간 형광 스티커처럼 어두운 배경에 빛나는 컬러",
  "Y2K 느낌의 크롬/메탈릭 광택 컬러",
  "키치한 카카오 인기작 스타일의 단순 병맛 라인드로잉",
  "투박한 고무도장으로 꾹 찍은 듯한 단색 스탬프 질감",
  "유광 스티커처럼 반짝이는 비닐 코팅 느낌",
  "크레용으로 덧칠한 듯 거친 채색 경계",
  "베이비핑크/베이비블루 위주의 폭신폭신한 유아용품 톤",
  "흑백 사진 콜라주 + 손글씨 메모가 더해진 다이어리 톤",
  "곡선 위주의 말랑한 3D 이모지풍 (애플/구글 이모지 느낌 단, 저작권 캐릭터 모방 금지)",
  "옅은 그레이 배경 위에 파스텔 컬러가 떠 있는 카드뉴스풍",
  "투명 비닐 파우치 안에 들어있는 듯한 글로시 입체감",
  "흑요석처럼 어둡고 매끈한 무채색 베이스 + 포인트 컬러 1개",
  "오래된 종이 질감의 세피아톤 일러스트",
  "동전/메달처럼 양각 음각이 있는 금속 엠보싱 느낌"
];

const MINI_DETAIL_TWISTS = [
  "가끔 한두 개에만 작은 반짝임 효과를 더해줘",
  "전체적으로 살짝 기울어지거나 삐뚤빼뚤한 손맛을 살려줘",
  "테두리에 점선 느낌의 스티치(바느질) 라인을 더해줘",
  "그림자 대신 아주 옅은 색 번짐만 깔아줘",
  "몇 개는 작은 리본이나 별 장식을 곁들여줘",
  "전체적으로 약간 통통하고 둥글둥글한 실루엣으로 그려줘",
  "배경에 아주 옅은 색 동그라미를 깔아 도장처럼 보이게 해줘",
  "선 두께를 항목마다 살짝 다르게 해서 손그림 느낌을 살려줘",
  "한쪽 모서리가 살짝 접힌 종이 같은 입체감을 더해줘",
  "전체적으로 미니멀하게, 디테일을 한 단계 더 줄여줘",
  "몇 개는 반쯤 가려지거나 잘린 구도로 그려서 생동감을 줘",
  "색을 2가지로만 제한해서 더 강렬하게 통일해줘"
];

// 25% 확률로 디테일 트위스트 없이 깔끔하게 (너무 과하지 않도록)
function pickRandomDetailTwist() {
  if (Math.random() < 0.25) return "";
  return MINI_DETAIL_TWISTS[Math.floor(Math.random() * MINI_DETAIL_TWISTS.length)];
}

function rollRandomMiniConcept() {
  const types = Object.keys(MINI_THEMES);
  const type = types[Math.floor(Math.random() * types.length)];
  const themeList = MINI_THEMES[type];
  const theme = themeList[Math.floor(Math.random() * themeList.length)];
  const mood = MINI_STYLE_MOODS[Math.floor(Math.random() * MINI_STYLE_MOODS.length)];
  const twist = pickRandomDetailTwist();

  // 40% 확률로 같은 타입의 다른 테마 하나를 더 섞어서 더 독특한 컨셉을 뽑음
  let themeText = theme;
  if (themeList.length > 1 && Math.random() < 0.4) {
    let theme2 = theme;
    while (theme2 === theme) {
      theme2 = themeList[Math.floor(Math.random() * themeList.length)];
    }
    themeText = `${theme} + ${theme2}을(를) 살짝 섞은 컨셉`;
  }

  let text = `${themeText}. 화풍은 ${mood}으로.`;
  if (twist) text += ` ${twist}.`;

  return { type, text };
}

function pickRandomMiniConcept() {
  const picked = rollRandomMiniConcept();
  selectedMiniType = picked.type;
  miniConceptInput.value = picked.text;
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
    shape: "그 테마 색감/분위기에 맞는 도형, 숫자, 화살표, 기호 라벨",
    parts: "그 테마의 캐릭터를 사용자가 직접 조합해서 쓸 수 있도록 '얼굴 표정', '몸통 자세', '다리/팔 동작', '손에 든 소품', '장식 아이템' 라벨로 나눠서 (예: '윙크하는 얼굴', '팔짱 낀 몸통', '걷는 다리', '커피컵 든 손', '리본 머리장식')",
    weather: "그 테마와 어울리는 날씨/시간대/계절/온도 관련 라벨 (예: '맑은 해', '소나기', '초승달', '봄 벚꽃', '온도계')"
  };

  const promptText = `너는 카카오 미니이모티콘 기획자야. 아래 테마에 맞는 미니이모티콘 항목 라벨을 정확히 42개 만들어줘.

테마: "${theme}"
타입: ${typeGuide[typeKey]}

규칙:
- 42개 전부 이 테마 하나로 통일된, 서로 어울리는 항목들이어야 해 (관련 없는 항목 섞지 마)
- 각 라벨은 반드시 단일 사물/단어/표정/파츠 하나만 가리켜야 해. "텐트와 랜턴"처럼 여러 개를 묶어서 표현하지 마
- 각 라벨은 짧은 한글 단어/구절로, 2~10자 내외
- 중복되거나 의미가 거의 같은 라벨(예: "기쁜 얼굴"과 "행복한 얼굴")은 넣지 말고, 서로 확실히 구별되게
- 42개 안에서 너무 한쪽으로 쏠리지 않게 다양한 하위 소재를 골고루 섞어줘 (예: 사물형이면 음식/도구/자연물 등 여러 카테고리를 섞기)
- 타입이 "parts"(캐릭터 파츠 조합형)라면 얼굴 표정 약 12개, 몸통 자세 약 8개, 팔다리 동작 약 10개, 손에 든 소품 약 8개, 장식 아이템 약 4개 정도의 비율로 섞어줘
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
  } else if (selectedMiniType === "parts") {
    typeInstruction = `이건 "캐릭터 파츠 조합형" 미니이모티콘이야. "${label}"은 캐릭터 전체가 아니라 캐릭터의 몸 일부(얼굴/몸통/팔/다리/손에 든 소품/장식)만 따로 그리는 거야. 사용자가 나중에 여러 파츠를 자유롭게 겹치거나 나란히 배치해서 조합할 거니까, 다른 파츠와 자연스럽게 이어붙일 수 있도록 캐릭터의 얼굴형·색·비율·외곽선 굵기를 세트 전체에서 정확히 동일하게 유지해줘. 잘려나간 부분(목, 팔이 시작되는 어깨 등)은 부자연스럽지 않게 둥글게 마무리해.`;
    useCharRef = true;
  } else if (selectedMiniType === "weather") {
    typeInstruction = `이건 "날씨·시간·계절형" 미니이모티콘이야. 캐릭터를 그리지 말고, "${label}" 자체를 작고 단순한 날씨/시간/계절 아이콘으로 그려줘. 기상청 픽토그램처럼 딱딱하지 않게, 둥글둥글하고 친근한 마스코트 느낌으로. 세트 전체가 하나의 화풍·색감 톤으로 통일돼야 해.`;
  }

  const hasStyleRef = !!miniStyleRefBase64;
  const styleRefInstruction = hasStyleRef
    ? `\n\n중요: 함께 첨부한 이미지는 이 세트의 첫 번째로 완성된 항목이야. 색감, 선 굵기, 톤, (텍스트형이면 폰트 디자인까지) 반드시 이 이미지와 동일한 스타일을 유지해서 그려줘. 세트 전체가 같은 시리즈처럼 보여야 해.`
    : "";

  const usesCharacterStyleGuide = selectedMiniType === "character" || selectedMiniType === "parts";
  const styleGuideBlock = usesCharacterStyleGuide
    ? STYLE_GUIDE
    : `[그림체 톤 — 반드시 지킬 것]
실제 카카오 미니이모티콘 인기작들처럼, 정교한 컨셉아트가 아니라 작은 채팅창 안에서 한눈에 읽히는 단순한 아이콘이어야 해.
- 외곽선: 굵고 깔끔한 검은색 선 (또는 선 없이 색면만 쓰는 플랫 스타일도 가능, 세트 전체에서 같은 방식으로 통일)
- 디테일: 그림자/입체감/사실적 질감 최소화. 2~5가지 색 위주의 평면적인 컬러링
- 톤: 예쁘고 정교하게 그리려 하지 말고, 살짝 둥글둥글하고 친근한 손맛이 느껴지게
- 절대 사실적인 렌더링, 복잡한 그라데이션, 정밀한 일러스트 느낌으로 가지 마`;

  const promptText = `카카오 "미니 이모티콘" 스타일의 아주 작고 단순한 아이콘 하나를 그려줘.
미니 이모티콘은 32컷 스티커와 완전히 다른 컨셉이야 — 카톡 말풍선 안에서 텍스트와 함께 작게 쓰이는 거라서 디테일을 극도로 최소화하고 한눈에 알아볼 수 있게 그려야 해.

이번에 그릴 항목: "${label}"

${typeInstruction}

${concept}

${styleGuideBlock}${styleRefInstruction}

규칙:
- 정사각형 1:1 비율, 배경은 완전 투명 또는 순수 흰색
- 32컷 스티커보다 훨씬 더 단순하고 작게 봐도 알아볼 수 있을 정도로 디테일을 극도로 절제
- 세트 내 다른 항목들과 일관된 화풍/색감/선 굵기를 반드시 유지 (이전에 그린 항목들과 같은 시리즈처럼 보여야 함)
- 매우 중요: 캔버스 안에는 "${label}" 단 하나의 사물/글자/캐릭터(또는 캐릭터 파츠)만 그려. 여러 개의 사물을 한 화면에 나열하거나, 콜라주·무드보드처럼 여러 아이템을 모아 그리지 마. 예를 들어 항목이 "텐트"라면 텐트 하나만 그리고, 랜턴이나 모닥불 같은 다른 사물을 같이 넣지 마
- 텍스트형이 아닌 이상 글자나 말풍선 텍스트는 절대 넣지 마`;

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

/* ===================== TAB 3: 미니 컨셉만 만들어서 GPT에게 넘기기 ===================== */
const gptTypeGrid = document.getElementById("gptTypeGrid");
const gptThemeInput = document.getElementById("gptThemeInput");
const randomGptConceptBtn = document.getElementById("randomGptConceptBtn");
const gptConceptStatus = document.getElementById("gptConceptStatus");
const buildGptPromptBtn = document.getElementById("buildGptPromptBtn");
const gptBuildStatus = document.getElementById("gptBuildStatus");
const gptOutputBox = document.getElementById("gptOutputBox");
const gptOutputText = document.getElementById("gptOutputText");
const copyGptPromptBtn = document.getElementById("copyGptPromptBtn");
const gptCopyStatus = document.getElementById("gptCopyStatus");

let selectedGptType = "object";

function updateGptConceptStatus() {
  gptConceptStatus.textContent = wizardCompleted
    ? "32컷 탭에서 만든 캐릭터 컨셉을 가져왔어요. ③ 캐릭터 얼굴+장식 혼합형이나 ⑤ 캐릭터 파츠 조합형을 고르면 이 컨셉을 반영해서 프롬프트를 만들어요."
    : "아직 32컷 탭에서 캐릭터 컨셉을 완성하지 않았어요. ③ 캐릭터 얼굴+장식 혼합형이나 ⑤ 캐릭터 파츠 조합형을 고를 거면 먼저 만들어두는 게 좋아요. 다른 타입은 안 만들어도 괜찮아요.";
}

function renderGptTypeGrid() {
  gptTypeGrid.innerHTML = "";
  Object.entries(MINI_TYPES).forEach(([key, t]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mini-type-btn" + (key === selectedGptType ? " selected" : "");
    btn.innerHTML = `<span class="ti">${t.icon}</span>${t.name}<br><span style="font-weight:400;color:var(--gray);font-size:11px;">${t.desc}</span>`;
    btn.addEventListener("click", () => {
      selectedGptType = key;
      renderGptTypeGrid();
    });
    gptTypeGrid.appendChild(btn);
  });
}
renderGptTypeGrid();

randomGptConceptBtn.addEventListener("click", () => {
  const picked = rollRandomMiniConcept();
  selectedGptType = picked.type;
  gptThemeInput.value = picked.text;
  renderGptTypeGrid();
});

const GPT_TYPE_GUIDE = {
  object: `이건 "사물/오브젝트 모음형" 미니이모티콘이야. 캐릭터를 그리지 말고, 각 항목 그 자체를 귀엽고 단순한 라인+컬러 일러스트로 그려줘. 42개 전체가 하나의 화풍(같은 선 두께, 같은 색감 톤)으로 통일돼야 해.`,
  text: `이건 "한글자·단어 텍스트형" 미니이모티콘이야. 그림이 아니라 각 항목의 한글 글자/단어 자체를 그래픽 타이포그래피로 디자인해줘. 글자가 화면의 메인 비주얼이고, 필요하면 아주 작은 장식(테두리, 그림자, 색 배경)만 더해. 글자는 크고 명확하게 한눈에 읽혀야 해.`,
  character: `이건 "캐릭터 얼굴+장식 혼합형" 미니이모티콘이야. "얼굴"/"표정"이 들어간 항목은 캐릭터 얼굴만 아주 작게 표현해(몸 전체 X), 표정 자체가 한눈에 읽혀야 해. 매번 똑같은 캐릭터처럼 보이도록 얼굴형·색·특징을 통일해. 그 외 장식/효과 기호 항목은 캐릭터를 억지로 넣지 말고 같은 화풍·색감으로 기호 자체를 그려.`,
  shape: `이건 "도형·숫자 채팅꾸미기형" 미니이모티콘이야. 각 항목을 심플한 도형/숫자/기호로, 패턴이 있는 배경이나 단색 배경의 작은 뱃지 형태로 그려줘. 42개 전체가 통일된 색 팔레트(2~3가지 포인트 컬러)를 써야 해.`,
  parts: `이건 "캐릭터 파츠 조합형" 미니이모티콘이야. 캐릭터 전체가 아니라 얼굴/몸통/팔/다리/손에 든 소품/장식 같은 몸의 일부만 따로따로 그려줘. 사용자가 나중에 여러 파츠를 자유롭게 겹치거나 나란히 배치해서 조합해서 쓸 거라서, 모든 파츠에서 캐릭터의 얼굴형·색·비율·외곽선 굵기를 정확히 동일하게 유지해야 해. 잘려나간 부분(목, 어깨 등)은 부자연스럽지 않게 둥글게 마무리해.`,
  weather: `이건 "날씨·시간·계절형" 미니이모티콘이야. 캐릭터를 그리지 말고, 각 항목을 작고 단순한 날씨/시간/계절 아이콘으로 그려줘. 기상청 픽토그램처럼 딱딱하지 않게, 둥글둥글하고 친근한 느낌으로. 42개 전체가 하나의 화풍·색감 톤으로 통일돼야 해.`
};

function buildGptPromptText(typeKey, items, theme) {
  const concept = getMiniConceptText();
  const numbered = items.map((label, i) => `${i + 1}. ${label}`).join("\n");
  const hasCharImg = !!charImageBase64;
  const needsCharConsistency = typeKey === "character" || typeKey === "parts";

  return `너는 지금부터 카카오톡 "미니 이모티콘" 세트를 그려주는 일러스트레이터야. 아래 [그릴 항목 리스트]를 순서대로, 항목당 정확히 1장씩 총 ${items.length}장 그려줘.

[진행 방식 — 반드시 이 순서로]
1. 먼저 1번 항목 "${items[0] || ""}" 하나만 그려서 보여줘. 이게 이후 ${items.length - 1}장의 스타일 기준이 될 거야.
2. 내가 1번 결과를 보고 "좋아, 이 스타일로 계속 그려줘"라고 확인하면, 그때부터 2번 항목부터 한 번에 5~6장씩 묶어서 차례로 그려나가줘. (한꺼번에 ${items.length}장을 다 그리려 하면 중간에 품질이나 일관성이 흔들리기 쉬우니 묶어서 진행해줘)
3. 매 배치마다 직전에 그린 이미지들의 선 굵기·색감·캐릭터 비율을 계속 참고해서, 세트 전체가 처음부터 끝까지 같은 시리즈처럼 보이게 유지해줘. 스타일이 흔들린다 싶으면 1번 이미지를 다시 참고해줘.
4. 각 이미지를 줄 때 "N. 항목명" 형식으로 번호와 이름을 같이 표시해줘. (파일로 저장하거나 나중에 ZIP으로 모을 때 구분하기 쉽게)

[타입]
${GPT_TYPE_GUIDE[typeKey]}

[테마/컨셉]
${theme ? `테마: ${theme}\n` : ""}${concept}

[그릴 항목 리스트 — 총 ${items.length}개, 항목당 정확히 1장씩, 리스트 순서를 바꾸지 말 것]
${numbered}

[공통 규칙]
- 정사각형 1:1 비율, 180×180px 기준, 배경은 완전 투명 PNG (불가능하면 순수 흰색 배경)
- 디테일을 극도로 절제해서, 작게 봐도 한눈에 알아볼 수 있을 정도로 단순하게 그려. 정교한 일러스트나 컨셉아트 느낌은 피해줘
- 한 이미지 안에는 그 항목 단 하나만 그려. 여러 사물을 한 화면에 나열하거나 콜라주/무드보드처럼 모아 그리지 마
- 세트 전체(${items.length}개)가 같은 화풍·색감·선 굵기로 통일되어 같은 시리즈처럼 보여야 해
- 카카오 미니이모티콘은 카톡 말풍선 옆에 텍스트와 함께 작게 쓰이는 용도야. 화려하거나 사실적인 렌더링 말고, 둥글둥글하고 친근한 마스코트 느낌으로
- "텍스트형"이 아닌 항목에는 글자나 말풍선 텍스트를 넣지 마
${needsCharConsistency ? "- 캐릭터의 얼굴형·색·비율·외곽선 굵기를 모든 항목에서 정확히 동일하게 유지해줘. 같은 캐릭터가 다른 표정/자세를 짓고 있는 것처럼 보여야 해" : ""}
${typeKey === "parts" ? "- 이건 사용자가 나중에 여러 파츠를 직접 조합해서 쓰는 용도야. 목/어깨/팔이 잘리는 부분을 부자연스럽지 않게 둥글게 마무리하고, 다른 파츠와 자연스럽게 이어붙을 수 있는 각도와 비율로 그려줘" : ""}
${hasCharImg ? "- 이 프롬프트와 함께 캐릭터 레퍼런스 이미지를 첨부할 거야. 그 이미지 속 캐릭터의 얼굴형·색·특징을 기준으로 통일해줘 (이 텍스트만으로는 이미지가 전달되지 않으니, 직접 그 캐릭터 이미지 파일을 함께 첨부해줘)." : ""}

위 안내에 따라 1번 항목부터 시작해줘.`;
}

buildGptPromptBtn.addEventListener("click", async () => {
  const theme = gptThemeInput.value.trim();
  buildGptPromptBtn.disabled = true;
  gptBuildStatus.textContent = "";

  let items;
  if (theme && apiKeyInput.value.trim()) {
    gptBuildStatus.textContent = "테마에 맞는 42개 항목 구성 중...";
    try {
      items = await buildThemedItemList(selectedGptType, theme);
    } catch (e) {
      console.error(e);
      gptBuildStatus.textContent = `테마 리스트 생성 실패, 기본 리스트로 진행합니다 (${e.message})`;
      items = MINI_TYPES[selectedGptType].items.slice();
    }
  } else {
    if (theme) gptBuildStatus.textContent = "(API 키가 없어서 테마 리스트 생성은 건너뛰고, 기본 리스트로 만들었어요)";
    items = MINI_TYPES[selectedGptType].items.slice();
  }

  const promptText = buildGptPromptText(selectedGptType, items, theme);
  gptOutputText.value = promptText;
  gptOutputBox.classList.remove("hidden");
  if (!gptBuildStatus.textContent || gptBuildStatus.textContent.startsWith("테마에 맞는")) {
    gptBuildStatus.textContent = "완성! 아래 내용을 복사해서 GPT한테 붙여넣어주세요.";
  }
  buildGptPromptBtn.disabled = false;
  gptOutputBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

copyGptPromptBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(gptOutputText.value);
    gptCopyStatus.textContent = "복사됐어요!";
  } catch (e) {
    gptOutputText.select();
    document.execCommand("copy");
    gptCopyStatus.textContent = "복사됐어요!";
  }
  setTimeout(() => { gptCopyStatus.textContent = ""; }, 2000);
});
