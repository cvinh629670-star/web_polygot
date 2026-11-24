/* Cầu nối để React đọc dữ liệu và gọi thao tác của ứng dụng. */
(function () {
  const listeners = new Set();
  let snapshot;

  // Chỉ thông báo cho React khi giá trị hiển thị thay đổi.
  function sync(stats = getVocabularyStats()) {
    const next = {
      lang: currentLang,
      tab: currentTab,
      ...stats,
      streak: learningStreak,
      dark: document.documentElement.classList.contains('dark'),
    };
    if (snapshot && Object.keys(next).every(key => next[key] === snapshot[key])) return;
    snapshot = Object.freeze(next);
    listeners.forEach(listener => listener());
  }

  window.polyglotUI = {
    sync,
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    actions: {
      navigate: tab => switchNavTab(tab),
      setLanguage: lang => switchLanguage(lang),
      review() {
        fcFilterMode = 'due';
        const filter = document.getElementById('flashcard-mode-select');
        if (filter) filter.value = 'due';
        switchNavTab('flashcards');
        changeFlashcardMode();
      },
      addWord() {
        switchNavTab('vocab');
        toggleAddWordPanel(true);
        requestAnimationFrame(() => {
          document.getElementById('add-word-panel').scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            block: 'center',
          });
          document.getElementById('input-word').focus({ preventScroll: true });
        });
      },
    },
  };
  sync();
  // Cập nhật số từ đến hạn theo thời gian và khi quay lại tab.
  setInterval(sync, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
})();
