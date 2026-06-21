/* ===================== 설정 ===================== */
const MODEL = "gemini-3.1-flash-image";
const API_URL = (key) => `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

// 위저드 단계 정의
const STEPS = [
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

  return [
    `[캐릭터 컨셉]`,
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
  ].join("\n");
}

// 스샷처럼 컨셉/타겟/받아보는 대상/추천 캐릭터 주체 형식으로 풀어서 보여주는 서술형 요약
function buildConceptNarrative() {
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

  const conceptTitle = `${p.split(", ")[0] || "개성있는"} ${job} 컨셉`;

  const lines = [];
  lines.push(`<b>컨셉</b>\n${conceptTitle}`);
  lines.push(`<b>나이/성별</b>\n${age} · ${gender}`);
  lines.push(`<b>성격</b>\n${p}`);
  lines.push(`<b>말투</b>\n${tone}${speechHabit ? ` (${speechHabit})` : ""}`);
  lines.push(`<b>타겟</b>\n${age}, ${job}로 살아가며 일상과 직장에서 자신의 개성을 드러내고 싶은, ${(answers.hobby || []).length ? hobby + " 같은 취미를 즐기는" : ""} 사용자층`);
  lines.push(`<b>받아보는 대상</b>\n${rel} 등 평소 자주 연락하는 가까운 관계`);
  lines.push(`<b>추천 캐릭터 주체</b>\n${p}을(를) 가진 ${age} ${gender} ${job} 캐릭터, 운동은 ${ex} 정도로 즐기는 편`);
  if (visual) lines.push(`<b>비주얼 포인트</b>\n${visual}`);
  lines.push(`<b>색감/분위기</b>\n${colorMood}`);

  return lines.map(l => l.replace(/\n/g, "<br>")).join("<br><br>");
}


/* ===================== 그림체 스타일 가이드 (카카오 이모티콘 인기작 기준) ===================== */
const STYLE_GUIDE = `[그림체 스타일 — 반드시 지킬 것]
실제 카카오 이모티콘 스토어 인기작들(예: 멍충해요 황토강아지, 꿀꿀꿀 해피그, 은은한 곰, 화병아리 같은 스타일)을 참고 기준으로 삼아 그려줘.

- 비율: 머리가 크고 몸이 작은 단순한 비율. 팔다리는 짧고 뭉툭하게.
- 외곽선: 굵고 깔끔한 검은색 선. 손그림처럼 살짝 자연스러운 떨림은 괜찮지만, 지저분하거나 끊긴 선은 안 돼.
- 음영: 입체적인 3D 렌더링이나 여러 방향 광원, 광택 하이라이트는 절대 금지. 대신 캐릭터 전체에 한 방향에서 오는 아주 옅고 단순한 그림자(혹은 볼터치 정도)는 자연스럽게 들어가도 좋아 — "은은한 곰"처럼 살짝 부드러운 단색 음영 정도면 딱 좋아.
- 색: 채도가 과하지 않은 차분한 단색 위주, 2~5가지 색 정도로 단순하게. 배경은 순수 흰색.
- 표정: 캐릭터 얼굴 비중을 크게 잡고, 표정과 포즈만으로 상황이 직관적으로 읽히게. 눈/코/입은 단순한 도형이나 선으로, 과한 디테일 금지.
- 절대 사실적인 털 질감, 피부 질감, 포토리얼한 렌더링으로 가지 마. 평면적이고 친근한 일러스트 느낌을 유지해.
- 디테일은 절제하되, 캐릭터의 개성(소품 1개, 표정의 과장됨 등)은 분명하게 드러나야 해. 매력 없이 밋밋한 그림은 안 돼 — 실제 인기 이모티콘처럼 표정과 포즈에 확실한 리액션과 생동감이 있어야 해.`;

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
- 위 컨셉의 "비주얼 포인트"를 캐릭터의 시그니처 특징으로 명확하게 드러낼 것 (예: 안경, 머리띠, 특정 소품 등 — 단, 디테일은 그 1~2가지로만 절제할 것)`;

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
- 위 컨셉의 "비주얼 포인트"를 캐릭터의 시그니처 특징으로 명확하게 드러낼 것 (단, 디테일은 절제할 것)`;

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
