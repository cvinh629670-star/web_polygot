// Gắn Grammar Lab vào phòng luyện tập hiện có, sử dụng cùng ngôn ngữ và kho từ.
const grammarLab = (() => {
 const repo = grammarLabRepository;
 const engine = grammarLabEngine;
 const { languages, types } = grammarLabContent;
 const tabs = { home:'Tổng quan', grammar:'Kiến thức', practice:'Luyện tập', review:'Ôn tập', profile:'Hồ sơ' };
 const icons = { home:'house', grammar:'book-open', practice:'pen', review:'rotate', profile:'user' };
 const modes = { quick:'Luyện nhanh', topic:'Theo chủ đề', level:'Theo cấp độ', weak:'Luyện điểm yếu', mixed:'Trộn kiến thức',
  speed:'Thử thách tốc độ', translation:'Luyện dịch', daily:'Thử thách hôm nay', boss:'Weekly Boss', custom:'Tùy chỉnh' };
 const e = value => escapeHTML(String(value ?? ''));
 const button = (label, action, value = '', primary = false) => `<button type="button" class="lab-button${primary ? ' lab-primary' : ''}" data-action="${action}" data-value="${e(value)}">${label}</button>`;
 const percent = value => value === null ? '—' : value + '%';
 const date = value => new Intl.DateTimeFormat('vi-VN').format(value);
 const choices = (label, name, values, first) => `<label>${label}<select name="${name}">${first ? '<option value="">'+first+'</option>' : ''}
  ${values.map(([value,text])=>`<option value="${e(value)}">${e(text)}</option>`).join('')}</select></label>`;
 let host, language, tab = 'home', bank, profile, session, selectedLesson, openingNotice = '', viewFilters = {};
 let timer;

 function mount(target, lang) {
  host = target;
  if (language !== lang) {
   language = lang;
   selectedLesson = null;
   session = null;
   viewFilters = {};
   tab = 'home';
  }
  host.dataset.lang = lang;
  host.onclick = onClick;
  host.onsubmit = onSubmit;
  host.onchange = onChange;
  render();
 }
 function suspend() {
  clearInterval(timer);
  if (session?.activeAt !== null && session?.activeAt !== undefined) {
   session.elapsed += (performance.now() - session.activeAt)/1000;
   session.activeAt = null;
  }
 }
 function notify(message) {
  const status = host?.querySelector('.lab-status');
  if (status) status.textContent = message;
 }
 function store(change) {
  profile = repo.update(language, change);
 }
 function render() {
  suspend();
  bank = engine.catalog(language);
  let content;
  try {
   profile = repo.read().profiles[language] ?? repo.empty();
   const stats = engine.stats(profile, bank);
   content = ({home, grammar, practice, review, profile:profilePage})[tab](stats);
  } catch (error) {
   content = `<article class="lab-card"><h3>Khôi phục tiến độ</h3><p>${e(error.message)}</p>
    ${button('Nhập bản sao lưu','pick-file')}</article>`;
  }
  host.innerHTML = `<nav class="lab-nav" aria-label="Grammar Lab">${Object.entries(tabs).map(([id,label]) =>
   `<button type="button" data-action="tab" data-value="${id}" ${tab===id ? 'aria-current="page"' : ''}>
     <i class="fa-solid fa-${icons[id]}" aria-hidden="true"></i><span>${label}</span></button>`).join('')}</nav>
   <p class="lab-status" role="status">${e(openingNotice)}</p>
   <div class="lab-page">${content}</div>
   <input type="file" accept=".json,application/json" class="hidden" id="lab-restore-file">`;
  openingNotice = '';
  if (tab === 'practice' && session && !session.finished && !session.feedback) {
   session.activeAt = performance.now();
   if (session.deadline) {
    const update = () => {
     const seconds = Math.max(0,Math.ceil((session.deadline - Date.now())/1000));
     const clock = host.querySelector('[data-clock]');
     if (clock) clock.textContent = Math.floor(seconds/60) + ':' + String(seconds%60).padStart(2,'0');
     if (!seconds) {
      try { finishSession(); openingNotice = 'Đã hết thời gian.'; render(); }
      catch (error) { suspend(); notify(error.message); }
     }
    };
    timer = setInterval(update,250);
    update();
   }
  }
  if (tab === 'profile') drawRadar();
 }
 function metrics(items) {
  return `<div class="lab-metrics">${items.map(([label,value])=>`<div><strong>${e(value)}</strong><span>${label}</span></div>`).join('')}</div>`;
 }
 function progressChart() {
  const dayCounts = {};
  for (const answer of profile.answers) dayCounts[answer.day] = (dayCounts[answer.day] ?? 0) + 1;
  const now = new Date();
  const days = Array.from({length:7},(_,i)=>{
   const day = new Date(now);
   day.setDate(day.getDate()-6+i);
   return [engine.localDay(day),dayCounts[engine.localDay(day)] ?? 0];
  });
  const max = Math.max(1,...days.map(([,value])=>value));
  return `<div class="lab-chart" aria-label="Số câu đã luyện trong 7 ngày">${days.map(([day,value])=>
   `<div><strong>${value}</strong><span class="lab-chart-bar" style="--bar:${value/max*100}%"></span><small>${day.slice(8)}/${day.slice(5,7)}</small></div>`).join('')}</div>`;
 }
 function home(stats) {
  const recent = bank.lessons.find(l=>l.id===profile.lastLesson);
  const suggested = bank.lessons.find(l=>!profile.learned[l.id] && l.prerequisites.every(id=>profile.learned[id])) ??
   stats.due[0] ?? bank.lessons[0];
  return `<article class="lab-welcome"><div>
   <p>${languages[language].name} · ${e(recent?.level ?? suggested?.level ?? '—')}</p>
   <h3>Polygot Grammar Lab</h3>
   <p>${stats.learned.length ? 'Tiếp tục học cấu trúc mới hoặc ôn bài đến hạn.' : 'Chọn một cấu trúc để học hoặc bắt đầu với một phiên luyện nhanh.'}</p>
   <div class="lab-actions">${button('Luyện nhanh','quick','',true)}${recent ? button('Tiếp tục bài gần đây','lesson',recent.id) : ''}</div>
  </div><img src="./assets/grammar-lab-tutor.webp" alt="" width="720" height="480"></article>
  ${metrics([['Rank',stats.rank],['XP',stats.xp],['Chuỗi ngày',stats.streak],['Đã học',stats.learned.length],
   ['Thành thạo',stats.mastered],['Đến hạn',stats.due.length],['Phút luyện hôm nay',Math.round(stats.seconds/60)],['Độ chính xác',percent(stats.accuracy)]])}
  <div class="lab-columns"><article class="lab-card"><h3>Hoạt động 7 ngày</h3>${progressChart()}</article>
   <article class="lab-card"><h3>Nhiệm vụ hôm nay</h3><ul class="lab-list">${stats.quests.map(q=>
    `<li><span>${q.label}</span><strong>${Math.min(q.goal,q.value)}/${q.goal}</strong></li>`).join('')}</ul>
    ${suggested ? `<div><h4>Bài đề xuất</h4>${button(e(suggested.title),'lesson',suggested.id)}</div>` : ''}</article></div>`;
 }
 function learningState(lesson,score) {
  if (profile.reviews[lesson.id]?.next <= Date.now()) return 'Đến hạn ôn';
  if (score >= 95) return 'Thành thạo';
  if (score > 0 || profile.answers.some(a=>a.lessonId===lesson.id)) return 'Đang luyện';
  return profile.learned[lesson.id] ? 'Đang học' : 'Chưa học';
 }
 function grammar(stats) {
  const lesson = bank.lessons.find(l=>l.id===selectedLesson);
  if (lesson) {
   const sections = [['Bản chất',lesson.essence],['Vì sao dùng',lesson.purpose],['Cách dùng',lesson.usage],['Ngữ cảnh',lesson.context],
    ['Lỗi thường gặp',lesson.error],['Phân biệt',lesson.contrast]];
   const example = lesson.example ? `<blockquote lang="${language}">${e(lesson.example)}</blockquote><p>${e(lesson.translation)}</p>` : '';
   return `<article class="lab-card">
    <div class="lab-actions">${button('Về cây kỹ năng','tree')}${button(profile.favorites.includes(lesson.id) ? 'Bỏ yêu thích' : 'Yêu thích','favorite',lesson.id)}</div>
    <h3>${e(lesson.title)}</h3><p>${e(lesson.level)} · ${e(lesson.topic)} · ${e(lesson.priority ?? 'Tự thêm')}</p>
    ${lesson.formula ? `<p class="lab-formula">${e(lesson.formula)}</p>` : ''}
    <dl class="lab-details">${sections.filter(([,text])=>text).map(([label,text])=>`<div><dt>${label}</dt><dd>${e(text)}</dd></div>`).join('')}</dl>
    ${example}${lesson.id==='en-perfect' ? '<div class="lab-timeline" aria-label="Trục thời gian"><span>Việc đã xảy ra</span><span aria-hidden="true">⟶</span><span>Ảnh hưởng hiện tại</span></div>' : ''}
    <div class="lab-actions">${button(profile.learned[lesson.id] ? 'Đã học · luyện bài này' : 'Đánh dấu đã học','learn',lesson.id,true)}
     ${button('Luyện bài này','practice-lesson',lesson.id)}</div></article>`;
  }
  const needle = (viewFilters.query ?? '').trim().toLocaleLowerCase();
  const nodes = stats.scores.filter(({lesson:l,value})=> (!needle || (l.title+' '+l.topic).toLocaleLowerCase().includes(needle)) &&
   (!viewFilters.level || viewFilters.level===l.level) && (!viewFilters.state || viewFilters.state===learningState(l,value)) &&
   (!viewFilters.priority || viewFilters.priority===l.priority) &&
   (!viewFilters.favorites || profile.favorites.includes(l.id)));
  return `<article class="lab-card"><h3>Cây kỹ năng</h3>
   <form data-form="library" class="lab-filters"><label>Tìm cấu trúc<input name="query" type="search" value="${e(viewFilters.query)}"></label>
   ${choices('Cấp độ','level',[...languages[language].levels,'Tự thêm'].map(l=>[l,l]),'Tất cả')}
   ${choices('Tiến độ','state',['Chưa học','Đang học','Đang luyện','Thành thạo','Đến hạn ôn'].map(l=>[l,l]),'Tất cả')}
   ${choices('Độ ưu tiên','priority',['Core','Essential','Advanced','Specialized'].map(l=>[l,l]),'Tất cả')}
   <label class="lab-check"><input name="favorites" type="checkbox" ${viewFilters.favorites?'checked':''}> Yêu thích</label>
   <button class="lab-button lab-primary">Lọc</button></form>
   <div class="lab-actions">${button('Thu nhỏ','zoom-out')}${button('Phóng to','zoom-in')}</div>
   <div class="lab-tree" style="--node-size:${viewFilters.zoom ?? 13}rem">${nodes.map(({lesson:l,value})=>{
    const prior = l.prerequisites.map(id=>bank.lessons.find(item=>item.id===id)?.title ?? id);
    const completed = new Set(profile.answers.filter(a=>a.lessonId===l.id).map(a=>a.questionId)).size;
    return `<button type="button" class="lab-node" data-action="lesson" data-value="${e(l.id)}">
      <span>${e(l.level)} · ${e(l.priority ?? 'Tự thêm')}</span><strong>${e(l.title)}</strong>
      <span class="lab-node-status">${learningState(l,value)} · ${value}% · ${completed} câu</span>
      ${prior.length ? `<small>↳ Nên học trước: ${e(prior.join(', '))}</small>` : ''}</button>`;
   }).join('') || '<p>Không tìm thấy cấu trúc phù hợp.</p>'}</div></article>`;
 }
 function practice() {
  if (!session) {
   const difficulty = [['1','Cơ bản'],['2','Trung bình'],['3','Vận dụng']];
   const topics = [...new Set(bank.lessons.map(l=>l.topic))].map(l=>[l,l]);
   return `<article class="lab-card"><h3>Bài luyện</h3>
    <form class="lab-filters" data-form="start">
    ${choices('Chế độ','mode',Object.entries(modes))}
    ${choices('Chủ đề','topic',topics,'Tất cả')}
    ${choices('Cấp độ','level',languages[language].levels.map(l=>[l,l]),'Tất cả')}
    ${choices('Dạng câu','type',Object.entries(types),'Tất cả')}
    ${choices('Độ khó','difficulty',difficulty,'Tất cả')}
    <label>Số câu<input type="number" name="count" min="1" max="30" value="${profile.settings.count}"></label>
    <label>Giới hạn (phút, 0 là tự do)<input type="number" name="minutes" min="0" max="60" value="${profile.settings.minutes}"></label>
    <label class="lab-check"><input type="checkbox" name="wrong"> Chỉ câu chưa sửa lỗi</label>
    <button class="lab-button lab-primary">Bắt đầu</button></form>
    <p>Điểm năng lực dựa trên câu đã chấm được. Bài tự đánh giá chỉ ghi nhận vào lịch sử luyện tập.</p></article>`;
  }
  if (session.finished) {
   return `<article class="lab-card"><h3 tabindex="-1">Kết quả phiên luyện</h3>${metrics([['Đúng',session.correct],['Sai',session.wrong],
    ['Tự đánh giá',session.self],['Đã làm',session.index]])}<div class="lab-actions">${button('Luyện phiên mới','new','',true)}${button('Xem bài cần ôn','tab','review')}</div></article>`;
  }
  const q = session.queue[session.index];
  const hint = engine.vocabularyHints(q, wordsState, language);
  const feedback = session.feedback;
  const reference = q.answers.join(' / ');
  const time = session.deadline ? '<span class="lab-clock" data-clock></span>' : '';
  let answerInput;
  if (session.options) answerInput = `<div class="lab-options">${session.options.map(value=>
   button(e(value),'option',value)).join('')}</div>`;
  else if (q.type === 'order') {
   answerInput = `<div class="lab-options">${q.choices.map((value,i)=>session.tokens.includes(i)? '' : button(e(value),'token',i)).join('')}</div>
    <p aria-live="polite" class="lab-formula">${session.tokens.map(i=>e(q.choices[i])).join(' ') || 'Chọn các từ theo thứ tự'}</p>
    <div class="lab-actions">${button('Hoàn tác','undo')} ${button('Kiểm tra','check-order','',true)}</div>`;
  } else answerInput = `<form class="lab-answer" data-form="answer"><label>Câu trả lời<textarea name="answer" rows="3" maxlength="1500" required>${e(session.draft)}</textarea></label>
    <button class="lab-button lab-primary">${q.type==='writing' ? 'Xem câu mẫu' : 'Kiểm tra'}</button></form>`;
  return `<article class="lab-card"><div class="lab-actions"><p>Câu ${session.index+1}/${session.queue.length} · ${types[q.type]} · Mức ${q.skill}/5</p>${time}</div>
   <h3 tabindex="-1">${e(q.prompt)}</h3>
   ${hint.length ? `<details><summary>Tra nghĩa từ trong câu</summary><ul>${hint.map(w=>`<li>${e(w.word)} · ${e(w.meaning)}</li>`).join('')}</ul></details>` : ''}
   ${feedback ? `<div class="lab-feedback" data-result="${feedback.result}" role="status">
   <strong>${{correct:'Đúng!',wrong:'Cần luyện thêm',self:'Tự đối chiếu'}[feedback.result]}</strong>
   <p>Bạn trả lời: ${e(feedback.text)}</p><p>Đáp án tham khảo: ${e(reference)}</p><p>${e(q.explanation)}</p></div>
   <div class="lab-actions">${feedback.result==='self' && !feedback.saved
    ? button('Mình làm được','self-pass','',true) + button('Mình cần luyện thêm','self-retry')
    : button(session.index+1===session.queue.length ? 'Xem kết quả' : 'Câu tiếp theo','next','',true)}</div>` : answerInput}</article>`;
 }
 function review(stats) {
  const errors = engine.mistakes(profile,bank.questions);
  const open = errors.filter(m=>!m.fixed);
  return `<div class="lab-columns"><article class="lab-card"><h3>Ôn theo lịch SRS</h3>
   <p>${stats.due.length ? stats.due.length+' cấu trúc đến hạn.' : 'Hiện chưa có cấu trúc đến hạn.'}</p>
   ${stats.due.length ? button('Ôn tất cả','due','',true) : ''}
   <ul class="lab-list">${bank.lessons.filter(l=>profile.reviews[l.id]).map(l=>{
    const r=profile.reviews[l.id];return `<li><span>${e(l.title)}<small>${date(r.next)} · ${r.interval} ngày · ${r.count} lần</small></span>
    ${r.next<=Date.now()?button('Ôn','review-lesson',l.id):''}</li>`;}).join('')}</ul></article>
   <article class="lab-card"><h3>Phòng lỗi sai</h3>${open.length ? button('Luyện các lỗi chưa sửa','mistakes','',true) : '<p>Chưa có lỗi cần khắc phục.</p>'}
    ${Object.entries(engine.errorLabels).map(([key,label])=>{
     const entries=errors.filter(m=>m.question.errorType===key);
     return entries.length ? `<details class="lab-lapses"><summary>${e(label)} · ${entries.length}</summary><ul class="lab-list">
       ${entries.map(m=>`<li><div><strong>${e(m.question.prompt)}</strong>
        <small>${e(m.answer)} → ${e(m.question.answers.join(' / '))}</small>
        <small>${m.count} lần · ${date(m.latest)} · ${m.fixed?'Đã khắc phục':'Cần luyện'}${m.retried?' · Luyện lại '+date(m.retried):''}</small></div>
        ${button('Luyện lại','retry',m.question.id)}</li>`).join('')}</ul></details>` : '';
    }).join('')}</article></div>`;
 }
 function profilePage(stats) {
  const learned = stats.scores.filter(x=>profile.learned[x.lesson.id]).sort((a,b)=>b.value-a.value);
  const confusion = engine.mistakes(profile,bank.questions).sort((a,b)=>b.count-a.count).slice(0,3);
  const list = values=>values.map(({lesson,value})=>`<li><span>${e(lesson.title)}</span><strong>${value}%</strong></li>`).join('') || '<li>Chưa có dữ liệu</li>';
  return `${metrics([['Rank',stats.rank],['XP',stats.xp],['Ngày liên tiếp',stats.streak],['Độ chính xác',percent(stats.accuracy)]])}
   <div class="lab-columns"><article class="lab-card"><h3>Năng lực theo 5 mức</h3><canvas width="300" height="210" data-radar role="img" aria-label="Biểu đồ năng lực, giá trị chi tiết bên dưới"></canvas>
    <ul class="lab-list" data-radar-values></ul></article>
   <article class="lab-card"><h3>Điểm mạnh</h3><ul class="lab-list">${list(learned.slice(0,3))}</ul>
    <h3>Cần ưu tiên</h3><ul class="lab-list">${list([...learned].reverse().slice(0,3))}</ul>
    <h3>Hay nhầm</h3><ul class="lab-list">${confusion.map(m =>
     `<li><span>${e(bank.lessons.find(l=>l.id===m.question.lessonId)?.title)} · ${e(engine.errorLabels[m.question.errorType])}</span><strong>${m.count}</strong></li>`
    ).join('') || '<li>Chưa ghi nhận lỗi</li>'}</ul></article></div>
   <article class="lab-card"><h3>Thành tựu</h3><ul class="lab-badges">${stats.achievements.map(([name,done])=>
    `<li data-unlocked="${done}"><i class="fa-solid fa-${done?'award':'lock'}" aria-hidden="true"></i> ${name}<small>${done?'Đã mở':'Chưa mở'}</small></li>`).join('')}</ul></article>
   <article class="lab-card"><h3>Dữ liệu học</h3><div class="lab-actions">${button('Xuất JSON','export')}${button('Nhập / khôi phục JSON','pick-file')}${button('Đặt lại tiến độ ngôn ngữ này','reset')}</div></article>`;
 }
 function drawRadar() {
  const canvas = host.querySelector('[data-radar]');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const names = ['Nhận diện','Ghi nhớ','Hiểu','Vận dụng','Tự sử dụng'];
  const values = names.map((_,i)=>{
   const attempts = profile.answers.filter(a=>a.skill===i+1 && ['correct','wrong'].includes(a.result));
   return attempts.length ? Math.round(100*attempts.filter(a=>a.result==='correct').length/attempts.length) : null;
  });
  function polygon(scores,fill) {
   context.beginPath();
   scores.forEach((value,i)=>{
    const angle=-Math.PI/2+i*2*Math.PI/5;
    const x=150+Math.cos(angle)*value*.86, y=104+Math.sin(angle)*value*.86;
    if (i===0) context.moveTo(x,y); else context.lineTo(x,y);
   });
   context.closePath();
   context.strokeStyle=fill?'#6350ba':'#aaa1bd';
   context.stroke();
   if (fill) { context.fillStyle='rgba(120,90,200,.32)'; context.fill(); }
  }
  [25,50,75,100].forEach(size=>polygon(names.map(()=>size)));
  polygon(values.map(value=>value??0),true);
  host.querySelector('[data-radar-values]').innerHTML=names.map((name,i)=>`<li><span>${name}</span><strong>${percent(values[i])}</strong></li>`).join('');
 }
 function start(mode, filters = {}, minutes = 0) {
  if ((mode==='topic' && !filters.topic && !filters.lesson) || (mode==='level' && !filters.level)) {
   notify('Chọn chủ đề hoặc cấp độ tương ứng.');
   return;
  }
  const queue = engine.select(bank, profile, mode,filters,wordsState.filter(w=>w.lang===language));
  if (!queue.length) { notify('Chưa có câu hỏi phù hợp. Hãy thử đổi bộ lọc hoặc học thêm một bài.'); return; }
  const duration=minutes || (mode==='speed'?2:0);
  session = { queue, mode, id:engine.uid(), index:0, correct:0, wrong:0, self:0, activeAt:null, elapsed:0,
   deadline:duration ? Date.now()+duration*60000 : null, finished:false };
  tab='practice';
  prepareQuestion();
  render();
  focusQuestion();
 }
 function focusQuestion() {
  host.querySelector('.lab-page h3[tabindex]')?.focus({preventScroll:true});
 }
 function prepareQuestion() {
  const q = session.queue[session.index];
  session.tokens=[];
  session.feedback=null;
  session.elapsed=0;
  session.draft='';
  const options = q.choices && q.type !== 'order' ? [q.answers[0],...q.choices] : null;
  if (options) {
   for (let i=options.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [options[i],options[j]]=[options[j],options[i]];
   }
  }
  session.options=options;
 }
 function answer(text) {
  if (!text.trim() || session.feedback) return;
  if (session.deadline && Date.now()>=session.deadline) { finishSession(); render(); return; }
  suspend();
  const q=session.queue[session.index];
  const result=engine.provider.assess(q,text);
  session.feedback={result,text,saved:false};
  if (result!=='self') saveResult(result);
  render();
  host.querySelector('.lab-feedback + .lab-actions button')?.focus({preventScroll:true});
 }
 function saveResult(result) {
  const q=session.queue[session.index];
  const statsBefore=engine.stats(profile,bank);
  try {
   store(p=>{
    engine.record(p,q,result,session.feedback.text,session.id,session.elapsed);
    const after=engine.stats(p,bank);
    after.quests.filter(task=>task.value>=task.goal).forEach(task=>{ p.awards['quest-'+after.today+'-'+task.id] ??= 10; });
    if (after.achievements.some(([,done],i)=>done&&!statsBefore.achievements[i][1])) openingNotice='Đã mở một thành tựu mới.';
   });
  } catch (error) {
   if (session.feedback.result!=='self') session.feedback=null;
   throw error;
  }
  session[result === 'self-retry' ? 'self' : result]++;
  session.feedback.saved=true;
 }
 function finishSession() {
  const completed = session.index + Number(Boolean(session.feedback?.saved));
  if (completed) store(p=>{
   const at=Date.now();
   p.sessions.push({ id:session.id, mode:session.mode, day:engine.localDay(), at });
   if (completed===session.queue.length && session.correct>0 && ['boss','daily'].includes(session.mode)) {
    const day=new Date();
    if (session.mode==='boss') day.setDate(day.getDate()-(day.getDay()+6)%7);
    p.awards[session.mode+'-'+engine.localDay(day)] ??= session.mode==='boss'?30:12;
   }
  });
  session.index=completed;
  session.finished=true;
 }
 function onClick(event) {
  const target=event.target.closest('[data-action]');
  if (!target) return;
  const {action,value}=target.dataset;
  try {
   switch (action) {
    case 'tab': tab=value; selectedLesson=null; render(); break;
    case 'tree': selectedLesson=null; render(); restoreLibraryFilters(); break;
    case 'zoom-out':
    case 'zoom-in':
     viewFilters.zoom = Math.max(10,Math.min(21,(viewFilters.zoom ?? 13) + (action==='zoom-in'?2:-2)));
     render(); restoreLibraryFilters(); break;
    case 'lesson': selectedLesson=value; tab='grammar'; store(p=>{ p.lastLesson=value; }); render(); break;
    case 'favorite': store(p=>{ p.favorites=p.favorites.includes(value)?p.favorites.filter(id=>id!==value):[...p.favorites,value]; }); render(); break;
    case 'learn':
     if (profile.learned[value]) { start('topic',{lesson:value,count:8}); break; }
     store(p=>{ p.learned[value]=Date.now(); p.awards['learn-'+value] ??= 10; p.awards['quest-'+engine.localDay()+'-lesson'] ??=10; });
     openingNotice='Đã đánh dấu bài này là đã học.'; render(); break;
    case 'quick': start('quick',{count:8}); break;
    case 'practice-lesson': start('topic',{lesson:value,count:10}); break;
    case 'due': start('review',{count:10}); break;
    case 'review-lesson': start('review',{lesson:value,count:3}); break;
    case 'mistakes': start('weak',{wrong:true,count:10}); break;
    case 'retry': start('mixed',{question:value,count:1}); break;
    case 'option': answer(value); break;
    case 'token': session.tokens.push(Number(value)); render(); break;
    case 'undo': session.tokens.pop(); render(); break;
    case 'check-order': {
     const q=session.queue[session.index];
     if (session.tokens.length !== q.choices.length) { notify('Hãy dùng hết các từ trước khi kiểm tra.'); break; }
     answer(session.tokens.map(i=>q.choices[i]).join(' ')); break;
    }
    case 'self-pass':
    case 'self-retry': saveResult(action==='self-pass'?'self':'self-retry'); render(); break;
    case 'next':
     if (session.index+1===session.queue.length) finishSession();
     else { session.index++; prepareQuestion(); }
     render(); focusQuestion(); break;
    case 'new': session=null; render(); break;
    case 'export': triggerFileDownload(JSON.stringify(repo.read(),null,2),'polygot-grammar-lab.json','application/json'); break;
    case 'pick-file': host.querySelector('#lab-restore-file').click(); break;
    case 'reset':
     if (window.confirm('Xóa tiến độ Grammar Lab của ngôn ngữ đang chọn?')) {
      const data=repo.read(); delete data.profiles[language]; repo.write(data); session=null; render();
     } break;
   }
  } catch (error) { notify(error.message || 'Không thể lưu thay đổi.'); }
 }
 function onSubmit(event) {
  const type=event.target.dataset.form;
  if (!type) return;
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.target));
  try {
   if (type==='answer') { session.draft=data.answer; answer(data.answer); }
   if (type==='library') {
    viewFilters={...data, zoom:viewFilters.zoom};
    render();
    restoreLibraryFilters();
   }
   if (type==='start') {
    store(p=>{ p.settings={ count:Number(data.count),minutes:Number(data.minutes) }; });
    start(data.mode,{...data,count:Number(data.count)},Number(data.minutes));
   }
  } catch (error) { notify(error.message || 'Không thể lưu thay đổi.'); }
 }
 function restoreLibraryFilters() {
  for (const name of ['level','state','priority']) {
   const field=host.querySelector('[data-form="library"] select[name="'+name+'"]');
   if (field) field.value=viewFilters[name] ?? '';
  }
 }
 async function onChange(event) {
  if (event.target.id!=='lab-restore-file') return;
  const file=event.target.files[0];
  event.target.value='';
  if (!file) return;
  try {
   if (file.size > 5_000_000) throw new Error('Tệp quá lớn.');
   const data=JSON.parse((await file.text()).replace(/^\uFEFF/,''));
   if (!repo.validate(data)) throw new Error('Tệp Grammar Lab phiên bản 1 không hợp lệ.');
   if (!window.confirm('Thay tiến độ Grammar Lab hiện tại bằng dữ liệu trong tệp?')) return;
   repo.write(data);
   session=null; openingNotice='Đã khôi phục dữ liệu.'; render();
  } catch (error) { notify(error.message || 'Tệp không hợp lệ.'); }
 }
 return { mount, suspend };
})();
