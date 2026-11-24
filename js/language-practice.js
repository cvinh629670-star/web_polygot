/* Bài tập ngữ pháp sơ cấp và nét mẫu Hán tự, chạy hoàn toàn trên thiết bị. */
const grammarQuestions = {
 en: [
  ['Hiện tại đơn', 'She ___ to school every day.', ['goes', 'go', 'going'], 'Chủ ngữ she dùng “goes” ở thì hiện tại đơn.'],
  ['There is / are', 'There ___ two books on the desk.', ['are', 'is', 'be'], 'Dùng “there are” trước danh từ số nhiều.'],
  ['Quá khứ đơn', 'We ___ a movie last night.', ['watched', 'watch', 'are watching'], '“Last night” chỉ thời điểm đã qua. Quá khứ của watch là watched.'],
  ['Đại từ tân ngữ', 'Can you help ___?', ['me', 'I', 'my'], 'Sau động từ help cần một đại từ tân ngữ như “me”.'],
  ['Mạo từ', 'He ate ___ apple.', ['an', 'a', 'some'], 'Dùng “an” trước âm nguyên âm, như âm đầu trong apple.'],
  ['Hiện tại tiếp diễn', 'Listen! Someone ___ at the door.', ['is knocking', 'knock', 'knocks'], 'Hành động đang xảy ra dùng “is knocking”.'],
  ['Danh từ không đếm được', 'How ___ water do you need?', ['much', 'many', 'few'], '“Water” không đếm được nên đi với “how much”.'],
  ['So sánh hơn', 'This chair is ___ than that one.', ['more comfortable', 'most comfortable', 'comfortable'], 'Với tính từ dài, dùng “more + tính từ + than”.']
 ],
 ko: [
  ['Trợ từ chủ đề', '저___ 학생입니다.', ['는', '은', '을'], '저 kết thúc bằng nguyên âm nên dùng 는 để đánh dấu chủ đề.'],
  ['Trợ từ tân ngữ', '책___ 읽어요.', ['을', '를', '에'], '책 có phụ âm cuối nên dùng 을 để đánh dấu tân ngữ.'],
  ['Địa điểm hành động', '도서관___ 공부해요.', ['에서', '에게', '하고'], '에서 chỉ nơi hoạt động diễn ra, ở đây là học trong thư viện.'],
  ['Hướng di chuyển', '학교___ 가요.', ['에', '를', '에게'], '에 đánh dấu đích đến của 가다.'],
  ['Đuôi quá khứ', '어제 친구를 ___.', ['만났어요', '만나요', '만나고 있어요'], '어제 nghĩa là hôm qua. 만났어요 là dạng quá khứ của 만나다.'],
  ['Trợ từ chủ ngữ', '비___ 와요.', ['가', '이', '을'], '비 kết thúc bằng nguyên âm nên dùng 가 để đánh dấu chủ ngữ.'],
  ['Sở hữu', '이것은 친구___ 가방이에요.', ['의', '에서', '에게'], '의 biểu thị sở hữu. 친구의 가방 là cặp của bạn.'],
  ['Nối hai hành động', '밥을 먹___ 물을 마셔요.', ['고', '의', '을'], 'Gắn -고 vào gốc động từ để nối ăn cơm và uống nước.']
 ],
 ja: [
  ['Trợ từ chủ đề', 'わたし___ 学生です。', ['は', 'を', 'で'], 'は đánh dấu chủ đề và được đọc là “wa” trong câu này.'],
  ['Trợ từ tân ngữ', '本___ 読みます。', ['を', 'に', 'で'], 'を đánh dấu 本 là đối tượng của hành động đọc.'],
  ['Nơi diễn ra hành động', '図書館___ 勉強します。', ['で', 'を', 'へ'], 'で chỉ nơi diễn ra hoạt động học.'],
  ['Giờ cụ thể', '七時___ 起きます。', ['に', 'を', 'の'], 'に đứng sau mốc giờ cụ thể như 七時.'],
  ['Quá khứ lịch sự', '昨日、映画を ___.', ['見ました', '見ます', '見ません'], '昨日 là hôm qua. 見ました là dạng quá khứ lịch sự của 見る.'],
  ['Sở hữu', 'これは 田中さん___ かばんです。', ['の', 'に', 'を'], 'の nối người sở hữu với đồ vật.'],
  ['Tồn tại', '机の上に 本が ___.', ['あります', 'います', '行きます'], 'Dùng あります để nói đồ vật ở một vị trí.'],
  ['Đi cùng ai', '友だち___ 映画を見ます。', ['と', 'の', 'を'], 'と chỉ người cùng thực hiện hành động.']
 ]
};

// Mỗi nét là một đường đi từ điểm đầu đến điểm cuối trên ô 100 × 100.
const hanziPractice = [
 ['一', 'yī', 'một', [[[22,50],[78,50]]]],
 ['二', 'èr', 'hai', [[[30,34],[70,34]],[[20,68],[80,68]]]],
 ['三', 'sān', 'ba', [[[28,26],[72,26]],[[33,47],[67,47]],[[20,73],[80,73]]]],
 ['十', 'shí', 'mười', [[[21,44],[79,44]],[[50,18],[50,81]]]],
 ['人', 'rén', 'người', [[[53,21],[50,45],[42,62],[24,78]],[[50,44],[60,62],[77,78]]]],
 ['大', 'dà', 'lớn', [[[22,42],[78,42]],[[51,19],[49,48],[40,66],[22,79]],[[49,46],[60,67],[79,80]]]],
 ['口', 'kǒu', 'miệng', [[[28,29],[28,73]],[[28,29],[72,29],[72,73]],[[28,73],[72,73]]]],
 ['土', 'tǔ', 'đất', [[[27,43],[73,43]],[[50,20],[50,73]],[[20,73],[80,73]]]]
];

let renderedPracticeLanguage = '';
let grammarLabOpen = false;
const practiceButton = 'rounded-xl border border-ui-border bg-ui-background px-4 py-2.5 text-sm font-semibold hover:bg-ui-secondary focus-visible:outline-2 focus-visible:outline-offset-2';
const practicePrimary = 'rounded-xl bg-theme px-4 py-2.5 text-sm font-bold text-white bg-theme-hover focus-visible:outline-2 focus-visible:outline-offset-2';
const grammarStorageKey = 'polyglot_grammar_lessons';
const hanziStorageKey = 'polyglot_custom_hanzi';

// Đọc dữ liệu luyện tập độc lập để lỗi lưu trữ không ảnh hưởng phần còn lại của trang.
function readPracticeData(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
 catch { return fallback; }
}

function parseGrammarLessons(data) {
 const text = value => typeof value === 'string' && value.trim().length > 0;
 if (!Array.isArray(data) || !data.length || data.length > 200) throw new Error();
 return data.map(({ topic, theory, question, options, correctIndex, explanation }) => {
  if (![topic, theory, question].every(text) || !Array.isArray(options) || options.length < 2 ||
   options.length > 6 || !options.every(text) || new Set(options.map(option => option.trim())).size !== options.length ||
   !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length ||
   (explanation !== undefined && !text(explanation))) throw new Error();
  const answers = options.map(option => option.trim());
  const [answer] = answers.splice(correctIndex, 1);
  return [topic.trim(), question.trim(), [answer, ...answers], (explanation ?? theory).trim(), theory.trim()];
 });
}

function renderLanguagePractice(language) {
 if (renderedPracticeLanguage === language) {
  if (grammarLabOpen) grammarLab.mount(document.getElementById('grammar-lab'), language);
  return;
 }
 renderedPracticeLanguage = language;
 const writing = language === 'zh';
 document.getElementById('practice-title').textContent = writing ? 'Luyện viết Hán tự' : 'Luyện ngữ pháp';
 document.getElementById('practice-intro').textContent = writing
  ? 'Xem thứ tự nét, rồi viết lại bằng chuột hoặc ngón tay.'
  : 'Chọn đáp án cho mỗi câu và xem giải thích bằng tiếng Việt.';
 const room = document.getElementById('practice-content');
 if (writing) renderHanziPractice(room);
 else renderGrammarPractice(room, language);
 updateGrammarLabView();
}

function toggleGrammarLab() {
 grammarLabOpen = !grammarLabOpen;
 updateGrammarLabView();
}

function updateGrammarLabView() {
 const lab = document.getElementById('grammar-lab');
 const button = document.getElementById('open-grammar-lab');
 lab.classList.toggle('hidden', !grammarLabOpen);
 document.getElementById('practice-content').classList.toggle('hidden', grammarLabOpen);
 button.setAttribute('aria-expanded', String(grammarLabOpen));
 button.textContent = grammarLabOpen ? (renderedPracticeLanguage === 'zh' ? 'Về ô viết Hán tự' : 'Về bài luyện cơ bản') : 'Mở Grammar Lab';
 if (grammarLabOpen) grammarLab.mount(lab, renderedPracticeLanguage);
 else grammarLab.suspend();
}

function renderGrammarPractice(room, language) {
 const stored = readPracticeData(grammarStorageKey, {});
 let imported = [];
 try { imported = stored?.[language] ? parseGrammarLessons(stored[language]) : []; }
 catch { /* Các bài có sẵn vẫn dùng được khi dữ liệu lưu bị lỗi. */ }
 const questions = [...(grammarQuestions[language] ?? grammarQuestions.en), ...imported];
 room.innerHTML = `<section class="pg-ui studio-room-panel space-y-3 p-5 sm:p-7">
  <div class="flex flex-wrap items-center justify-between gap-3">
   <h3 class="text-xl font-bold">Lý thuyết</h3>
   <div class="flex flex-wrap gap-2">
    <button type="button" data-grammar-template class="${practiceButton}">Tải JSON mẫu</button>
    <button type="button" data-grammar-import class="${practiceButton}">Nhập bài từ JSON</button>
    <input id="grammar-import-file" type="file" accept=".json,application/json" class="hidden">
   </div>
  </div>
  <p class="text-sm text-ui-muted-foreground" data-grammar-status role="status"></p>
  <div class="grid gap-2 sm:grid-cols-2">
   ${questions.map(([topic, , , explanation, theory]) => `<details class="rounded-xl border border-ui-border px-4 py-3">
    <summary class="cursor-pointer font-semibold">${escapeHTML(topic)}</summary>
    <p class="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">${escapeHTML(theory ?? explanation)}</p>
   </details>`).join('')}
  </div>
 </section>
 <section class="mt-4 space-y-3" aria-labelledby="grammar-exercise-title">
  <h3 id="grammar-exercise-title" class="text-xl font-bold">Bài tập thực hành</h3>
  <div data-grammar-quiz></div>
 </section>`;
 const sample = (grammarQuestions[language] ?? grammarQuestions.en)[0];
 room.querySelector('[data-grammar-template]').onclick = () => {
  const [topic, question, options, theory] = sample;
  const example = [{ topic, theory, question, options, correctIndex: 0, explanation: theory }];
  triggerFileDownload(JSON.stringify(example, null, 2), `ngu-phap-${language}.json`, 'application/json');
 };
 const input = room.querySelector('#grammar-import-file');
 const status = room.querySelector('[data-grammar-status]');
 room.querySelector('[data-grammar-import]').onclick = () => input.click();
 input.onchange = async () => {
  const file = input.files[0];
  input.value = '';
  if (!file) return;
  try {
   if (file.size > 1_000_000) throw new Error();
   const data = JSON.parse((await file.text()).replace(/^\uFEFF/, ''));
   parseGrammarLessons(data);
   const latest = readPracticeData(grammarStorageKey, {});
   const existing = Array.isArray(latest?.[language]) ? latest[language] : [];
   const merged = [...new Map([...existing, ...data].map(item => [JSON.stringify([item?.topic, item?.question]), item])).values()];
   parseGrammarLessons(merged);
   localStorage.setItem(grammarStorageKey, JSON.stringify({ ...latest, [language]: merged }));
   if (renderedPracticeLanguage === language) {
    renderGrammarPractice(room, language);
    room.querySelector('[data-grammar-status]').textContent = `Đã lưu ${merged.length} bài tự thêm cho ngôn ngữ này.`;
   }
  } catch {
   status.textContent = 'Không thể nhập bài. Kiểm tra định dạng theo tệp mẫu, giới hạn 200 bài và dung lượng lưu trữ.';
  }
 };
 const quiz = room.querySelector('[data-grammar-quiz]');
 let index = 0;
 let correct = 0;
 function showQuestion() {
  if (index === questions.length) {
   quiz.innerHTML = `<div class="pg-ui studio-room-panel space-y-4 p-5 sm:p-7">
    <h3 class="text-xl font-bold" tabindex="-1">Hoàn thành bài luyện</h3>
    <p>Bạn trả lời đúng <strong>${correct}/${questions.length}</strong> câu.</p>
    <button type="button" class="${practicePrimary}">Làm lại</button>
   </div>`;
   quiz.querySelector('h3').focus();
   quiz.querySelector('button').onclick = () => { index = 0; correct = 0; showQuestion(); quiz.querySelector('h3').focus(); };
   return;
  }

  const [topic, sentence, answers, explanation] = questions[index];
  const ordered = answers.map((_, i) => (i + answers.length - index % answers.length) % answers.length);
  quiz.innerHTML = `<div class="pg-ui studio-room-panel space-y-4 p-5 sm:p-7">
   <p class="text-sm font-semibold text-ui-muted-foreground">Câu ${index + 1}/${questions.length} · ${escapeHTML(topic)}</p>
   <h3 lang="${language}" class="break-words text-xl font-bold sm:text-2xl" tabindex="-1">${escapeHTML(sentence)}</h3>
   <div class="grid gap-2 sm:grid-cols-3" aria-label="Các đáp án">
    ${ordered.map(answer => `<button type="button" lang="${language}" class="${practiceButton} break-words text-left" data-answer="${answer}">${escapeHTML(answers[answer])}</button>`).join('')}
   </div>
   <p data-feedback role="status" class="hidden rounded-xl bg-ui-secondary p-3 text-sm leading-relaxed"></p>
   <button data-next type="button" class="${practicePrimary} hidden">Câu tiếp theo</button>
  </div>`;
  const options = [...room.querySelectorAll('[data-answer]')];
  const feedback = room.querySelector('[data-feedback]');
  const next = room.querySelector('[data-next]');
  options.forEach(button => {
   button.onclick = () => {
    const isCorrect = button.dataset.answer === '0';
    correct += Number(isCorrect);
    options.forEach(option => {
     option.disabled = true;
     if (option.dataset.answer === '0') option.classList.add('ring-2', 'ring-emerald-500');
    });
    feedback.classList.remove('hidden');
    feedback.textContent = (isCorrect ? 'Đúng! ' : 'Đáp án đúng: ' + answers[0] + '. ') + explanation;
    next.textContent = index + 1 === questions.length ? 'Xem kết quả' : 'Câu tiếp theo';
    next.classList.remove('hidden');
    next.focus();
   };
  });
  next.onclick = () => { index++; showQuestion(); quiz.querySelector('h3').focus(); };
 }
 showQuestion();
}

function renderHanziPractice(room) {
 const saved = readPracticeData(hanziStorageKey, []);
 const custom = Array.isArray(saved) ? [...new Set(saved.filter(char => typeof char === 'string' && /^\p{Script=Han}$/u.test(char)))] : [];
 const characters = [...hanziPractice, ...custom.filter(char => !hanziPractice.some(([basic]) => basic === char))
  .map(char => [char, '', '', []])];
 room.innerHTML = `<div class="pg-ui studio-room-panel space-y-4 p-5 sm:p-7">
  <form id="hanzi-add" class="flex flex-wrap items-end gap-2">
   <label class="min-w-0 text-sm font-bold">Thêm Hán tự
    <input id="hanzi-new" type="text" lang="zh" class="mt-1 block w-full rounded-lg border p-2" placeholder="Ví dụ 山 水 火" maxlength="300" required>
   </label>
   <button class="${practicePrimary}" type="submit">Thêm chữ</button>
  </form>
  <p id="hanzi-add-status" role="status" class="text-sm text-ui-muted-foreground"></p>
  <div class="flex flex-wrap items-center gap-3">
   <label class="text-sm font-bold">Chọn chữ <select id="hanzi-character" class="ml-1 rounded-lg border p-2">
    ${characters.map(([char, pinyin], i) => `<option value="${i}">${char}${pinyin ? ' · ' + pinyin : ''}</option>`).join('')}
   </select></label>
   <p id="hanzi-reading" class="text-sm text-ui-muted-foreground"></p>
  </div>
  <div class="grid gap-5 sm:grid-cols-2">
   <div class="min-w-0 space-y-3">
    <h3 class="text-sm font-bold">Nét mẫu</h3>
    <canvas width="300" height="300" id="hanzi-model" class="hanzi-grid" role="img" aria-label="Mẫu thứ tự nét"></canvas>
    <button type="button" id="hanzi-stroke" class="${practiceButton}">Xem nét tiếp theo</button>
    <span id="hanzi-stroke-count" role="status" class="text-sm text-ui-muted-foreground"></span>
   </div>
   <div class="min-w-0 space-y-3">
    <h3 class="text-sm font-bold">Ô tập viết</h3>
    <canvas width="300" height="300" id="hanzi-board" class="hanzi-grid" aria-label="Ô viết chữ Hán"></canvas>
    <div class="flex flex-wrap gap-2">
     <button type="button" id="hanzi-eraser" class="${practiceButton}" aria-pressed="false"><i class="fa-solid fa-eraser" aria-hidden="true"></i> Cục tẩy</button>
     <button type="button" id="hanzi-clear" class="${practiceButton}">Xóa hết</button>
    </div>
   </div>
  </div>
 </div>`;
 const model = room.querySelector('#hanzi-model');
 const board = room.querySelector('#hanzi-board');
 const selection = room.querySelector('#hanzi-character');
 const strokeButton = room.querySelector('#hanzi-stroke');
 const eraserButton = room.querySelector('#hanzi-eraser');
 const drawing = board.getContext('2d');
 const preview = model.getContext('2d');
 let visibleStrokes = 0;
 let activePointer = null;
 let previousPoint;
 let erasing = false;

 function resetBoard() {
  drawing.clearRect(0, 0, board.width, board.height);
  activePointer = null;
 }
 function line(context, points, color, width) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.moveTo(...points[0]);
  for (const point of points.slice(1)) context.lineTo(...point);
  context.stroke();
 }
 function updateModel() {
  const [char, pinyin, meaning, strokes] = characters[selection.value];
  room.querySelector('#hanzi-reading').textContent = [char, pinyin, meaning].filter(Boolean).join(' · ');
  preview.clearRect(0, 0, model.width, model.height);
  strokeButton.hidden = strokes.length === 0;
  if (!strokes.length) {
   preview.font = '172px "Microsoft YaHei", "Noto Sans SC", sans-serif';
   preview.textAlign = 'center';
   preview.textBaseline = 'middle';
   preview.fillStyle = '#43328f';
   preview.fillText(char, model.width / 2, model.height / 2);
   room.querySelector('#hanzi-stroke-count').textContent = 'Mẫu mặt chữ';
   return;
  }
  preview.textAlign = 'start';
  preview.textBaseline = 'alphabetic';
  strokes.forEach((stroke, i) => {
   const points = stroke.map(point => point.map(value => value * 3));
   const shown = i < visibleStrokes;
   line(preview, points, shown ? '#43328f' : '#ddd4f6', 9);
   if (shown) {
    const [x, y] = points[0];
    preview.font = 'bold 15px sans-serif';
    preview.fillStyle = '#11675b';
    preview.fillText(String(i + 1), x - 14, y - 8);
   }
  });
  room.querySelector('#hanzi-stroke-count').textContent = ` ${visibleStrokes}/${strokes.length} nét`;
  strokeButton.textContent = visibleStrokes === strokes.length ? 'Xem lại từ đầu' : 'Xem nét tiếp theo';
 }
 strokeButton.onclick = () => {
  const total = characters[selection.value][3].length;
  visibleStrokes = visibleStrokes === total ? 0 : visibleStrokes + 1;
  updateModel();
 };
 selection.onchange = () => { visibleStrokes = 0; resetBoard(); updateModel(); };
 room.querySelector('#hanzi-clear').onclick = resetBoard;
 eraserButton.onclick = () => {
  erasing = !erasing;
  eraserButton.setAttribute('aria-pressed', String(erasing));
  board.classList.toggle('hanzi-erasing', erasing);
 };
 room.querySelector('#hanzi-add').onsubmit = event => {
  event.preventDefault();
  const input = room.querySelector('#hanzi-new');
  const status = room.querySelector('#hanzi-add-status');
  const text = input.value.replace(/[\s,，、;；]+/gu, '');
  if (!/^\p{Script=Han}+$/u.test(text)) {
   status.textContent = 'Chỉ nhập chữ Hán, có thể phân cách bằng dấu phẩy hoặc khoảng trắng.';
   return;
  }
  const existing = new Set(characters.map(([char]) => char));
  const added = [...new Set(text)].filter(char => !existing.has(char));
  if (!added.length) {
   status.textContent = 'Các chữ này đã có trong danh sách.';
   return;
  }
  try { localStorage.setItem(hanziStorageKey, JSON.stringify([...custom, ...added])); }
  catch {
   status.textContent = 'Không thể lưu chữ mới trên thiết bị.';
   return;
  }
  custom.push(...added);
  added.forEach(char => {
   selection.add(new Option(char, String(characters.length)));
   characters.push([char, '', '', []]);
  });
  selection.value = String(characters.length - added.length);
  selection.onchange();
  input.value = '';
  status.textContent = `Đã lưu ${added.length} chữ mới.`;
 };

 function pointAt(event) {
  const bounds = board.getBoundingClientRect();
  return [(event.clientX - bounds.left) * board.width / bounds.width,
   (event.clientY - bounds.top) * board.height / bounds.height];
 }
 board.onpointerdown = event => {
  if (event.button !== 0 || activePointer !== null) return;
  activePointer = event.pointerId;
  previousPoint = pointAt(event);
  board.setPointerCapture(activePointer);
  drawing.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
  drawing.fillStyle = '#274e4d';
  drawing.beginPath();
  drawing.arc(...previousPoint, erasing ? 12 : 4.5, 0, Math.PI * 2);
  drawing.fill();
 };
 board.onpointermove = event => {
  if (event.pointerId !== activePointer) return;
  const point = pointAt(event);
  line(drawing, [previousPoint, point], '#274e4d', erasing ? 24 : 9);
  previousPoint = point;
 };
 board.onpointerup = board.onpointercancel = board.onlostpointercapture = event => {
  if (event.pointerId === activePointer) activePointer = null;
 };
 updateModel();
}
