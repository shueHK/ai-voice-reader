let voices = [];
let utterance = null;
let isPaused = false;

let originalSentences = [];
let activeQueue = [];
let hiddenIndexSet = new Set();

let currentLang = "zh-CN";

/* ========= UI 语言（17 种，固定顺序） ========= */
const i18n = {
  "zh-CN": { name:"中文（简体）", title:"📖 自由听书",
    subtitle:"粘贴任何文字 · 免费朗读 · 无限文章",
    placeholder:"在这里粘贴任何你想听的文字…",
    play:"▶ 播放", pause:"⏸ 暂停", stop:"⏹ 停止",
    resume:"▶ 继续", edit:"✏️ 编辑文章", reset:"🔄 重置",
    languageLabel:"语言:" },

  "zh-TW": { name:"中文（繁體）", title:"📖 自由聽書",
    subtitle:"貼上任何文字 · 免費朗讀 · 無限文章",
    placeholder:"在這裡貼上你想聽的文字…",
    play:"▶ 播放", pause:"⏸ 暫停", stop:"⏹ 停止",
    resume:"▶ 繼續", edit:"✏️ 編輯文章", reset:"🔄 重置",
    languageLabel:"語言:" },

  "ms-MY": { name:"Bahasa Melayu", title:"📖 Bacaan Bebas",
    subtitle:"Tampal teks · Bacaan percuma · Tanpa had",
    placeholder:"Tampal teks di sini…",
    play:"▶ Main", pause:"⏸ Jeda", stop:"⏹ Henti",
    resume:"▶ Sambung", edit:"✏️ Sunting", reset:"🔄 Tetap semula",
    languageLabel:"Bahasa:" },

  "ar": { name:"العربية", title:"📖 الاستماع الحر",
    subtitle:"الصق أي نص · قراءة مجانية · بلا حدود",
    placeholder:"الصق النص هنا…",
    play:"▶ تشغيل", pause:"⏸ إيقاف مؤقت", stop:"⏹ إيقاف",
    resume:"▶ متابعة", edit:"✏️ تحرير", reset:"🔄 إعادة تعيين",
    languageLabel:"اللغة:" },

  "en": { name:"English", title:"📖 Free Listening",
    subtitle:"Paste any text · Free reading · Unlimited",
    placeholder:"Paste any text you want to listen to…",
    play:"▶ Play", pause:"⏸ Pause", stop:"⏹ Stop",
    resume:"▶ Resume", edit:"✏️ Edit Text", reset:"🔄 Reset",
    languageLabel:"Language:" },

  "hi": { name:"हिन्दी", title:"📖 मुक्त श्रवण",
    subtitle:"कोई भी पाठ चिपकाएँ · निःशुल्क · असीमित",
    placeholder:"यहाँ पाठ चिपकाएँ…",
    play:"▶ चलाएँ", pause:"⏸ विराम", stop:"⏹ रोकें",
    resume:"▶ जारी रखें", edit:"✏️ संपादित करें", reset:"🔄 रीसेट",
    languageLabel:"भाषा:" },

  "ko": { name:"한국어", title:"📖 자유 낭독",
    subtitle:"텍스트 붙여넣기 · 무료 · 무제한",
    placeholder:"여기에 텍스트를 붙여넣으세요…",
    play:"▶ 재생", pause:"⏸ 일시정지", stop:"⏹ 정지",
    resume:"▶ 계속", edit:"✏️ 편집", reset:"🔄 초기화",
    languageLabel:"언어:" },

  "ja": { name:"日本語", title:"📖 自由朗読",
    subtitle:"テキスト貼り付け · 無料 · 無制限",
    placeholder:"ここに貼り付けてください…",
    play:"▶ 再生", pause:"⏸ 一時停止", stop:"⏹ 停止",
    resume:"▶ 続ける", edit:"✏️ 編集", reset:"🔄 リセット",
    languageLabel:"言語:" },

  "th": { name:"ภาษาไทย", title:"📖 การอ่านอิสระ",
    subtitle:"วางข้อความ · ฟรี · ไม่จำกัด",
    placeholder:"วางข้อความที่นี่…",
    play:"▶ เล่น", pause:"⏸ หยุดชั่วคราว", stop:"⏹ หยุด",
    resume:"▶ ต่อ", edit:"✏️ แก้ไข", reset:"🔄 รีเซ็ต",
    languageLabel:"ภาษา:" },

  "es": { name:"Español", title:"📖 Lectura Libre",
    subtitle:"Pega texto · Gratis · Ilimitado",
    placeholder:"Pega texto aquí…",
    play:"▶ Reproducir", pause:"⏸ Pausa", stop:"⏹ Detener",
    resume:"▶ Continuar", edit:"✏️ Editar", reset:"🔄 Reiniciar",
    languageLabel:"Idioma:" },

  "fr": { name:"Français", title:"📖 Lecture Libre",
    subtitle:"Collez du texte · Gratuit · Illimité",
    placeholder:"Collez le texte ici…",
    play:"▶ Lire", pause:"⏸ Pause", stop:"⏹ Arrêter",
    resume:"▶ Continuer", edit:"✏️ Éditer", reset:"🔄 Réinitialiser",
    languageLabel:"Langue:" },

  "de": { name:"Deutsch", title:"📖 Freies Lesen",
    subtitle:"Text einfügen · Kostenlos · Unbegrenzt",
    placeholder:"Text hier einfügen…",
    play:"▶ Abspielen", pause:"⏸ Pause", stop:"⏹ Stop",
    resume:"▶ Fortsetzen", edit:"✏️ Bearbeiten", reset:"🔄 Zurücksetzen",
    languageLabel:"Sprache:" },

  "it": { name:"Italiano", title:"📖 Lettura Libera",
    subtitle:"Incolla testo · Gratis · Illimitato",
    placeholder:"Incolla testo qui…",
    play:"▶ Riproduci", pause:"⏸ Pausa", stop:"⏹ Stop",
    resume:"▶ Continua", edit:"✏️ Modifica", reset:"🔄 Reimposta",
    languageLabel:"Lingua:" },

  "pt": { name:"Português", title:"📖 Leitura Livre",
    subtitle:"Cole texto · Grátis · Ilimitado",
    placeholder:"Cole texto aqui…",
    play:"▶ Reproduzir", pause:"⏸ Pausar", stop:"⏹ Parar",
    resume:"▶ Continuar", edit:"✏️ Editar", reset:"🔄 Redefinir",
    languageLabel:"Idioma:" },

  "ru": { name:"Русский", title:"📖 Свободное чтение",
    subtitle:"Вставьте текст · Бесплатно · Без ограничений",
    placeholder:"Вставьте текст здесь…",
    play:"▶ Воспроизвести", pause:"⏸ Пауза", stop:"⏹ Стоп",
    resume:"▶ Продолжить", edit:"✏️ Редактировать", reset:"🔄 Сброс",
    languageLabel:"Язык:" },

  "nl": { name:"Nederlands", title:"📖 Vrij Lezen",
    subtitle:"Plak tekst · Gratis · Onbeperkt",
    placeholder:"Plak tekst hier…",
    play:"▶ Afspelen", pause:"⏸ Pauze", stop:"⏹ Stop",
    resume:"▶ Hervatten", edit:"✏️ Bewerken", reset:"🔄 Reset",
    languageLabel:"Taal:" },

  "vi": { name:"Tiếng Việt", title:"📖 Nghe Tự Do",
    subtitle:"Dán văn bản · Miễn phí · Không giới hạn",
    placeholder:"Dán văn bản tại đây…",
    play:"▶ Phát", pause:"⏸ Tạm dừng", stop:"⏹ Dừng",
    resume:"▶ Tiếp tục", edit:"✏️ Chỉnh sửa", reset:"🔄 Đặt lại",
    languageLabel:"Ngôn ngữ:" }
};

/* ========= 浏览器语言只生效一次 ========= */
function detectBrowserLangOnce(){
  if (localStorage.getItem("uiLangLocked")) return;
  const nav = navigator.language;
  const match = Object.keys(i18n).find(
    k => nav === k || nav.startsWith(k.split("-")[0])
  );
  currentLang = match || "zh-CN";
  localStorage.setItem("uiLangLocked","1");
}

/* ========= 初始化 UI ========= */
function initUI(){
  detectBrowserLangOnce();
  const saved = localStorage.getItem("userLang");
  if (saved && i18n[saved]) currentLang = saved;

  langSelect.innerHTML="";
  Object.keys(i18n).forEach(k=>{
    const o=document.createElement("option");
    o.value=k;
    o.textContent=i18n[k].name;
    if(k===currentLang) o.selected=true;
    langSelect.appendChild(o);
  });

  langSelect.onchange=()=>{
    currentLang=langSelect.value;
    localStorage.setItem("userLang",currentLang);
    updateLanguage();
  };

  editBtn.onclick=()=>{ editContainer.style.display='block'; readContainer.style.display='none'; };
  playBtn.onclick=play;
  pauseBtn.onclick=hardStop;   // 暂停 = 真停止
  stopBtn.onclick=softPause;   // 停止 = 真暂停
  resumeBtn.onclick=resume;
  resetBtn.onclick=resetQueue;

  updateLanguage();
}

/* ========= UI 文本更新 ========= */
function updateLanguage(){
  const t=i18n[currentLang];
  title.textContent=t.title;
  subtitle.textContent=t.subtitle;
  text.placeholder=t.placeholder;
  playBtn.textContent=t.play;
  pauseBtn.textContent=t.pause;
  stopBtn.textContent=t.stop;
  resumeBtn.textContent=t.resume;
  editBtn.textContent=t.edit;
  resetBtn.textContent=t.reset;
  document.querySelector(".language label").textContent=t.languageLabel;
}

/* ========= TTS ========= */
function loadVoices(){
  voices=speechSynthesis.getVoices();
  voice.innerHTML="";
  voices.forEach((v,i)=>{
    const o=document.createElement("option");
    o.value=i;
    o.textContent=v.name+" ("+v.lang+")";
    voice.appendChild(o);
  });
}

/* ========= 播放逻辑 ========= */
function splitTextIntoSentences(text){
  return text.match(/[^。！？,.!?；;:\r\n]+[。！？,.!?；;:]?/g)?.map(s=>s.trim()).filter(Boolean)||[];
}

function initQueue(){
  const raw=splitTextIntoSentences(text.value);
  originalSentences=raw.map((t,i)=>({text:t,index:i}));
  activeQueue=[...originalSentences];
  hiddenIndexSet.clear();
  renderSentences();
  editContainer.style.display='none';
  readContainer.style.display='block';
}

function renderSentences(){
  textContainer.innerHTML="";
  originalSentences.forEach(item=>{
    const span=document.createElement("span");
    span.textContent=item.text+" ";
    if(hiddenIndexSet.has(item.index)) span.classList.add("read");
    textContainer.appendChild(span);
  });
}

function play(){
  hardStop();
  initQueue();
  isPaused=false;
  playNext();
}

function playNext(){
  if(!activeQueue.length) return;
  const item=activeQueue[0];
  utterance=new SpeechSynthesisUtterance(item.text);
  utterance.voice=voices[voice.value]||voices[0];
  utterance.rate=parseFloat(rate.value);
  utterance.onend=()=>{
    hiddenIndexSet.add(item.index);
    activeQueue.shift();
    renderSentences();
    if(activeQueue.length&&!isPaused) playNext();
  };
  speechSynthesis.speak(utterance);
}

function softPause(){
  if(speechSynthesis.speaking&&!speechSynthesis.paused){
    isPaused=true;
    speechSynthesis.pause();
  }
}

function hardStop(){
  isPaused=false;
  speechSynthesis.cancel();
}

function resume(){
  if(speechSynthesis.paused){
    isPaused=false;
    speechSynthesis.resume();
  }else if(activeQueue.length){
    playNext();
  }
}

function resetQueue(){
  hardStop();
  originalSentences=[];
  activeQueue=[];
  hiddenIndexSet.clear();
  text.value="";
  textContainer.innerHTML="";
  editContainer.style.display='block';
  readContainer.style.display='none';
}

/* ========= 启动 ========= */
document.addEventListener("DOMContentLoaded",()=>{
  initUI();
  loadVoices();
  setTimeout(loadVoices,500);
});
speechSynthesis.onvoiceschanged=loadVoices;
