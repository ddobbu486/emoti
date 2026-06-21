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
    options: ["상냥한", "낙천적인", "성실한", "리액션큰", "예의바른", "무뚝뚝한", "장난꾸러기", "엉뚱한", "차분한", "츤데레", "다정한", "직진하는", "소심한", "당당한", "허당끼있는", "느긋한", "예민한", "유쾌한", "진지한", "애교많은", "쿨한", "걱정많은", "긍정에너지", "삐딱한"]
  },
  {
    key: "job",
    title: "직업을 골라주세요",
    sub: "캐릭터가 속한 세계관이에요.",
    multi: false,
    options: ["은행원", "보험설계사", "엔지니어", "데이터분석가", "AI개발자", "PM", "스타트업직원", "작가", "웹툰작가", "일러스트레이터", "영상편집자", "사진작가", "선생님", "프리랜서", "학생", "직장인", "대학원생", "공무원", "디자이너", "마케터", "영업직", "의료직(의사/간호사)", "요식업", "자영업", "주부/주부아빠", "운동선수", "연구원", "변호사/회계사", "취준생", "무직/백수"]
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
const generateAllBtn = document.getElementById("generateAllBtn");
const downloadZipBtn = document.getElementById("downloadZipBtn");
const genStatus = document.getElementById("genStatus");

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
  conceptSummary.textContent = characterSeed + (charImageBase64 ? "\n\n[업로드한 캐릭터 이미지를 기준으로 그려요]" : "\n\n[업로드 이미지 없음 → 첫 컷을 기준 캐릭터로 자동 고정]");
  buildEmptyGrid();
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

/* ===================== Gemini 이미지 생성 ===================== */
async function generateOneImage(situation, referenceB64, referenceMime) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) throw new Error("API 키를 입력해주세요");

  const promptText = `카카오톡 이모티콘 스타일의 귀여운 캐릭터 스티커를 그려줘.

${referenceB64 ? "함께 첨부한 이미지 속 캐릭터와 외형(얼굴형, 색, 특징)을 동일하게 유지하면서," : "아래 컨셉에 맞는 캐릭터를 새로 디자인해서,"} 이번 컷에서는 "${situation}" 감정/상황을 표정과 포즈로 표현해줘.

${characterSeed}

규칙:
- 정사각형 1:1 비율, 배경은 순수 흰색 또는 투명
- 카카오 이모티콘처럼 굵은 라인 + 완성된 채색 일러스트, 색감은 아래 컨셉의 "색감/분위기"를 따를 것
- 캐릭터 1마리만, 화면 중앙에 꽉 차게
- 텍스트나 말풍선 글자는 넣지 말고 표정과 포즈로만 표현
- 매 컷마다 같은 캐릭터처럼 보이도록 외형을 통일`;

  const parts = [{ text: promptText }];
  if (referenceB64) {
    parts.push({ inline_data: { mime_type: referenceMime, data: referenceB64 } });
  }

  const res = await fetch(API_URL(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API 오류 (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const cParts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = cParts.find(p => p.inlineData || p.inline_data);
  if (!imgPart) throw new Error("이미지를 받지 못했어요");
  const inline = imgPart.inlineData || imgPart.inline_data;
  return { base64: inline.data, mime: inline.mimeType || inline.mime_type || "image/png" };
}

/* ===================== 전체 32컷 생성 ===================== */
const results = new Array(SITUATIONS.length).fill(null); // {base64, mime}

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

async function generateAll() {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    alert("먼저 상단에 Gemini API 키를 입력하고 저장해주세요.");
    return;
  }
  generateAllBtn.disabled = true;
  downloadZipBtn.disabled = true;
  const total = SITUATIONS.length;
  let done = 0;
  genStatus.textContent = `생성 중... 0 / ${total}`;

  // 레퍼런스 이미지가 없으면 0번 컷을 먼저 생성해서 이후 컷들의 기준으로 삼는다.
  let startIndex = 0;
  let referenceB64 = charImageBase64;
  let referenceMime = charImageMime;

  if (!referenceB64) {
    try {
      const r0 = await generateOneImage(SITUATIONS[0], null, null);
      results[0] = r0;
      await renderCellResult(0, r0);
      autoReferenceBase64 = r0.base64;
      autoReferenceMime = r0.mime;
      referenceB64 = r0.base64;
      referenceMime = r0.mime;
      startIndex = 1;
      done = 1;
      genStatus.textContent = `생성 중... ${done} / ${total}`;
    } catch (e) {
      const cell = document.getElementById(`cell-0`);
      cell.classList.remove("pending");
      cell.classList.add("error");
      cell.querySelector(".cell-img").textContent = "실패";
      console.error(e);
      genStatus.textContent = `첫 컷 생성 실패: ${e.message}`;
      generateAllBtn.disabled = false;
      return;
    }
  }

  const CONCURRENCY = 3;
  let cursor = startIndex;

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
        console.error(`[${i}] ${SITUATIONS[i]}`, e);
      }
      done++;
      genStatus.textContent = `생성 중... ${done} / ${total}`;
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, worker);
  await Promise.all(workers);

  const successCount = results.filter(Boolean).length;
  genStatus.textContent = `완료! ${successCount} / ${total}`;
  generateAllBtn.disabled = false;
  downloadZipBtn.disabled = successCount === 0;
}

generateAllBtn.addEventListener("click", generateAll);

/* ===================== ZIP 다운로드 ===================== */
downloadZipBtn.addEventListener("click", async () => {
  const zip = new JSZip();
  zip.file("concept.txt", characterSeed);
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
