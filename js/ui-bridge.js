/* React owns its roots; the existing learning engine remains the source of truth. */
(function () {
  const listeners = new Set();
  let snapshot;

  function sync() {
    const words = wordsState.filter(word => word.lang === currentLang);
    const now = Date.now();
    const next = {
      lang: currentLang,
      tab: currentTab,
      total: words.length,
      unlearned: words.filter(word => word.srsLevel === 0).length,
      learning: words.filter(word => word.srsLevel >= 1 && word.srsLevel <= 7).length,
      mastered: words.filter(word => word.srsLevel >= 8).length,
      nemesis: words.filter(word => (word.forgotCount || 0) >= 3).length,
      due: words.filter(word => word.srsLevel === 0 || !word.nextReviewTime || word.nextReviewTime <= now).length,
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
  // Refresh due counts when a scheduled review becomes available or the tab returns.
  setInterval(sync, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
})();
