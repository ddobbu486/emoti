/* ===================== 설정 ===================== */
const MODEL = "claude-sonnet-4-6";
const API_URL = "https://api.anthropic.com/v1/messages";

// 위저드 단계 정의 (스크린샷의 성격/직업/관계/취미/운동/말투 구조)
const STEPS = [
  {
    key: "personality",
    title: "성격을 골라주세요",
    sub: "캐릭터의 기본 성격이에요. 여러 개 선택 가능해요.",
    multi: true,
    options: ["상냥한", "낙천적인", "성실한", "리액션큰", "예의바른", "무뚝뚝한", "장난꾸러기", "엉뚱한", "차분한", "츤데레", "다정한", "직진하는"]
  },
  {
    key: "job",
    title: "직업을 골라주세요",
    sub: "캐릭터가 속한 세계관이에요.",
    multi: false,
    options: ["은행원", "보험설계사", "엔지니어", "데이터분석가", "AI개발자", "PM", "스타트업직원", "작가", "웹툰작가", "일러스트레이터", "영상편집자", "사진작가", "선생님", "프리랜서", "학생", "직장인"]
  },
  {
    key: "relation",
    title: "주로 누구한테 보낼까요?",
    sub: "받는 대상에 따라 톤이 달라져요.",
    multi: false,
    options: ["직장동료", "후배", "친구", "스터디원", "연인", "가족", "썸타는 사람", "단톡방"]
  },
  {
    key: "hobby",
    title: "취미를 골라주세요",
    sub: "캐릭터의 디테일을 살려줄 요소예요.",
    multi: true,
    options: ["커피", "운동", "독서", "게임", "여행", "음악", "요리", "고양이", "강아지", "그림", "캠핑", "넷플릭스"]
  },
  {
    key: "exercise",
    title: "운동 강도는요?",
    sub: "포즈의 역동성에 반영돼요.",
    multi: false,
    options: ["전혀 안함", "가볍게", "꾸준히", "헬스매니아"]
  },
  {
    key: "tone",
    title: "말투를 골라주세요",
    sub: "텍스트가 들어가는 컷에 반영돼요.",
    multi: false,
    options: ["존댓말", "반말", "존댓말+반말 섞임", "텍스트 없이 표정만"]
  },
  {
    key: "visual",
    title: "비주얼 포인트가 있다면 적어주세요 (선택)",
    sub: "예: 단정한 가르마 머리, 동그란 안경, 리본 머리띠 등",
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
const generateAllBtn = document.getElementById("generateAllBtn");
const downloadZipBtn = document.getElementById("downloadZipBtn");
const genStatus = document.getElementById("genStatus");

const apiKeyInput = document.getElementById("apiKey");
const saveKeyBtn = document.getElementById("saveKey");
const keyStatus = document.getElementById("keyStatus");

/* ===================== API 키 저장/로드 ===================== */
function loadKey() {
  const k = localStorage.getItem("emoticon_ai_key");
  if (k) {
    apiKeyInput.value = k;
    keyStatus.textContent = "저장됨";
    keyStatus.classList.add("ok");
  }
}
saveKeyBtn.addEventListener("click", () => {
  const v = apiKeyInput.value.trim();
  if (!v) return;
  localStorage.setItem("emoticon_ai_key", v);
  keyStatus.textContent = "저장됨";
  keyStatus.classList.add("ok");
});
loadKey();

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
    html += `<div class="option-grid">`;
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
  conceptSummary.textContent = characterSeed;
  buildEmptyGrid();
  resultSection.scrollIntoView({ behavior: "smooth" });
}

function buildCharacterSeed() {
  const p = (answers.personality || []).join(", ") || "평범한";
  const job = answers.job || "직장인";
  const rel = answers.relation || "친구";
  const hobby = (answers.hobby || []).join(", ") || "특별히 없음";
  const ex = answers.exercise || "가볍게";
  const tone = answers.tone || "존댓말";
  const visual = answers.visual || "특징 없음, 디자이너 재량";

  return [
    `[캐릭터 컨셉]`,
    `성격: ${p}`,
    `직업: ${job}`,
    `주 사용 관계: ${rel}`,
    `취미: ${hobby}`,
    `운동 강도: ${ex}`,
    `말투: ${tone}`,
    `비주얼 포인트: ${visual}`,
  ].join("\n");
}

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

/* ===================== Claude API 호출 ===================== */
async function generateOneSVG(situation) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) throw new Error("API 키를 입력해주세요");

  const systemPrompt = `너는 카카오 이모티콘 가이드 도안을 그리는 라인아트 일러스트레이터야.
규칙:
1. 결과는 반드시 <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">...</svg> 하나만 출력해. 다른 설명, 코드블록 마크다운 없이 SVG 코드만.
2. 색은 채우지 말고 검은색 선(stroke="#1B1B1B", stroke-width="6~8", fill="none" 또는 흰색 fill)으로만 그려. 사용자가 따라 그릴 가이드 도안이야.
3. 매 컷마다 아래 캐릭터 설정을 동일하게 유지해서, 같은 캐릭터가 다른 표정/포즈를 짓는 것처럼 그려.
4. 배경, 텍스트(말풍선 글자)는 넣지 말고 캐릭터의 표정과 포즈로만 감정/상황을 표현해.
5. 단순하고 귀여운 라인 드로잉 스타일 (이모티콘 가이드 도안 느낌), 디테일은 과하지 않게.

캐릭터 설정:
${characterSeed}`;

  const userPrompt = `이번 컷이 표현해야 할 상황/감정: "${situation}"
이 상황에 맞는 캐릭터의 표정과 포즈를 라인아트 SVG로 그려줘.`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 오류 (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = (data.content || []).map(c => c.text || "").join("\n");
  const match = text.match(/<svg[\s\S]*?<\/svg>/i);
  if (!match) throw new Error("SVG를 찾지 못했어요");
  return match[0];
}

/* ===================== 전체 32컷 생성 (동시 3개씩) ===================== */
const results = new Array(SITUATIONS.length).fill(null);

async function generateAll() {
  if (!apiKeyInput.value.trim()) {
    alert("먼저 상단에 Anthropic API 키를 입력하고 저장해주세요.");
    return;
  }
  generateAllBtn.disabled = true;
  downloadZipBtn.disabled = true;
  let done = 0;
  const total = SITUATIONS.length;
  genStatus.textContent = `생성 중... 0 / ${total}`;

  const CONCURRENCY = 3;
  let cursor = 0;

  async function worker() {
    while (cursor < total) {
      const i = cursor++;
      const cell = document.getElementById(`cell-${i}`);
      const imgBox = cell.querySelector(".cell-img");
      try {
        const svg = await generateOneSVG(SITUATIONS[i]);
        results[i] = svg;
        cell.classList.remove("pending", "error");
        imgBox.innerHTML = svg;
      } catch (e) {
        cell.classList.remove("pending");
        cell.classList.add("error");
        imgBox.textContent = "실패";
        console.error(`[${i}] ${SITUATIONS[i]}`, e);
      }
      done++;
      genStatus.textContent = `생성 중... ${done} / ${total}`;
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, worker);
  await Promise.all(workers);

  genStatus.textContent = `완료! ${results.filter(Boolean).length} / ${total}`;
  generateAllBtn.disabled = false;
  downloadZipBtn.disabled = results.every(r => !r);
}

generateAllBtn.addEventListener("click", generateAll);

/* ===================== ZIP 다운로드 ===================== */
downloadZipBtn.addEventListener("click", async () => {
  const zip = new JSZip();
  zip.file("concept.txt", characterSeed);
  results.forEach((svg, i) => {
    if (svg) {
      const num = String(i + 1).padStart(2, "0");
      const name = SITUATIONS[i].replace(/\s+/g, "_");
      zip.file(`${num}_${name}.svg`, svg);
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
