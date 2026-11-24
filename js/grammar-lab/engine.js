// Chấm theo dữ liệu mẫu, tính tiến độ và chọn câu hỏi từ lịch sử thực tế.
const grammarLabEngine = (() => {
 const { lessons, questions } = grammarLabContent;
 const weights = { accuracy:.4, application:.25, retention:.2, consistency:.15 };
 const intervals = [1,3,7,14,30,60];
 const errorLabels = { structure:'Cấu trúc', order:'Trật tự từ', verb:'Chia động từ', particle:'Trợ từ',
  preposition:'Giới từ', context:'Ngữ cảnh', form:'Dạng từ', contrast:'Dễ nhầm cấu trúc' };
 const localDay = (date = new Date()) => [date.getFullYear(), date.getMonth()+1, date.getDate()]
  .map((part,i) => String(part).padStart(i ? 2 : 4,'0')).join('-');
 function calendarDays(at, amount, morning = false) {
  const date = new Date(at);
  date.setDate(date.getDate() + amount);
  if (morning) date.setHours(0,0,0,0);
  return date.getTime();
 }
 const uid = () => globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
 const normalize = (value, language) => {
  const text = value.normalize('NFKC').replace(/[’‘]/g,"'").trim().toLocaleLowerCase()
   .replace(/[!?.,;:。！？、，；：]+$/u,'').replace(/\s+/gu,' ').trim();
  return ['zh','ja'].includes(language) ? text.replace(/\s/gu,'') : text;
 };
 const provider = {
  assess(question, answer) {
   if (question.type === 'writing') return 'self';
   const language = question.type === 'reverse' ? 'vi' : question.lang;
   if (question.answers.some(candidate => normalize(candidate, language) === normalize(answer, language))) return 'correct';
   return ['translate','reverse'].includes(question.type) ? 'self' : 'wrong';
  }
 };
 function catalog(language) {
  const baseLessons = lessons.filter(l => l.lang === language);
  const baseQuestions = questions.filter(q => q.lang === language);
  const data = readPracticeData(grammarStorageKey, {});
  let imported = [];
  try { if (data?.[language]) imported = parseGrammarLessons(data[language]); } catch { /* Bỏ qua dữ liệu sai định dạng. */ }
  imported.forEach(([title,prompt,answers,explanation,theory]) => {
   let hash = 2166136261;
   for (const char of title + '\n' + prompt) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
   const id = 'custom-' + language + '-' + (hash >>> 0).toString(36);
   if (baseLessons.some(lesson => lesson.id === id)) return;
   baseLessons.push({ id, lang:language, level:'Tự thêm', topic:'Bài nhập', title, essence:theory, vocabulary:[], prerequisites:[] });
   baseQuestions.push({ id:id + '-1', lessonId:id, lang:language, prompt, answers:[answers[0]], choices:answers.slice(1),
    explanation,type:'choice',skill:1,difficulty:1,errorType:'structure',vocabulary:[] });
  });
  return { lessons:baseLessons, questions:baseQuestions };
 }
 const verified = answers => answers.filter(a => a.result === 'correct' || a.result === 'wrong');
 function mastery(answers) {
  const evidence = verified(answers);
  if (!evidence.length) return 0;
  const correct = evidence.filter(a => a.result === 'correct');
  const measure = rows => rows.reduce((sum,a) => sum + a.difficulty,0);
  const accuracy = measure(correct) / measure(evidence) * Math.min(1, evidence.length / 4);
  const applications = evidence.filter(a => a.skill >= 3);
  const application = applications.length ? applications.filter(a => a.result === 'correct').length / applications.length *
   Math.min(1, new Set(applications.map(a => a.type)).size / 3) : 0;
  const correctDays = new Set(correct.map(a => a.day)).size;
  const retention = Math.min(1, Math.max(0, correctDays - 1) / 3);
  const sessions = new Set(evidence.map(a => a.sessionId)).size;
  const consistency = correct.length / evidence.length * Math.min(1, sessions / 4);
  const kinds = new Set(correct.map(a => a.type)).size;
  const ceiling = kinds < 2 ? 39 : kinds < 4 ? 79 : correctDays < 3 ? 94 : 100;
  return Math.min(ceiling, Math.round(100 * (weights.accuracy*accuracy + weights.application*application +
   weights.retention*retention + weights.consistency*consistency)));
 }
 const stateLabel = score => score < 20 ? 'Beginner' : score < 40 ? 'Learning' : score < 60 ? 'Developing' :
  score < 80 ? 'Skilled' : score < 95 ? 'Proficient' : 'Mastered';
 function record(profile, question, result, text, sessionId, seconds, at = Date.now()) {
  const day = localDay(new Date(at));
  profile.answers.push({ questionId:question.id, lessonId:question.lessonId, type:question.type, skill:question.skill,
   difficulty:question.difficulty, result, text:text.slice(0,1500), sessionId, seconds:Math.max(0,Math.min(300,seconds)), at, day });
  profile.learned[question.lessonId] ??= at;
  profile.lastLesson = question.lessonId;
  if (result === 'self' || result === 'self-retry') return;
  const old = profile.reviews[question.lessonId];
  const due = !old || old.next <= at;
  if (result === 'correct') {
   profile.awards['answer-' + question.id] ??= 4 + question.skill;
   if (due && old) profile.awards['review-' + question.lessonId + '-' + day] ??= 12;
   if (profile.answers.some(a => a.questionId === question.id && a.result === 'wrong')) profile.awards['repair-' + question.id] ??= 8;
  }
  if (!due && result === 'correct') return;
  const promotes = question.skill >= 2 || (old?.streak ?? 0) < 2;
  const step = result === 'wrong' ? 0 : old ? Math.min(intervals.length-1, old.step + Number(promotes)) : 0;
  const interval = intervals[step];
  profile.reviews[question.lessonId] = { last:at, next:calendarDays(at, interval, true), interval, step,
   count:(old?.count ?? 0) + 1, streak:result === 'correct' ? (old?.streak ?? 0)+1 : 0, difficulty:question.difficulty };
 }
 function mistakes(profile, bank) {
  const records = new Map();
  const byId = new Map(bank.map(q => [q.id,q]));
  for (const answer of profile.answers) {
   const question = byId.get(answer.questionId);
   if (!question) continue;
   const entry = records.get(question.id);
   if (answer.result === 'wrong' || answer.result === 'self-retry') records.set(question.id,{ question, answer:answer.text, count:(entry?.count ?? 0)+1,
    latest:answer.at, retried:entry ? answer.at : null, fixed:false });
   else if (entry) {
    entry.retried = answer.at;
    if (answer.result === 'correct' || answer.result === 'self') entry.fixed = true;
   }
  }
  return [...records.values()].sort((a,b) => b.latest-a.latest);
 }
 function vocabularyHints(question, words, language) {
  const visibleText = question.prompt + ' ' + (question.choices ?? []).join(' ');
  const folded = visibleText.toLocaleLowerCase();
  const english = {school:'trường học',work:'làm việc; công việc',book:'sách',coffee:'cà phê'};
  return question.vocabulary.filter(word => folded.includes(word.toLocaleLowerCase())).map(word =>
   words.find(item => item.lang === language && item.word.toLocaleLowerCase() === word.toLocaleLowerCase()) ??
   starterVocabulary[language]?.find(item => item.word === word) ??
   (language === 'en' && english[word] ? {word, meaning:english[word]} : null)
  ).filter(Boolean).slice(0,8);
 }
 function select(bank, profile, mode, filters, words, at = Date.now()) {
  const missing = new Set(mistakes(profile, bank.questions).filter(m => !m.fixed).map(m => m.question.id));
  const learnedWords = new Set(words.filter(w => w.srsLevel > 0).map(w => w.word.toLocaleLowerCase()));
  const lookups = new Map(bank.lessons.map(l => [l.id,l]));
  const lessonEvidence = new Map(bank.lessons.map(l => [l.id,mastery(profile.answers.filter(a => a.lessonId === l.id))]));
  const date = localDay(new Date(at));
  const monday = new Date(at);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  monday.setHours(0,0,0,0);
  const last = profile.answers.at(-1)?.questionId;
  const lastSeen = new Map(profile.answers.map(a => [a.questionId,a.at]));
  let pool = bank.questions.filter(q => {
   const lesson = lookups.get(q.lessonId);
   if (filters.question && q.id !== filters.question) return false;
   if (filters.lesson && q.lessonId !== filters.lesson) return false;
   if (filters.topic && lesson.topic !== filters.topic) return false;
   if (filters.level && lesson.level !== filters.level) return false;
   if (filters.type && q.type !== filters.type) return false;
   if (filters.difficulty && q.difficulty !== +filters.difficulty) return false;
   if (filters.wrong && !missing.has(q.id)) return false;
   if (mode === 'translation' && !['translate','reverse'].includes(q.type)) return false;
   if (mode === 'weak' && !missing.has(q.id) && (lessonEvidence.get(q.lessonId) >= 60 || !profile.learned[q.lessonId])) return false;
   if (mode === 'review' && !(profile.reviews[q.lessonId]?.next <= at)) return false;
   if (mode === 'boss' && !(profile.learned[q.lessonId] >= monday.getTime() ||
    profile.answers.some(a => a.lessonId === q.lessonId && a.at >= monday.getTime()))) return false;
   return true;
  });
  const familiarity = q => q.vocabulary.filter(term => learnedWords.has(term.toLocaleLowerCase())).length;
  const daily = q => [...date + q.id].reduce((score,char) => (Math.imul(score,31) + char.charCodeAt(0)) >>> 0, 0);
  const superscore = q => lessonEvidence.get(q.lessonId) ?? 0;
  const targetSkill = q => Math.min(5, 1 + Math.floor(superscore(q) / 20));
  const difficultyGap = q => Math.abs(q.skill - targetSkill(q));
  pool.sort((a,b) => Number(a.id === last)-Number(b.id === last) ||
   (mode === 'daily' ? daily(a)-daily(b) : 0) ||
   (mode === 'boss' ? Number(missing.has(b.id))-Number(missing.has(a.id)) : 0) ||
   (lastSeen.get(a.id) ?? 0)-(lastSeen.get(b.id) ?? 0) ||
   Number(mode !== 'quick')*(difficultyGap(a)-difficultyGap(b)) ||
   familiarity(b)-familiarity(a));
  const count = filters.count ?? 8;
  if (mode === 'mixed' && !filters.question && !filters.lesson) {
   const groups = [...new Set(pool.map(q => q.lessonId))].map(id => pool.filter(q => q.lessonId === id));
   const max = Math.max(0, ...groups.map(group => group.length));
   return Array.from({length:max}, (_, index) => groups.flatMap(group => group[index] ?? [])).flat().slice(0,count);
  }
  if (mode !== 'quick' || filters.lesson || filters.question) return pool.slice(0,count);
  const weak = q => missing.has(q.id);
  const due = q => profile.reviews[q.lessonId]?.next <= at;
  const buckets = [
   pool.filter(weak), pool.filter(q => !weak(q) && due(q)),
   pool.filter(q => !weak(q) && !due(q) && superscore(q) < 95),
   pool.filter(q => !weak(q) && !due(q) && superscore(q) >= 95)
  ];
  const chosen = buckets.flatMap((bucket,i) => bucket.slice(0,Math.round(count*[.4,.3,.2,.1][i])));
  const ids = new Set(chosen.map(q => q.id));
  return [...chosen,...pool.filter(q => !ids.has(q.id))]
   .sort((a,b) => Number(a.id===last)-Number(b.id===last)).slice(0,count);
 }
 function stats(profile, bank, at = Date.now()) {
  const today = localDay(new Date(at));
  const days = new Set(profile.answers.map(a => a.day));
  for (const learned of Object.values(profile.learned)) days.add(localDay(new Date(learned)));
  let cursor = days.has(today) ? at : calendarDays(at,-1);
  let streak = 0;
  while (days.has(localDay(new Date(cursor)))) { streak++; cursor = calendarDays(cursor,-1); }
  const answers = verified(profile.answers);
  const correct = answers.filter(a => a.result === 'correct').length;
  const todayAnswers = profile.answers.filter(a => a.day === today);
  const scores = bank.lessons.map(lesson => ({ lesson, value:mastery(profile.answers.filter(a => a.lessonId === lesson.id)) }));
  const xp = Object.values(profile.awards).reduce((sum,value) => sum + value,0);
  const due = bank.lessons.filter(l => profile.reviews[l.id]?.next <= at);
  const learned = bank.lessons.filter(l => Object.hasOwn(profile.learned,l.id));
  const ranked = scores.filter(s => s.value > 0);
  const average = ranked.length ? ranked.reduce((sum,s) => sum+s.value,0)/ranked.length : 0;
  const evidence = new Set(answers.map(a => a.day)).size;
  const rank = ['F','E','D','C','B','A','S','SS','SSS'][Math.min(evidence+1,
   [10,20,35,50,65,80,90,97].filter(threshold => average >= threshold).length)];
  const todayLearned = learned.filter(l => localDay(new Date(profile.learned[l.id])) === today).length;
  const repairedToday = mistakes(profile,bank.questions).filter(m => m.fixed && localDay(new Date(m.retried)) === today).length;
  const quests = [
   { id:'answers', label:'Làm 5 câu', value:new Set(todayAnswers.map(a => a.questionId)).size, goal:5 },
   { id:'lesson', label:'Học một cấu trúc', value:todayLearned, goal:1 },
   { id:'repair', label:'Sửa một lỗi', value:repairedToday, goal:1 },
   { id:'review', label:'Ôn một cấu trúc đến hạn', value:Object.keys(profile.awards).filter(key => key.startsWith('review-') && key.endsWith(today)).length, goal:1 },
   { id:'translation', label:'Hoàn thành một câu dịch', value:todayAnswers.filter(a=>['translate','reverse'].includes(a.type)).length, goal:1 }
  ];
  const achievements = [
   ['First Grammar',learned.length > 0], ['7 Days Streak',streak >= 7], ['30 Days Streak',streak >= 30],
   ['Grammar Hunter',learned.length >= 5], ['Error Destroyer',mistakes(profile,bank.questions).filter(m=>m.fixed).length >= 3],
   ['Translation Master',new Set(answers.filter(a=>a.result==='correct' && ['translate','reverse'].includes(a.type)).map(a=>a.questionId)).size >= 5],
   ['Grammar Legend',scores.filter(s=>s.value>=95).length >= 3]
  ];
  return { today, streak, xp, due, learned, scores, rank, quests, achievements, accuracy:answers.length ? Math.round(100*correct/answers.length) : null,
   seconds:todayAnswers.reduce((sum,a)=>sum+a.seconds,0), mastered:scores.filter(s=>s.value>=95).length };
 }
 return { provider, normalize, catalog, vocabularyHints, mastery, stateLabel, record, mistakes, select, stats, localDay, uid, errorLabels };
})();
