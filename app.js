'use strict';
// No paid APIs, tracking, accounts, network requests or dependencies.
const STORAGE_KEY = 'gamardzhoba_progress_v1';
const mk = (prefix, rows, kind) => rows.map((r, i) => ({id: `${prefix}-${String(i+1).padStart(2,'0')}`, ge:r[0], ru:r[1], trans:r[2] || r[1], kind}));
const letters = mk('alpha', [
  ['ა','а'],['ბ','б'],['გ','г'],['დ','д'],['ე','э'],['ვ','в'],
  ['ზ','з'],['თ','т (с придыханием)'],['ი','и'],['კ','к (резкая)'],['ლ','л'],['მ','м'],
  ['ნ','н'],['ო','о'],['პ','п (резкая)'],['ჟ','ж'],['რ','р'],['ს','с'],
  ['ტ','т (резкая)'],['უ','у'],['ფ','п (с придыханием)'],['ქ','к (с придыханием)'],['ღ','гъ (гортанная)'],['ყ','къ (гортанная резкая)'],
  ['შ','ш'],['ჩ','ч (с придыханием)'],['ც','ц (с придыханием)'],['ძ','дз'],['წ','ц (резкая)'],['ჭ','ч (резкая)'],
  ['ხ','х'],['ჯ','дж'],['ჰ','х (лёгкий выдох)']
], 'alpha');
const greetings = mk('greet', [
  ['გამარჯობა','Привет / здравствуйте','гамарджоба'],
  ['მადლობა','Спасибо','мадлоба'],
  ['ნახვამდის','До свидания','нахвамдис'],
  ['დიახ','Да','диах'],
  ['არა','Нет','ара'],
  ['ბოდიში','Извините','бодиши']
], 'word');
const cafe = mk('cafe', [
  ['წყალი','Вода','цкали'],
  ['პური','Хлеб','пури'],
  ['ჩაი','Чай','чай'],
  ['ყავა','Кофе','кава'],
  ['რძე','Молоко','рдзе'],
  ['შაქარი','Сахар','шакари']
], 'word');
const numbers = mk('num', [
  ['ერთი','Один','эрти'],
  ['ორი','Два','ори'],
  ['სამი','Три','сами'],
  ['ოთხი','Четыре','отхи'],
  ['ხუთი','Пять','хути'],
  ['ექვსი','Шесть','эквси']
], 'word');
const phrases = mk('phrase', [
  ['როგორ ხარ?','Как дела? (неформально)','рогор хар?'],
  ['კარგად','Хорошо','каргад'],
  ['მე მქვია...','Меня зовут...','ме мквиа...'],
  ['არ მესმის','Я не понимаю','ар месмис'],
  ['გთხოვთ','Пожалуйста (в просьбе)','гтховт'],
  ['სად არის?','Где находится?','сад арис?']
], 'word');
const travel = mk('travel', [
  ['რამდენი ღირს?','Сколько стоит?','рамдени гирс?'],
  ['წყალი მინდა','Я хочу воды','цкали минда'],
  ['ერთი ჩაი, გთხოვთ','Один чай, пожалуйста','эрти чай, гтховт'],
  ['ანგარიში, გთხოვთ','Счёт, пожалуйста','ангариши, гтховт'],
  ['მარცხნივ','Налево','марцхнив'],
  ['მარჯვნივ','Направо','марджвнив']
], 'word');
const lessons = [
  ...Array.from({length:6}, (_,i)=>({id:'alphabet-'+(i+1), title:'Алфавит · часть '+(i+1), subtitle:i===0?'Начнём с первых шести букв':'Знакомимся с новыми буквами', kind:'alpha', symbol:['ა','ზ','ნ','ტ','შ','ხ'][i], entries:letters.slice(i*6,i*6+6)})),
  {id:'greetings',title:'Приветствия',subtitle:'Привет, спасибо, пока',kind:'word',symbol:'👋',entries:greetings},
  {id:'food',title:'В кафе',subtitle:'Вода, хлеб, чай и кофе',kind:'word',symbol:'☕',entries:cafe},
  {id:'numbers',title:'Числа 1–6',subtitle:'Научимся считать',kind:'word',symbol:'🔢',entries:numbers},
  {id:'basic-phrases',title:'Первые фразы',subtitle:'Знакомство и простые вопросы',kind:'word',symbol:'💬',entries:phrases},
  {id:'getting-around',title:'В городе',subtitle:'Кафе, цены и направления',kind:'word',symbol:'🧭',entries:travel}
];
const allEntries = lessons.flatMap(l => l.entries);
const entryById = Object.fromEntries(allEntries.map(e => [e.id,e]));
const lessonById = Object.fromEntries(lessons.map(l => [l.id,l]));
function emptyState(){return {xp:0,streak:0,lastStudyDay:'',completed:{},sr:{}};}
function readState(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return x&&typeof x==='object'?{...emptyState(),...x,completed:x.completed||{},sr:x.sr||{}}:emptyState();}catch{return emptyState();}}
let state=readState();
let view={page:'home'};
let toastTimeout;
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){notify('Не удалось сохранить прогресс — проверь свободное место.');}}
function localDay(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function dayAfter(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return localDay(d);}
function yesterday(){const d=new Date();d.setDate(d.getDate()-1);return localDay(d);}
function touchStreak(){const today=localDay();if(state.lastStudyDay!==today){state.streak=state.lastStudyDay===yesterday()?state.streak+1:1;state.lastStudyDay=today;save();}}
function dueEntries(){return allEntries.filter(e=>state.sr[e.id]&&state.sr[e.id].due<=localDay());}
function learnedCount(){return Object.keys(state.sr).filter(k=>!!entryById[k]).length;}
function completedCount(){return lessons.filter(l=>state.completed[l.id]).length;}
function nextLesson(){return lessons.find(l=>!state.completed[l.id])||lessons[0];}
function nextDueText(){const dates=Object.values(state.sr).map(x=>x&&x.due).filter(d=>d>localDay()).sort();if(!dates.length)return 'Пока нет карточек для повторения';return 'Следующее повторение: '+new Date(dates[0]+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});}
function shuffle(a){const result=[...a];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function ehtml(x){return String(x).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}
function notify(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('visible'),3300);}
function goto(page,extra={}){view={page,...extra};render();window.scrollTo(0,0);}
function nav(){const items=[['home','⌂','Главная'],['alphabet','ა','Алфавит'],['review','◷','Повторить'],['profile','◉','Профиль']];return `<nav class="bottom-nav" aria-label="Разделы приложения">${items.map(([page,icon,label])=>`<button type="button" class="nav-item ${view.page===page?'active':''}" data-action="nav" data-page="${page}" aria-current="${view.page===page?'page':'false'}"><span class="nav-ico">${icon}</span><span>${label}</span></button>`).join('')}</nav>`;}
function header(){return `<header class="top"><div class="brand"><span class="brand-logo">გ</span><div><div class="brand-name">КартулиГО</div><div class="brand-note">Грузинский с нуля 🇬🇪</div></div></div><span class="xp-pill">⭐ <b>${state.xp}</b> XP</span></header>`;}
function wrap(content,focus=false){return `<div class="shell${focus?' focus':''}">${focus?'':header()}${content}</div>${focus?'':nav()}`;}
function stats(){return `<div class="stats"><div class="stat"><div class="num">🔥 ${state.streak}</div><div class="desc">дней подряд</div></div><div class="stat"><div class="num">${completedCount()}/${lessons.length}</div><div class="desc">уроков</div></div><div class="stat"><div class="num">${learnedCount()}</div><div class="desc">знакомых слов</div></div></div>`;}
function lessonRow(l,i){const done=state.completed[l.id];return `<button class="lesson-row ${done?'done':''}" type="button" data-action="start-lesson" data-id="${l.id}"><div class="lesson-number">${done?'✓':l.symbol}</div><div class="lesson-info"><div class="lesson-title">${ehtml(l.title)}</div><div class="lesson-detail">${ehtml(l.subtitle)} · ${l.entries.length} карточек</div></div><span class="lesson-chevron">›</span></button>`;}
function home(){const l=nextLesson();return wrap(`<div class="hello">Твой личный курс языка</div><h1 class="headline">გამარჯობა! 👋<br>Начнём говорить по-грузински</h1><section class="hero"><div class="eyebrow">ТВОЙ СЛЕДУЮЩИЙ УРОК</div><h2>${ehtml(l.title)}</h2><p>${ehtml(l.subtitle)}. Всего несколько минут в день — и слова станут знакомыми.</p><button type="button" data-action="start-lesson" data-id="${l.id}">Начать урок →</button></section>${stats()}<div class="section-row"><h2>Путь обучения</h2><span>${lessons.length} уроков</span></div>${lessons.map(lessonRow).join('')}<p class="footer-note">Бесплатно · Без регистрации · Прогресс на этом устройстве</p>`);}
function alphabet(){return wrap(`<h1 class="page-title">Грузинский алфавит</h1><p class="muted">Все 33 буквы современного грузинского письма — мхедрули. Нажми на любую букву, чтобы увидеть подсказку.</p><div class="section-row"><h2>33 буквы</h2><span>ქართული ანბანი</span></div><div class="letter-grid">${letters.map(e=>`<button type="button" class="letter-tile" data-action="letter" data-id="${e.id}"><span class="glyph">${e.ge}</span><span class="latin">${ehtml(e.ru)}</span></button>`).join('')}</div><div class="panel" style="margin-top:19px"><strong>О произношении</strong><p class="muted" style="margin-bottom:0">Русские подсказки приблизительные. В грузинском есть звуки, которых нет в русском: придыхательные и резкие (абруптивные) согласные.</p></div>`);}
function letterDetail(){const e=entryById[view.id];if(!e)return alphabet();const idx=letters.findIndex(l=>l.id===e.id);const l=lessons.find(x=>x.entries.some(z=>z.id===e.id));return wrap(`<button class="back" data-action="nav" data-page="alphabet">← К алфавиту</button><div class="panel letter-detail"><div class="subtle">Буква ${idx+1} из 33</div><div class="large">${e.ge}</div><h2>Звучит примерно как «${ehtml(e.ru)}»</h2><p class="muted">Русская подсказка не заменяет звучание носителя языка.</p><button class="button secondary" data-action="speak" data-word="${e.ge}">🔊 Послушать (если есть голос)</button></div><button class="button primary full" style="margin-top:18px" data-action="start-lesson" data-id="${l.id}">Урок с этой буквой →</button>`);}
function review(){const due=dueEntries();return wrap(`<h1 class="page-title">Повторение 🧠</h1><p class="muted">Правильные ответы возвращаются через 1, 3, 7, 14 и 30 дней. Ошибки можно повторить сразу.</p><div class="panel block-gap"><div class="row space-between"><strong>К повторению сегодня</strong><span class="tag">${due.length} карточек</span></div><div style="font-size:45px;font-weight:850;margin:14px 0">${due.length}</div>${due.length?'<button class="button primary full" data-action="start-review">Повторить сейчас →</button>':'<div class="muted">Пока нечего повторять. Пройди урок или загляни сюда позже.</div>'}</div><div class="panel"><strong>Когда вернуться?</strong><p class="muted" style="margin-bottom:0">${ehtml(nextDueText())}</p></div>`);}
function profile(){return wrap(`<h1 class="page-title">Мой прогресс</h1><div class="profile-card"><div class="avatar">🇬🇪</div><div><h2>Исследователь Грузии</h2><div class="muted">Каждый урок приближает к свободной речи</div></div></div>${stats()}<div class="section-row"><h2>Статистика</h2></div><div class="tiny-list"><div class="panel row space-between"><span>⭐ Получено опыта</span><b>${state.xp} XP</b></div><div class="panel row space-between"><span>📚 Завершено уроков</span><b>${completedCount()}</b></div><div class="panel row space-between"><span>🧠 Изучено карточек</span><b>${learnedCount()}</b></div></div><div class="section-row"><h2>Мои данные</h2></div><div class="panel"><p class="muted">Прогресс хранится только в браузере этого iPhone. Чтобы не потерять его при очистке Safari или смене телефона, сделай резервную копию.</p><button class="button secondary full" data-action="backup">↓ Скачать резервную копию</button><label class="button ghost full" style="margin-top:10px;cursor:pointer">↑ Восстановить из файла<input type="file" id="restore-file" accept=".json,application/json" style="display:none"></label><div class="separator"></div><button class="button ghost full" data-action="reset">Сбросить весь прогресс</button></div><p class="footer-note">Никаких аккаунтов, аналитики и платных функций. Все данные остаются у тебя.</p>`);}
function learn(){const l=lessonById[view.lessonId];if(!l)return home();const idx=view.cardIndex||0;const e=l.entries[idx];return wrap(`<button class="back" data-action="nav" data-page="home">← К урокам</button><div class="row space-between"><b>${ehtml(l.title)}</b><span class="card-counter">${idx+1} / ${l.entries.length}</span></div><div class="progress-track" style="margin:13px 0 3px"><span style="width:${((idx+1)/l.entries.length)*100}%"></span></div><div class="study-card"><div class="subtle">${l.kind==='alpha'?'ГРУЗИНСКАЯ БУКВА':'ПО-ГРУЗИНСКИ'}</div><div class="study-word">${ehtml(e.ge)}</div>${l.kind==='word'?`<div class="study-transcription">[${ehtml(e.trans)}]</div>`:''}<div class="study-meaning">${l.kind==='alpha'?'Примерный звук: ':''}${ehtml(e.ru)}</div><button class="speak-btn" type="button" title="Воспроизвести, если доступен грузинский голос" aria-label="Воспроизвести" data-action="speak" data-word="${ehtml(e.ge)}">🔊</button><div class="subtle" style="margin-top:8px">Озвучка зависит от устройства</div></div><div class="study-actions"><button class="button ghost" data-action="card-prev" ${idx===0?'disabled':''}>← Назад</button><button class="button primary" data-action="card-next">${idx===l.entries.length-1?'Перейти к тесту →':'Следующая →'}</button></div><p class="footer-note">Сначала познакомься с карточками, затем проверь себя</p>`,true);}
function buildQuestion(item,index){const reversed=index%2===1;const key=reversed?'ge':'ru';const kind=item.kind;const pool=allEntries.filter(x=>x.kind===kind&&x.id!==item.id);const correct=item[key];const wrongs=shuffle(pool).map(x=>x[key]).filter((x,i,a)=>x!==correct&&a.indexOf(x)===i).slice(0,3);const opts=shuffle([correct,...wrongs]);return {item,reverse:reversed,correct,options:opts};}
function startQuiz(lessonId,reviewItems){const isReview=Array.isArray(reviewItems);const l=lessonById[lessonId];if(!isReview&&!l){goto('home');return;}
  const items=isReview?shuffle(reviewItems).slice(0,12):shuffle(l.entries);
  const qs=items.map((item,i)=>buildQuestion(item,i));
  goto('quiz',{quiz:{lessonId:isReview?null:lessonId,isReview,questions:qs,pos:0,selected:null,feedback:null,correctCount:0}});
}
function quiz(){const q=view.quiz;if(!q)return home();const current=q.questions[q.pos];if(!current)return home();const {item,reverse}=current;const opts=current.options;const label=reverse?'Выбери грузинское слово':'Выбери правильный перевод';return wrap(`<button class="back" data-action="quit-quiz">← Выйти из задания</button><div class="row space-between"><b>${q.isReview?'Повторение':ehtml(lessonById[q.lessonId].title)}</b><span class="card-counter">${q.pos+1} / ${q.questions.length}</span></div><div class="progress-track" style="margin:13px 0 20px"><span style="width:${100*(q.pos+(q.feedback?1:0))/q.questions.length}%"></span></div><div class="quiz-hint">${label.toUpperCase()}</div><div class="question">${reverse?'Как будет по-грузински?':'Что означает это слово?'}</div><div class="question-word ${reverse?'russian':''}">${ehtml(reverse?item.ru:item.ge)}</div><div class="choices">${opts.map((op,i)=>{let cls=q.selected===op?'selected':'';if(q.feedback){cls=op===current.correct?'right':(q.selected===op?'wrong':'');}return `<button class="choice ${cls}" type="button" data-action="choose" data-choice="${i}" ${q.feedback?'disabled':''} aria-pressed="${q.selected===op}"><span class="letter">${i+1}</span><span>${ehtml(op)}</span></button>`;}).join('')}</div>${q.feedback?`<div class="feedback ${q.feedback.correct?'ok':'bad'}">${q.feedback.correct?'✓ Верно! +10 XP':'✕ Не совсем. Правильный ответ: '+ehtml(current.correct)}</div>`:''}<div class="quiz-footer"><button type="button" class="button primary full" data-action="${q.feedback?'next-question':'check-answer'}" ${q.selected===null&&!q.feedback?'disabled':''}>${q.feedback?(q.pos===q.questions.length-1?'Завершить урок ✓':'Продолжить →'):'Проверить ответ'}</button></div>`,true);}
function recordAnswer(item,correct){const record=state.sr[item.id]||{stage:0};if(correct){const stage=Math.min((record.stage||0)+1,5);state.sr[item.id]={stage,due:dayAfter([0,1,3,7,14,30][stage])};state.xp+=10;}else{state.sr[item.id]={stage:0,due:localDay()};}save();}
function finishQuiz(q){const total=q.questions.length,score=q.correctCount;const ratio=score/total;let firstPass=false;if(!q.isReview&&ratio>=0.75&&!state.completed[q.lessonId]){state.completed[q.lessonId]=true;state.xp+=25;firstPass=true;}touchStreak();save();goto('result',{result:{isReview:q.isReview,lessonId:q.lessonId,score,total,firstPass,passed:ratio>=.75}});}
function result(){const r=view.result;if(!r)return home();return wrap(`<div class="result-emblem">${r.passed?'🏆':'💪'}</div><h1 class="result-title">${r.passed?'Отличная работа!':'Попробуем ещё раз?'}</h1><p class="result-desc">${r.isReview?'Повторение завершено':ehtml(lessonById[r.lessonId].title)}</p><div class="result-score">${r.score} / ${r.total}</div><div class="panel" style="text-align:center;margin-bottom:17px"><div style="font-size:22px;font-weight:850;color:#21805d">+${r.score*10+(r.firstPass?25:0)} XP</div><p class="muted">${r.firstPass?'Новый урок завершён! Бонус +25 XP.':r.passed?'Продолжай в том же духе!':'Чтобы открыть отметку о прохождении, нужно 75% правильных ответов.'}</p></div><button class="button primary full" data-action="nav" data-page="home">К урокам →</button>${!r.isReview&&!r.passed?`<button class="button ghost full" style="margin-top:10px" data-action="start-lesson" data-id="${r.lessonId}">Повторить урок</button>`:''}`,true);}
function render(){document.getElementById('app').innerHTML=({home,alphabet,letter:letterDetail,review,profile,learn,quiz,result}[view.page]||home)();}
function speak(word){if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){notify('Озвучка недоступна в этом браузере.');return;}const voices=window.speechSynthesis.getVoices();const ka=voices.find(v=>/^ka([-_]|$)/i.test(v.lang));if(!ka){notify('На устройстве не найден грузинский голос. Позже добавим записи носителей.');return;}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='ka-GE';u.voice=ka;u.rate=.82;window.speechSynthesis.speak(u);}
function backup(){const blob=new Blob([JSON.stringify({app:'gamardzhoba',version:1,exportedAt:new Date().toISOString(),progress:state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='gamardzhoba-progress-'+localDay()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);notify('Резервная копия подготовлена.');}
function restore(file){if(!file)return;if(file.size>2_000_000){notify('Файл слишком большой.');return;}const reader=new FileReader();reader.onload=()=>{try{const b=JSON.parse(String(reader.result));if(b.app!=='gamardzhoba'||b.version!==1||!b.progress||typeof b.progress!=='object')throw Error('Invalid backup');const p=b.progress;state={xp:Number.isFinite(p.xp)?Math.max(0,Math.floor(p.xp)):0,streak:Number.isFinite(p.streak)?Math.max(0,Math.floor(p.streak)):0,lastStudyDay:typeof p.lastStudyDay==='string'?p.lastStudyDay:'',completed:p.completed&&typeof p.completed==='object'?p.completed:{},sr:p.sr&&typeof p.sr==='object'?p.sr:{}};save();goto('profile');notify('Прогресс восстановлен.');}catch(e){notify('Это не резервная копия «Гамарджоба».');}};reader.readAsText(file);}
document.addEventListener('change',e=>{if(e.target&&e.target.id==='restore-file')restore(e.target.files[0]);});
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
  if(action==='nav'){goto(b.dataset.page);return;}
  if(action==='start-lesson'){goto('learn',{lessonId:b.dataset.id,cardIndex:0});return;}
  if(action==='letter'){goto('letter',{id:b.dataset.id});return;}
  if(action==='card-prev'){view.cardIndex=Math.max(0,view.cardIndex-1);render();return;}
  if(action==='card-next'){const l=lessonById[view.lessonId];if(view.cardIndex<l.entries.length-1){view.cardIndex++;render();}else{startQuiz(view.lessonId);}return;}
  if(action==='start-review'){const due=dueEntries();if(due.length)startQuiz(null,due);return;}
  if(action==='quit-quiz'){goto(view.quiz.isReview?'review':'home');return;}
  if(action==='choose'){const q=view.quiz;if(q.feedback)return;q.selected=q.questions[q.pos].options[Number(b.dataset.choice)];render();return;}
  if(action==='check-answer'){const q=view.quiz;if(q.selected===null||q.feedback)return;const current=q.questions[q.pos];const correct=q.selected===current.correct;q.feedback={correct};if(correct)q.correctCount++;recordAnswer(current.item,correct);render();return;}
  if(action==='next-question'){const q=view.quiz;if(!q.feedback)return;if(q.pos===q.questions.length-1){finishQuiz(q);}else{q.pos++;q.selected=null;q.feedback=null;render();window.scrollTo(0,0);}return;}
  if(action==='speak'){speak(b.dataset.word);return;}
  if(action==='backup'){backup();return;}
  if(action==='reset'){if(confirm('Точно удалить весь прогресс на этом устройстве? Это действие нельзя отменить без резервной копии.')){state=emptyState();save();goto('profile');notify('Прогресс сброшен.');}return;}
});
render();
