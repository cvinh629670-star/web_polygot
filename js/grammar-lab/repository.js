// Ghi cả hồ sơ trong một lần để lịch sử, ôn tập và thành tựu đồng bộ.
const grammarLabStorageKey = 'polyglot_grammar_lab_v1';
const grammarLabRepository = (() => {
 const languages = ['en','ko','zh','ja'];
 const clean = () => ({ version:1, profiles:{} });
 const empty = () => ({ answers:[], sessions:[], learned:{}, reviews:{}, favorites:[], awards:{}, lastLesson:null, settings:{ count:8, minutes:0 } });
 const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
 const day = value => Number.isFinite(value) && value >= 0 && value <= 8.64e15;
 const dateKey = value => typeof value === 'string' && /^\d{4}-\d\d-\d\d$/.test(value);
 const id = value => typeof value === 'string' && /^[\w-]{1,100}$/.test(value) && !['__proto__','constructor','prototype'].includes(value);
 const validProfile = profile => object(profile) &&
  Array.isArray(profile.answers) && profile.answers.every(a => object(a) && id(a.questionId) && id(a.lessonId) && id(a.sessionId) &&
   Object.hasOwn(grammarLabContent.types, a.type) && ['correct','wrong','self','self-retry'].includes(a.result) && Number.isInteger(a.skill) &&
   a.skill >= 1 && a.skill <= 5 && typeof a.text === 'string' && a.text.length <= 1500 && day(a.at) && dateKey(a.day) &&
   Number.isFinite(a.seconds) && a.seconds >= 0 && a.seconds <= 300 && Number.isInteger(a.difficulty) && a.difficulty >= 1 && a.difficulty <= 3) &&
  Array.isArray(profile.sessions) && profile.sessions.every(s => object(s) && id(s.id) && typeof s.mode === 'string' && dateKey(s.day) && day(s.at)) &&
  object(profile.learned) && Object.entries(profile.learned).every(([key,value]) => id(key) && day(value)) &&
  object(profile.reviews) && Object.entries(profile.reviews).every(([key,r]) => id(key) && object(r) && day(r.last) &&
   day(r.next) && Number.isInteger(r.interval) && r.interval >= 1 && r.interval <= 60 &&
   Number.isInteger(r.count) && r.count >= 1 && Number.isInteger(r.step) && r.step >= 0 && r.step <= 5 &&
   Number.isInteger(r.streak) && r.streak >= 0 && Number.isFinite(r.difficulty) && r.difficulty >= 1 && r.difficulty <= 3) &&
  Array.isArray(profile.favorites) && profile.favorites.every(id) &&
  object(profile.awards) && Object.values(profile.awards).every(value => Number.isInteger(value) && value >= 0 && value <= 100) &&
  (profile.lastLesson === null || id(profile.lastLesson)) && object(profile.settings) &&
  Number.isInteger(profile.settings.count) && profile.settings.count >= 1 && profile.settings.count <= 30 &&
  Number.isInteger(profile.settings.minutes) && profile.settings.minutes >= 0 && profile.settings.minutes <= 60;
 function validate(data) {
  return object(data) && data.version === 1 && object(data.profiles) &&
   Object.entries(data.profiles).every(([language, profile]) => languages.includes(language) && validProfile(profile));
 }
 function read() {
  try {
   const raw = localStorage.getItem(grammarLabStorageKey);
   if (raw === null) return clean();
   const value = JSON.parse(raw);
   if (validate(value)) return value;
  } catch { /* Giao diện cho phép khôi phục từ bản sao lưu. */ }
  throw new Error('Không thể đọc tiến độ Grammar Lab. Hãy khôi phục từ tệp sao lưu.');
 }
 function write(data) {
  if (!validate(data)) throw new Error('Dữ liệu Grammar Lab không đúng định dạng phiên bản 1.');
  localStorage.setItem(grammarLabStorageKey, JSON.stringify(data));
 }
 function update(language, change) {
  const data = read();
  const profile = data.profiles[language] ?? empty();
  change(profile);
  data.profiles[language] = profile;
  write(data);
  return profile;
 }
 return { read, write, update, empty, validate };
})();
