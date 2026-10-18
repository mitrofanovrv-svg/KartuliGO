'use strict';
/* КартулиГО v0.3. Без библиотек, платных API, аналитики и аккаунтов.
 * ВАЖНО: не менять STORAGE_KEY — это прогресс пользователей v0.1/v0.2. */
const STORAGE_KEY = 'gamardzhoba_progress_v1';
const APP_VERSION = '0.3.0';
const mk=(p,rows,kind)=>rows.map((r,i)=>({id:`${p}-${String(i+1).padStart(2,'0')}`,ge:r[0],ru:r[1],trans:r[2]||'',kind}));
const letters=mk('alpha',[
 ['ა','а'],['ბ','б'],['გ','г'],['დ','д'],['ე','э'],['ვ','в'],
 ['ზ','з'],['თ','т с придыханием'],['ი','и'],['კ','к (резкая)'],['ლ','л'],['მ','м'],
 ['ნ','н'],['ო','о'],['პ','п (резкая)'],['ჟ','ж'],['რ','р'],['ს','с'],
 ['ტ','т (резкая)'],['უ','у'],['ფ','п с придыханием'],['ქ','к с придыханием'],['ღ','гъ (гортанная)'],['ყ','къ (резкая)'],
 ['შ','ш'],['ჩ','ч с придыханием'],['ც','ц с придыханием'],['ძ','дз'],['წ','ц (резкая)'],['ჭ','ч (резкая)'],
 ['ხ','х'],['ჯ','дж'],['ჰ','х (лёгкий выдох)']
],'alpha');
const greetings=mk('greet',[
 ['გამარჯობა','Привет / здравствуйте','гамарджоба'],['მადლობა','Спасибо','мадлоба'],['ნახვამდის','До свидания','нахвамдис'],['დიახ','Да','диах'],['არა','Нет','ара'],['ბოდიში','Извините','бодиши']
],'word');
const cafe=mk('cafe',[
 ['წყალი','Вода','цкали'],['პური','Хлеб','пури'],['ჩაი','Чай','чай'],['ყავა','Кофе','кава'],['რძე','Молоко','рдзе'],['შაქარი','Сахар','шакари']
],'word');
const numbers=mk('num',[
 ['ერთი','Один','эрти'],['ორი','Два','ори'],['სამი','Три','сами'],['ოთხი','Четыре','отхи'],['ხუთი','Пять','хути'],['ექვსი','Шесть','эквси']
],'word');
const phrases=mk('phrase',[
 ['როგორ ხარ?','Как дела? (неформально)','рогор хар'],['კარგად','Хорошо','каргад'],['მე მქვია...','Меня зовут...','ме мквиа'],['არ მესმის','Я не понимаю','ар месмис'],['გთხოვთ','Пожалуйста (в просьбе)','гтховт'],['სად არის?','Где находится?','сад арис']
],'word');
const travel=mk('travel',[
 ['რამდენი ღირს?','Сколько стоит?','рамдени гирс'],['წყალი მინდა','Я хочу воды','цкали минда'],['ერთი ჩაი, გთხოვთ','Один чай, пожалуйста','эрти чай, гтховт'],['ანგარიში, გთხოვთ','Счёт, пожалуйста','ангариши, гтховт'],['მარცხნივ','Налево','марцхнив'],['მარჯვნივ','Направо','марджвнив']
],'word');
const lessons=[
 ...Array.from({length:6},(_,i)=>({id:'alphabet-'+(i+1),title:'Алфавит · часть '+(i+1),subtitle:i===0?'Первые шесть букв':'Продолжаем изучать буквы',kind:'alpha',symbol:['ა','ზ','ნ','ტ','შ','ხ'][i],entries:letters.slice(i*6,i*6+6)})),
 {id:'greetings',title:'Приветствия',subtitle:'Привет, спасибо, до свидания',kind:'word',symbol:'👋',entries:greetings},
 {id:'food',title:'В кафе',subtitle:'Вода, хлеб, чай и кофе',kind:'word',symbol:'☕',entries:cafe},
 {id:'numbers',title:'Числа 1–6',subtitle:'Считаем по-грузински',kind:'word',symbol:'🔢',entries:numbers},
 {id:'basic-phrases',title:'Первые фразы',subtitle:'Знакомство и вопросы',kind:'word',symbol:'💬',entries:phrases},
 {id:'getting-around',title:'В городе',subtitle:'Кафе, цены и направления',kind:'word',symbol:'🧭',entries:travel}
];
/* Составлены специально для КартулиГО — не материалы Duolingo. */
const sentences={
 greetings:[
  {ru:'Да, спасибо!',tokens:['დიახ,','მადლობა!'],extra:['არა','ბოდიში']},
  {ru:'Нет, извините.',tokens:['არა,','ბოდიში.'],extra:['დიახ','მადლობა']},
  {ru:'Привет!',tokens:['გამარჯობა!'],extra:['ნახვამდის!','მადლობა!','ბოდიში!']}
 ],
 food:[
  {ru:'Я хочу воды.',tokens:['წყალი','მინდა.'],extra:['პური','ყავა']},
  {ru:'Я хочу хлеб.',tokens:['პური','მინდა.'],extra:['ჩაი','რძე']},
  {ru:'Один чай, пожалуйста.',tokens:['ერთი','ჩაი,','გთხოვთ.'],extra:['წყალი','ყავა']}
 ],
 numbers:[
  {ru:'Один, два, три.',tokens:['ერთი,','ორი,','სამი.'],extra:['ოთხი','ექვსი']},
  {ru:'Четыре, пять, шесть.',tokens:['ოთხი,','ხუთი,','ექვსი.'],extra:['ერთი','სამი']},
  {ru:'Два и три.',tokens:['ორი','და','სამი.'],extra:['ერთი','ექვსი']}
 ],
 'basic-phrases':[
  {ru:'Как дела?',tokens:['როგორ','ხარ?'],extra:['კარგად','გთხოვთ']},
  {ru:'Меня зовут Нино.',tokens:['მე','მქვია','ნინო.'],extra:['კარგად','სად']},
  {ru:'Я не понимаю.',tokens:['არ','მესმის.'],extra:['როგორ','ხარ']}
 ],
 'getting-around':[
  {ru:'Я хочу воды.',tokens:['წყალი','მინდა.'],extra:['ჩაი','სად']},
  {ru:'Один чай, пожалуйста.',tokens:['ერთი','ჩაი,','გთხოვთ.'],extra:['წყალი','ორი']},
  {ru:'Где находится?',tokens:['სად','არის?'],extra:['მინდა','გთხოვთ']}
 ]
};
const allEntries=lessons.flatMap(l=>l.entries);
const byId=Object.fromEntries(allEntries.map(e=>[e.id,e]));
const lessonById=Object.fromEntries(lessons.map(l=>[l.id,l]));
const emptyState=()=>({xp:0,streak:0,lastStudyDay:'',completed:{},sr:{},settings:{sound:true}});
function normalize(s){const d=emptyState();if(!s||typeof s!=='object')return d;return {
  xp:Number.isFinite(s.xp)?Math.max(0,Math.floor(s.xp)):0,
  streak:Number.isFinite(s.streak)?Math.max(0,Math.floor(s.streak)):0,
  lastStudyDay:typeof s.lastStudyDay==='string'?s.lastStudyDay:'',
  completed:s.completed&&typeof s.completed==='object'&&!Array.isArray(s.completed)?s.completed:{},
  sr:s.sr&&typeof s.sr==='object'&&!Array.isArray(s.sr)?s.sr:{},
  settings:{sound:s.settings?.sound!==false}
};}
function readState(){try{return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));}catch{return emptyState();}}
let state=readState(),page='home',session=null,lessonIntroId=null,letterId=null,resultData=null,toastTimer=null;
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{notify('Не получилось сохранить прогресс: проверь свободную память.');}}
function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function addDays(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return dateKey(d);}
function updateStreak(){const today=dateKey();if(state.lastStudyDay===today)return;state.streak=state.lastStudyDay===addDays(-1)?state.streak+1:1;state.lastStudyDay=today;}
function safe(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function notify(message){let el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3600);}
function go(p){page=p;render();window.scrollTo(0,0);}
function completedCount(){return lessons.filter(l=>!!state.completed[l.id]).length;}
function furthestUnlocked(){return Math.min(lessons.length-1,Math.max(-1,...lessons.map((l,i)=>state.completed[l.id]?i:-1))+1);}
function isUnlocked(idx){return idx<=furthestUnlocked()||!!state.completed[lessons[idx].id];}
function nextLesson(){return lessons.find((l,i)=>isUnlocked(i)&&!state.completed[l.id])||lessons[0];}
function dueItems(){return allEntries.filter(e=>state.sr[e.id]?.due&&state.sr[e.id].due<=dateKey());}
function header(){return `<header class="topbar"><div class="brand"><div class="brand-sign">გ</div><div><div class="brand-title">Картули<span>ГО</span></div><div class="brand-sub">ქართული · грузинский язык</div></div></div><div class="top-stats"><span title="Серия дней">🔥 ${state.streak}</span><span title="Очки опыта">⚡ ${state.xp}</span></div></header>`;}
function bottomNav(){const tabs=[['home','⌂','Учиться'],['alphabet','ა','Буквы'],['practice','↻','Практика'],['profile','◉','Профиль']];return `<nav class="bottom-nav" aria-label="Разделы">${tabs.map(([p,ico,label])=>`<button type="button" class="nav-btn ${page===p?'current':''}" data-a="nav" data-p="${p}" ${page===p?'aria-current="page"':''}><span class="nav-symbol">${ico}</span><span>${label}</span></button>`).join('')}</nav>`;}
function frame(content,focus=false){return `<div class="shell ${focus?'focus':''}">${focus?'':header()}${content}</div>${focus?'':bottomNav()}`;}
function pathScreen(){const furthest=furthestUnlocked(),upcoming=nextLesson();const h=lessons.length*124+100;
 const X=[165,221,229,165,100,109,165,220,229,165,100];const Y=lessons.map((_,i)=>92+i*124);
 const segs=[];for(let i=1;i<X.length;i++){const a=i-1;segs.push(`C ${X[a]} ${Y[a]+64}, ${X[i]} ${Y[i]-64}, ${X[i]} ${Y[i]}`);}const path=`M ${X[0]} ${Y[0]} ${segs.join(' ')}`;
 let green=`M ${X[0]} ${Y[0]}`;for(let i=1;i<=Math.min(furthest,X.length-1);i++)green+=` C ${X[i-1]} ${Y[i-1]+64}, ${X[i]} ${Y[i]-64}, ${X[i]} ${Y[i]}`;
 return `<section class="path-hero"><div class="eyebrow">РАЗДЕЛ 1 · ОСНОВЫ</div><h1>Начни говорить<br>по-грузински 🇬🇪</h1><p>Короткие уроки, как ты привык. Двигайся по дорожке и собирай XP.</p><div class="hero-mascot" aria-hidden="true">გ<span>✦</span></div></section>
 <div class="overview"><div><b>${completedCount()} / ${lessons.length}</b><span>уроков пройдено</span></div><div><b>${state.xp} XP</b><span>заработано</span></div><div><b>∞</b><span>занимайся бесплатно</span></div></div>
 <div class="section-heading"><h2>Твоя дорожка</h2><span>${lessons.length} уровней</span></div><div class="pathboard" style="height:${h}px">
 <svg class="pathlines" viewBox="0 0 330 ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${path}" fill="none" stroke="#e3e9e6" stroke-width="15" stroke-linecap="round"/><path d="${green}" fill="none" stroke="#69c69f" stroke-width="15" stroke-linecap="round"/></svg>
 ${lessons.map((l,i)=>{const done=!!state.completed[l.id],locked=!isUnlocked(i),active=upcoming.id===l.id;return `<button type="button" class="route-node ${done?'done':locked?'locked':active?'active':'open'}" style="left:${(X[i]/330*100).toFixed(3)}%;top:${Y[i]}px" data-a="lesson" data-id="${l.id}" ${locked?'disabled aria-label="Урок заблокирован"':''}><span class="route-bubble">${done?'✓':locked?'⌑':safe(l.symbol)}</span><span class="route-name">${safe(l.title)}</span>${active?'<span class="route-current">НАЧАТЬ</span>':''}</button>`;}).join('')}
 </div><div class="end-path">🏁 Дальше будет ещё больше уроков</div>`;
}
function home(){return frame(pathScreen());}
function alphabet(){return frame(`<div class="page-intro"><div class="eyebrow green">ОТДЕЛЬНАЯ ТРЕНИРОВКА</div><h1>Грузинский алфавит</h1><p>33 буквы письма мхедрули. Нажимай на буквы, чтобы посмотреть подсказки.</p></div><div class="letter-grid">${letters.map(e=>`<button type="button" class="letter-tile" data-a="letter" data-id="${e.id}"><strong>${e.ge}</strong><small>${safe(e.ru)}</small></button>`).join('')}</div><p class="note">Русские обозначения звуков приблизительны. Некоторые грузинские согласные требуют отдельной тренировки произношения.</p>`);}
function letter(){const e=byId[letterId]||letters[0];return frame(`<button class="text-back" data-a="nav" data-p="alphabet">‹ Все буквы</button><div class="big-letter">${e.ge}</div><div class="letter-name">Звучание: ${safe(e.ru)}</div><button class="btn secondary centered" data-a="speak" data-word="${safe(e.ge)}">♪ Послушать произношение</button><p class="note center">Озвучивание работает, только если на iPhone установлен грузинский голос. При его отсутствии приложение честно сообщит об этом.</p>`);}
function practice(){const due=dueItems();return frame(`<div class="page-intro"><div class="eyebrow green">ПОВТОРЕНИЕ</div><h1>Тренируй память</h1><p>Слова, в которых были ошибки, возвращаются чаще.</p></div><div class="practice-box"><div class="practice-emoji">↻</div><h2>${due.length?`${due.length} карточек ждут тебя`:'Ты всё повторил!'}</h2><p>${due.length?'Повтори знакомые буквы и слова, чтобы лучше запомнить.':'Как только появятся карточки на повторение, они будут здесь.'}</p><button class="btn primary full" data-a="review" ${due.length?'':'disabled'}>Начать тренировку</button></div><div class="mini-stats"><div><b>${Object.keys(state.sr).filter(id=>byId[id]).length}</b><span>изученных карточек</span></div><div><b>${due.length}</b><span>к повторению</span></div></div>`);}
function profile(){return frame(`<div class="page-intro"><div class="eyebrow green">МОИ ДОСТИЖЕНИЯ</div><h1>Твой прогресс</h1><p>Результаты хранятся на этом устройстве. Регистрация не нужна.</p></div><div class="profile-banner"><div class="profile-badge">გ</div><div><div class="profile-title">Изучаю грузинский!</div><div class="muted">КартулиГО v${APP_VERSION}</div></div></div><div class="mini-stats three"><div><b>⚡ ${state.xp}</b><span>опыта</span></div><div><b>🔥 ${state.streak}</b><span>дней подряд</span></div><div><b>✓ ${completedCount()}</b><span>уроков</span></div></div><div class="settings-panel"><h2>Настройки</h2><label class="toggle-row"><span>Звуковые эффекты</span><input type="checkbox" id="sound-toggle" ${state.settings.sound?'checked':''}/></label><p class="note">Звуки обратной связи синтезируются на устройстве. Для грузинского озвучивания нужен установленный голос.</p></div><div class="settings-panel"><h2>Сохранение прогресса</h2><p class="muted">Перед обновлениями рекомендуется сделать резервную копию.</p><button class="btn secondary full" data-a="backup">↓ Скачать резервную копию</button><label class="btn outline full import-label" for="restore-file">↑ Восстановить из файла</label><input type="file" id="restore-file" accept=".json,application/json" class="visually-hidden"><button class="danger-link" data-a="reset">Удалить весь прогресс</button></div>`);}
function introduce(){const l=lessonById[lessonIntroId];if(!l){go('home');return '';}return frame(`<div class="lesson-kicker">НОВЫЙ УРОК</div><div class="lesson-intro-icon">${safe(l.symbol)}</div><h1 class="intro-title">${safe(l.title)}</h1><p class="intro-sub">${safe(l.subtitle)}</p><div class="intro-panel"><h3>Что тебя ждёт</h3><div>✦ 12 коротких заданий</div><div>✦ Выбор правильного перевода</div><div>✦ ${l.kind==='alpha'?'Поиск букв и соединение пар':'Сборка фраз и соединение пар'}</div><div>✦ Повтор ошибок в конце урока</div><div class="intro-words">${l.entries.slice(0,4).map(e=>`<span>${safe(e.ge)}</span>`).join('')}</div></div><button class="btn primary full" data-a="start" data-id="${l.id}">НАЧАТЬ УРОК →</button><button class="btn subtle-btn full" data-a="nav" data-p="home">Вернуться к дорожке</button>`,true);}
function makeChoice(l,seed){const item=l.entries[seed%l.entries.length];const reverse=seed%3===2;const field=reverse?'ge':'ru';const pool=shuffle(allEntries.filter(e=>e.kind===l.kind&&e.id!==item.id).map(e=>e[field])).filter((v,i,a)=>v!==item[field]&&a.indexOf(v)===i).slice(0,3);return {type:'choice',entryId:item.id,reverse,correct:item[field],prompt:reverse?item.ru:item.ge,options:shuffle([item[field],...pool]),choice:null,feedback:null,original:true};}
function makePairs(l,seed){const items=shuffle(l.entries).slice(0,Math.min(4,l.entries.length));return {type:'pairs',entries:items,left:shuffle(items.map(e=>e.id)),right:shuffle(items.map(e=>e.id)),leftId:null,matched:[],wrongIds:[],feedback:null,original:true};}
function makeBank(l,seed){const all=sentences[l.id]||[];if(!all.length)return makeChoice(l,seed);const s=all[seed%all.length];const tiles=shuffle([...s.tokens.map((t,i)=>({id:`c${i}`,text:t})),...s.extra.map((t,i)=>({id:`e${i}`,text:t}))]);return {type:'bank',ru:s.ru,tokens:s.tokens,tiles,selected:[],feedback:null,original:true};}
function makeQueue(l){const q=[];for(let i=0;i<6;i++)q.push(makeChoice(l,i));for(let i=0;i<3;i++)q.push(makePairs(l,i));for(let i=0;i<3;i++)q.push(l.kind==='alpha'?makeChoice(l,i+6):makeBank(l,i));return q;}
function freshRetry(q){if(q.type==='choice')return {...q,choice:null,feedback:null,original:false};if(q.type==='bank')return {...q,selected:[],feedback:null,original:false};return {...q,matched:[],leftId:null,wrongIds:[],feedback:null,original:false};}
function launch(lessonId){const l=lessonById[lessonId];if(!l)return;const idx=lessons.findIndex(x=>x.id===lessonId);if(!isUnlocked(idx)){notify('Сначала пройди предыдущие уроки.');return;}session={lessonId,review:false,queue:makeQueue(l),pos:0,base:12,hearts:5,correctBase:0,mistakes:0,xpGain:0,finished:false};go('quiz');}
function launchReview(){const due=dueItems();if(!due.length){notify('Пока нечего повторять.');return;}const items=shuffle(due).slice(0,12);session={lessonId:null,review:true,queue:items.map((e,i)=>{const l=lessons.find(l=>l.entries.some(x=>x.id===e.id));return makeChoice({kind:e.kind,entries:[e]},i);}),pos:0,base:items.length,hearts:5,correctBase:0,mistakes:0,xpGain:0};go('quiz');}
function current(){return session?.queue[session.pos];}
function progressHeader(){const q=current();const total=session.queue.length;const part=Math.min(100,Math.round(session.pos/total*100));return `<header class="quiz-top"><button class="quit" data-a="quit" aria-label="Выйти из урока">✕</button><div class="quiz-progress" role="progressbar" aria-valuenow="${session.pos}" aria-valuemin="0" aria-valuemax="${total}"><span style="width:${part}%"></span></div><div class="hearts" title="Ошибки не блокируют урок">♥ <b>${session.hearts}</b></div></header><div class="quiz-subline">${session.review?'Повторение':safe(lessonById[session.lessonId].title)} · ${session.pos+1}/${total} ${q.original?'':'· исправляем ошибку'}</div>`;}
function quizChoice(q){return `<div class="exercise-label">${q.reverse?'ПЕРЕВЕДИ НА ГРУЗИНСКИЙ':'ВЫБЕРИ ПЕРЕВОД'}</div><h1 class="exercise-title">${q.reverse?'Как это сказать по-грузински?':'Что означает это слово?'}</h1><div class="prompt-card"><span>${safe(q.prompt)}</span>${!q.reverse?`<button class="audio-button" data-a="speak" data-word="${safe(q.prompt)}" aria-label="Послушать">♪</button>`:''}</div><div class="options">${q.options.map((o,i)=>`<button type="button" class="answer-option ${q.choice===i?'chosen':''} ${q.feedback&&o===q.correct?'correct':''} ${q.feedback&&q.choice===i&&!q.feedback.ok?'incorrect':''}" data-a="choose" data-i="${i}" ${q.feedback?'disabled':''}><span class="answer-index">${i+1}</span><span>${safe(o)}</span></button>`).join('')}</div>`;}
function quizBank(q){const selected=q.selected.map(id=>q.tiles.find(t=>t.id===id)).filter(Boolean);const remaining=q.tiles.filter(t=>!q.selected.includes(t.id));return `<div class="exercise-label">СОБЕРИ ПРЕДЛОЖЕНИЕ</div><h1 class="exercise-title">Переведи на грузинский</h1><div class="prompt-card compact">${safe(q.ru)}</div><p class="tiny-instruction">Нажимай слова в правильном порядке.</p><div class="bank-answer">${selected.length?selected.map(t=>`<button class="word-chip selected" data-a="remove-token" data-id="${t.id}" ${q.feedback?'disabled':''}>${safe(t.text)} <small>×</small></button>`).join(''):'<span class="bank-placeholder">Здесь появится твой ответ...</span>'}</div><div class="bank-options">${remaining.map(t=>`<button class="word-chip" data-a="add-token" data-id="${t.id}" ${q.feedback?'disabled':''}>${safe(t.text)}</button>`).join('')}</div>`;}
function quizPairs(q){const done=new Set(q.matched);return `<div class="exercise-label">СОЕДИНИ ПАРЫ</div><h1 class="exercise-title">Найди перевод для каждого слова</h1><p class="tiny-instruction">Выбери грузинское слово, а затем русский перевод.</p><div class="match-columns"><div class="match-col">${q.left.map(id=>`<button class="match-card ${q.leftId===id?'picked':''} ${done.has(id)?'matched':''}" data-a="pair-left" data-id="${id}" ${done.has(id)||q.feedback?'disabled':''}>${safe(byId[id].ge)}</button>`).join('')}</div><div class="match-col">${q.right.map(id=>`<button class="match-card ${done.has(id)?'matched':''}" data-a="pair-right" data-id="${id}" ${done.has(id)||q.feedback?'disabled':''}>${safe(byId[id].ru)}</button>`).join('')}</div></div><div class="match-counter">${q.matched.length}/${q.entries.length} пар найдено</div>`;}
function feedbackBox(q){if(!q.feedback)return '';const ok=q.feedback.ok;return `<div class="response ${ok?'positive':'negative'}" role="status"><div class="response-face">${ok?'✓':'!'}</div><div><b>${ok?'Отлично!':'Почти! Попробуй запомнить'}</b><div>${safe(q.feedback.text||'Продолжай в том же духе!')}</div></div></div>`;}
function quiz(){if(!session)return home();const q=current();if(!q)return '';const pairs=q.type==='pairs';const ready=pairs?false:q.type==='choice'?q.choice!==null:q.selected.length>0;
 return frame(`${progressHeader()}<main class="exercise-body">${q.type==='choice'?quizChoice(q):q.type==='bank'?quizBank(q):quizPairs(q)}</main><div class="quiz-bottom">${feedbackBox(q)}${(pairs&&!q.feedback)?'<div class="pair-guide">Выбирай пары, чтобы продолжить</div>':`<button class="btn ${q.feedback&&!q.feedback.ok?'error-btn':'primary'} full" data-a="${q.feedback?'next':'check'}" ${(!ready&&!q.feedback)?'disabled':''}>${q.feedback?'ПРОДОЛЖИТЬ':'ПРОВЕРИТЬ'}</button>`}</div>`,true);
}
function recordSr(entryId,correct){if(!entryId||!byId[entryId])return;const old=state.sr[entryId]||{stage:0};const stage=correct?Math.min(5,(Number(old.stage)||0)+1):0;state.sr[entryId]={stage,due:addDays(correct?[0,1,3,7,14,30][stage]:0)};save();}
function sound(ok){if(!state.settings.sound)return;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;const c=new Context();const osc=c.createOscillator();const gain=c.createGain();osc.type='sine';osc.frequency.setValueAtTime(ok?659:255,c.currentTime);if(ok)osc.frequency.setValueAtTime(880,c.currentTime+.075);gain.gain.setValueAtTime(.07,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+.16);osc.connect(gain);gain.connect(c.destination);osc.start();osc.stop(c.currentTime+.17);osc.onended=()=>c.close();}catch{}}
function markAnswer(q,ok,explain,ids=[]){if(q.feedback)return;if(!ok){session.hearts=Math.max(0,session.hearts-1);session.mistakes++;for(const id of ids)recordSr(id,false);session.queue.push(freshRetry(q));}else{if(q.original)session.correctBase++;session.xpGain+=q.original?10:3;for(const id of ids)recordSr(id,true);}
 q.feedback={ok,text:explain};sound(ok);render();}
function check(){const q=current();if(!q||q.feedback||q.type==='pairs')return;if(q.type==='choice'){if(q.choice===null)return;const ok=q.options[q.choice]===q.correct;markAnswer(q,ok,ok?'Верный перевод!':`Правильно: ${q.correct}`, [q.entryId]);}else if(q.type==='bank'){const chosen=q.selected.map(id=>q.tiles.find(t=>t.id===id)?.text);if(!chosen.length)return;const ok=JSON.stringify(chosen)===JSON.stringify(q.tokens);markAnswer(q,ok,ok?'Предложение составлено правильно.':`Правильный ответ: ${q.tokens.join(' ')}`);}}
function pairLeft(id){const q=current();if(!q||q.type!=='pairs'||q.feedback||q.matched.includes(id))return;q.leftId=id;render();}
function pairRight(id){const q=current();if(!q||q.type!=='pairs'||q.feedback||!q.leftId||q.matched.includes(id))return;if(id===q.leftId){q.matched.push(id);recordSr(id,!q.wrongIds.includes(id));sound(true);q.leftId=null;if(q.matched.length===q.entries.length){const ok=q.wrongIds.length===0;if(!ok){session.queue.push(freshRetry(q));}else{if(q.original)session.correctBase++;session.xpGain+=q.original?10:3;}q.feedback={ok,text:ok?'Все пары найдены!':'В конце урока эти пары встретятся снова.'};}}
 else{if(!q.wrongIds.includes(q.leftId)){q.wrongIds.push(q.leftId);recordSr(q.leftId,false);session.hearts=Math.max(0,session.hearts-1);session.mistakes++;}sound(false);q.leftId=null;notify('Не та пара. Попробуй ещё!');}render();}
function nextQuestion(){if(!current()?.feedback)return;session.pos++;if(session.pos>=session.queue.length)finish();else{render();window.scrollTo(0,0);}}
function finish(){const l=session.lessonId;const previously=l&&state.completed[l];if(l)state.completed[l]=true;updateStreak();if(l&&!previously)session.xpGain+=25;state.xp+=session.xpGain;save();resultData={lessonId:l,review:session.review,xp:session.xpGain,mistakes:session.mistakes,correct:session.correctBase,total:session.base,first:!previously};session=null;go('result');}
function result(){if(!resultData)return home();const r=resultData;return frame(`<div class="finish-glow"></div><div class="finish-award">🏆</div><div class="finish-eyebrow">УРОК ЗАВЕРШЁН!</div><h1 class="finish-title">Вот это да!</h1><p class="finish-sub">${r.review?'Отличное повторение':safe(lessonById[r.lessonId].title)}. Ты дошёл до конца и исправил все ошибки.</p><div class="reward-grid"><div><div>⚡</div><strong>+${r.xp}</strong><span>XP</span></div><div><div>🎯</div><strong>${Math.round(r.correct/Math.max(1,r.total)*100)}%</strong><span>с первого раза</span></div><div><div>❤️</div><strong>${r.mistakes}</strong><span>ошибок исправлено</span></div></div>${r.first?'<p class="bonus">✨ Первый раз прошёл урок — бонус +25 XP!</p>':''}<button class="btn primary full" data-a="nav" data-p="home">К ДОРОЖКЕ →</button>`,true);}
function render(){const el=document.getElementById('app');if(!el)return;const pages={home,alphabet,letter,practice,profile,introduce,quiz,result};el.innerHTML=(pages[page]||home)();}
function speak(word){if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){notify('На этом устройстве озвучка недоступна.');return;}const voices=speechSynthesis.getVoices();const ka=voices.find(v=>/^ka(?:-|_|$)/i.test(v.lang));if(!ka){notify('Грузинского голоса на устройстве нет. Записи добавим отдельно.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.voice=ka;u.lang='ka-GE';u.rate=.82;speechSynthesis.speak(u);}
function backup(){const b={app:'kartuligo',version:3,exportedAt:new Date().toISOString(),progress:state};const url=URL.createObjectURL(new Blob([JSON.stringify(b,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='kartuligo-progress-'+dateKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);notify('Резервная копия готова.');}
function restore(file){if(!file)return;if(file.size>2000000){notify('Файл слишком большой.');return;}const r=new FileReader();r.onload=()=>{try{const b=JSON.parse(String(r.result));if(!b||!['gamardzhoba','kartuligo'].includes(b.app)||!b.progress||typeof b.progress!=='object')throw Error('bad backup');if(!confirm('Заменить текущий прогресс данными из резервной копии?'))return;state=normalize(b.progress);save();go('profile');notify('Прогресс восстановлен.');}catch{notify('Неизвестный формат резервной копии.');}};r.readAsText(file);}
document.addEventListener('change',e=>{if(e.target?.id==='restore-file')restore(e.target.files?.[0]);if(e.target?.id==='sound-toggle'){state.settings.sound=e.target.checked;save();}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const act=b.dataset.a;
 if(act==='nav'){go(b.dataset.p);return;}
 if(act==='lesson'){lessonIntroId=b.dataset.id;go('introduce');return;}
 if(act==='start'){launch(b.dataset.id);return;}
 if(act==='letter'){letterId=b.dataset.id;go('letter');return;}
 if(act==='review'){launchReview();return;}
 if(act==='quit'){if(confirm('Выйти из урока? Пройденные задания этого урока не будут засчитаны.')){session=null;go('home');}return;}
 if(act==='choose'){const q=current();if(!q||q.feedback)return;q.choice=Number(b.dataset.i);render();return;}
 if(act==='add-token'){const q=current();if(!q||q.feedback||q.type!=='bank'||q.selected.includes(b.dataset.id))return;q.selected.push(b.dataset.id);render();return;}
 if(act==='remove-token'){const q=current();if(!q||q.feedback||q.type!=='bank')return;q.selected=q.selected.filter(id=>id!==b.dataset.id);render();return;}
 if(act==='pair-left'){pairLeft(b.dataset.id);return;}
 if(act==='pair-right'){pairRight(b.dataset.id);return;}
 if(act==='check'){check();return;}
 if(act==='next'){nextQuestion();return;}
 if(act==='speak'){speak(b.dataset.word);return;}
 if(act==='backup'){backup();return;}
 if(act==='reset'){if(confirm('Удалить весь прогресс? Без резервной копии восстановить его нельзя.')){state=emptyState();save();go('profile');notify('Прогресс сброшен.');}return;}
});
render();
