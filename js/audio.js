(function () {
  'use strict';

  /* ==========================================================================
     LO-FI CHILL — nhạc nền tạo trực tiếp bằng Web Audio (không cần tải file)
     Rhodes + pad mềm + bass + trống nhẹ + tiếng đĩa than, có swing & humanize.
     ========================================================================== */
  const LS_ON = 'polyglot_music_on', LS_VOL = 'polyglot_music_vol', LS_MOOD = 'polyglot_music_mood';

  const Q = {
    maj9: [0, 4, 7, 11, 14], min9: [0, 3, 7, 10, 14], dom9: [0, 4, 7, 10, 14],
    m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11]
  };
  const MOODS = {
    chill: { // Chiều muộn
      bpm: 76, swing: 0.17, scale: [0, 2, 4, 7, 9], melodyBase: 72, melodyProb: 0.34,
      prog: [{ b: 41, q: 'maj9' }, { b: 40, q: 'm7' }, { b: 38, q: 'min9' }, { b: 36, q: 'maj9' }]
    },
    rain: { // Mưa đêm
      bpm: 66, swing: 0.2, scale: [0, 3, 5, 7, 10], melodyBase: 69, melodyProb: 0.26,
      prog: [{ b: 45, q: 'min9' }, { b: 38, q: 'min9' }, { b: 43, q: 'dom9' }, { b: 36, q: 'maj9' }]
    },
    sunset: { // Hoàng hôn
      bpm: 84, swing: 0.14, scale: [0, 2, 4, 7, 9], melodyBase: 67, melodyProb: 0.38,
      prog: [{ b: 43, q: 'maj9' }, { b: 47, q: 'm7' }, { b: 40, q: 'min9' }, { b: 45, q: 'dom9' }]
    }
  };

  let ac = null, master, dry, rev, revSend, wobble, noiseBuf, crackle;
  let built = false, timer = null, playing = false, wantOn, vol, mood;
  let customAudio = null, customObjectUrl = '', customTrackName = '';
  let trackDatabase, trackRevision = 0, restoringTrack = false, trackStorageWarning = '';

  function storedTrack(mode, operation) {
    trackDatabase ??= new Promise((resolve, reject) => {
      const request = indexedDB.open('polyglot-music', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('tracks');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Music database is blocked'));
    });
    return trackDatabase.then(db => new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', mode);
      const request = operation(tx.objectStore('tracks'));
      tx.oncomplete = () => resolve(request.result);
      tx.onabort = () => reject(tx.error);
    }));
  }

  function setCustomTrack(file) {
    if (customObjectUrl) URL.revokeObjectURL(customObjectUrl);
    customObjectUrl = file ? URL.createObjectURL(file) : '';
    customTrackName = file?.name || '';
    if (file) customAudio.src = customObjectUrl;
    else customAudio.removeAttribute('src');
    customAudio.load();
  }

  function saveCustomTrack(file) {
    const revision = ++trackRevision;
    restoringTrack = false;
    trackStorageWarning = '';
    storedTrack('readwrite', store => file ? store.put(file, 'current') : store.delete('current')).catch(() => {
      if (revision !== trackRevision) return;
      trackStorageWarning = file ? 'Tệp này chỉ dùng được trong lần mở trang hiện tại.' : 'Không thể xóa tệp nhạc đã lưu.';
      syncUI();
    });
  }
  let nextTime = 0, step = 0, bar = 0, melodyIdx = 2, duckCount = 0, stopTimer = null;

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);

  function getAC() {
    if (window.__polyAC) return window.__polyAC;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    window.__polyAC = new C();
    return window.__polyAC;
  }

  function impulse(sec, decay) {
    const len = Math.floor(ac.sampleRate * sec);
    const buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function build() {
    if (built) return true;
    ac = getAC();
    if (!ac) return false;

    master = ac.createGain();
    master.gain.value = 0;
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3300; lp.Q.value = 0.5;
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.3;
    master.connect(lp); lp.connect(comp); comp.connect(ac.destination);

    dry = ac.createGain(); dry.gain.value = 1; dry.connect(master);
    rev = ac.createConvolver(); rev.buffer = impulse(2.8, 2.4);
    revSend = ac.createGain(); revSend.gain.value = 0.36;
    revSend.connect(rev); rev.connect(master);

    // dao động nhẹ như băng cassette
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.37;
    wobble = ac.createGain(); wobble.gain.value = 7; // cents
    lfo.connect(wobble); lfo.start();

    // nhiễu trắng dùng chung
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    // tiếng đĩa than lách tách
    const cLen = ac.sampleRate * 5;
    const cb = ac.createBuffer(1, cLen, ac.sampleRate);
    const cd = cb.getChannelData(0);
    for (let i = 0; i < cLen; i++) {
      cd[i] = (Math.random() * 2 - 1) * 0.006;
      if (Math.random() < 0.00045) cd[i] = (Math.random() * 2 - 1) * (0.25 + Math.random() * 0.6);
    }
    crackle = ac.createBufferSource(); crackle.buffer = cb; crackle.loop = true;
    const chp = ac.createBiquadFilter(); chp.type = 'highpass'; chp.frequency.value = 900;
    const cg = ac.createGain(); cg.gain.value = 0.55;
    crackle.connect(chp); chp.connect(cg); cg.connect(master);
    crackle.start();

    built = true;
    return true;
  }

  /* ---------- Giọng nhạc cụ ---------- */
  function rhodes(freq, t, dur, vel) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.012);
    g.gain.exponentialRampToValueAtTime(vel * 0.38, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const f = ac.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(Math.min(5200, freq * 7), t);
    f.frequency.exponentialRampToValueAtTime(Math.max(700, freq * 2), t + dur * 0.7);
    [['sine', 1, 0, 1], ['triangle', 2, 5, 0.3], ['sine', 4, -3, 0.08]].forEach(([type, mult, det, lvl]) => {
      const o = ac.createOscillator(); o.type = type; o.frequency.value = freq * mult; o.detune.value = det;
      wobble.connect(o.detune);
      const og = ac.createGain(); og.gain.value = lvl;
      o.connect(og); og.connect(f);
      o.start(t); o.stop(t + dur + 0.05);
    });
    f.connect(g); g.connect(dry); g.connect(revSend);
  }

  function pad(notes, t, dur, vel) {
    notes.forEach(n => {
      [-7, 7].forEach(det => {
        const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(n); o.detune.value = det;
        wobble.connect(o.detune);
        const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 620; f.Q.value = 0.3;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vel, t + 1.3);
        g.gain.linearRampToValueAtTime(vel * 0.8, t + dur - 0.6);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.9);
        o.connect(f); f.connect(g); g.connect(dry); g.connect(revSend);
        o.start(t); o.stop(t + dur + 1);
      });
    });
  }

  function bass(m, t, dur, vel) {
    const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
    const o2 = ac.createOscillator(); o2.type = 'triangle'; o2.frequency.value = mtof(m);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const g2 = ac.createGain(); g2.gain.value = 0.25;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(dry);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }

  function kick(t, vel) {
    const o = ac.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(125, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    const g = ac.createGain();
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(dry);
    o.start(t); o.stop(t + 0.32);
  }

  function noiseHit(t, type, freq, q, dur, vel, send) {
    const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ac.createGain();
    g.gain.setValueAtTime(vel, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    s.connect(f); f.connect(g); g.connect(dry);
    if (send) g.connect(revSend);
    s.start(t, Math.random() * 0.8); s.stop(t + dur + 0.02);
  }

  function chordNotes(c) {
    return Q[c.q].map(i => {
      let n = 60 + ((c.b + i) % 12);
      while (n < 55) n += 12;
      while (n > 78) n -= 12;
      return n;
    }).sort((a, b) => a - b);
  }

  /* ---------- Bộ lập lịch ---------- */
  function scheduleStep(s, t0) {
    const M = MOODS[mood];
    const beat = 60 / M.bpm, eighth = beat / 2;
    const t = t0 + (s % 2 === 1 ? M.swing * eighth : 0) + rnd(-0.006, 0.006);
    const chord = M.prog[bar % M.prog.length];
    const notes = chordNotes(chord);

    if (s === 0) {
      pad([notes[0], notes[2], notes[notes.length - 1]], t, beat * 4, 0.028);
      // rải hợp âm
      notes.forEach((n, i) => rhodes(mtof(n), t + i * 0.022, beat * 3.6, rnd(0.07, 0.095)));
      bass(chord.b, t, beat * 1.7, 0.34);
    }
    if (s === 3 && Math.random() < 0.55) {
      notes.slice(1, 4).forEach((n, i) => rhodes(mtof(n), t + i * 0.015, beat * 1.2, rnd(0.04, 0.06)));
    }
    if (s === 4 && Math.random() < 0.7) bass(chord.b + 7, t, beat * 0.9, 0.24);
    if (s === 7 && Math.random() < 0.3) bass(chord.b + 12, t, beat * 0.6, 0.18);

    // trống
    if (s === 0 || s === 5 || (s === 7 && Math.random() < 0.25)) kick(t, s === 0 ? 0.5 : 0.36);
    if (s === 2 || s === 6) {
      noiseHit(t, 'bandpass', 1900, 0.9, 0.16, 0.12, true);
      const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(190, t);
      o.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      const g = ac.createGain(); g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g); g.connect(dry); o.start(t); o.stop(t + 0.14);
    }
    if (Math.random() < 0.88) {
      const open = s === 7 && Math.random() < 0.35;
      noiseHit(t, 'highpass', 7200, 0.7, open ? 0.2 : 0.045, (s % 2 ? 0.032 : 0.05) * rnd(0.7, 1.1), false);
    }

    // giai điệu thưa, đi từng bậc trong thang ngũ cung
    const phraseRest = (Math.floor(bar / 2) % 4 === 3);
    if (!phraseRest && Math.random() < M.melodyProb) {
      melodyIdx = Math.max(0, Math.min(M.scale.length + 2, melodyIdx + Math.round(rnd(-2, 2))));
      const oct = Math.floor(melodyIdx / M.scale.length);
      const deg = M.scale[melodyIdx % M.scale.length];
      const m = M.melodyBase + oct * 12 + deg;
      const len = beat * [0.7, 1, 1.6, 2.2][Math.floor(Math.random() * 4)];
      const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
      wobble.connect(o.detune);
      const vib = ac.createOscillator(); vib.frequency.value = 5.2;
      const vg = ac.createGain(); vg.gain.value = 3.5;
      vib.connect(vg); vg.connect(o.detune);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(rnd(0.05, 0.075), t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(dry); g.connect(revSend);
      o.start(t); vib.start(t); o.stop(t + len + 0.05); vib.stop(t + len + 0.05);
    }
  }

  function advance() {
    const M = MOODS[mood];
    nextTime += (60 / M.bpm) / 2;
    step++;
    if (step >= 8) { step = 0; bar++; }
  }

  function pump() {
    if (!ac) return;
    while (nextTime < ac.currentTime + 0.4) {
      scheduleStep(step, nextTime);
      advance();
    }
  }

  function targetGain() { return vol * 0.95 * (duckCount > 0 ? 0.3 : 1); }

  function start() {
    if (restoringTrack) return;
    if (customObjectUrl && customAudio) {
      clearTimeout(stopTimer);
      if (timer) { clearInterval(timer); timer = null; }
      if (ac && master) {
        master.gain.cancelScheduledValues(ac.currentTime);
        master.gain.setTargetAtTime(0, ac.currentTime, 0.25);
      }
      updateCustomVolume();
      customAudio.play().then(() => {
        playing = true;
        syncUI();
      }).catch(() => {
        playing = false;
        syncUI('Không phát được tệp nhạc này. Hãy thử định dạng âm thanh khác.');
      });
      return;
    }
    if (!build()) return;
    clearTimeout(stopTimer);
    if (ac.state === 'suspended') ac.resume();
    if (!timer) {
      nextTime = ac.currentTime + 0.15; step = 0; bar = 0; melodyIdx = 2;
      timer = setInterval(pump, 90);
      pump();
    }
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setTargetAtTime(targetGain(), ac.currentTime, 0.7);
    playing = true;
    syncUI();
  }

  function stop() {
    playing = false;
    if (customAudio) customAudio.pause();
    if (ac && master) {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(0, ac.currentTime, 0.25);
    }
    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => { if (!playing && timer) { clearInterval(timer); timer = null; } }, 1400);
    syncUI();
  }

  function duck(on) {
    duckCount = Math.max(0, duckCount + (on ? 1 : -1));
    if (on) setTimeout(() => { if (duckCount > 0) { duckCount--; applyGain(); } }, 20000);
    applyGain();
  }
  function applyGain() {
    updateCustomVolume();
    if (ac && master && playing) {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(targetGain(), ac.currentTime, 0.2);
    }
  }
  function updateCustomVolume() {
    if (customAudio) customAudio.volume = Math.max(0, Math.min(1, vol * 0.95 * (duckCount > 0 ? 0.3 : 1)));
  }

  /* ---------- Giao diện ---------- */
  const $ = id => document.getElementById(id);
  function syncUI(message = '') {
    const btn = $('music-btn'), play = $('music-play'), stat = $('music-status');
    if (!btn) return;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-label', playing ? 'Nhạc nền đang phát' : 'Nhạc nền đang tắt');
    if (play) {
      play.innerHTML = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play" style="margin-left:2px"></i>';
      play.setAttribute('aria-label', playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
    }
    if (stat) stat.textContent = message || trackStorageWarning || (playing ? 'Đang phát' : (wantOn ? 'Chạm bất kỳ đâu để bắt đầu' : 'Đã tạm dừng'));
    const title = $('music-title');
    if (title) title.textContent = customTrackName || 'Lo-fi chill';
    const moods = $('music-moods');
    if (moods) moods.classList.toggle('hidden', Boolean(customObjectUrl));
    document.querySelectorAll('.music-mood').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mood === mood)));
    const vr = $('music-vol');
    if (vr) vr.style.setProperty('--fill', Math.round(vol * 100) + '%');
  }

  function setMood(m) {
    if (!MOODS[m] || m === mood) return;
    mood = m; localStorage.setItem(LS_MOOD, m);
    step = 0; bar = 0; melodyIdx = 2;
    if (ac) nextTime = ac.currentTime + 0.2;
    syncUI();
  }

  function toggle() {
    if (playing) { wantOn = false; localStorage.setItem(LS_ON, 'false'); stop(); }
    else { wantOn = true; localStorage.setItem(LS_ON, 'true'); start(); }
  }

  function initUI() {
    const btn = $('music-btn'), panel = $('music-panel');
    if (!btn || !panel) return;
    customAudio = document.createElement('audio');
    customAudio.loop = true;
    customAudio.preload = 'metadata';
    customAudio.addEventListener('error', () => syncUI('Không đọc được tệp nhạc này. Hãy thử định dạng âm thanh khác.'));
    restoringTrack = true;
    storedTrack('readonly', store => store.get('current')).then(file => {
      if (trackRevision === 0 && file instanceof File) setCustomTrack(file);
    }).catch(() => {
      if (trackRevision === 0) trackStorageWarning = 'Không thể mở bộ nhớ nhạc trên thiết bị.';
    }).finally(() => {
      if (trackRevision !== 0) return;
      restoringTrack = false;
      syncUI();
    });
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = panel.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!panel.classList.contains('hidden') && !$('music-widget').contains(e.target)) {
        panel.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) { panel.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
    $('music-play').addEventListener('click', toggle);
    $('music-file').addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if ((file.type && !file.type.startsWith('audio/')) ||
          (!file.type && !/\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm)$/i.test(file.name))) {
        syncUI('Vui lòng chọn một tệp âm thanh hợp lệ.');
        return;
      }
      stop();
      saveCustomTrack(file);
      setCustomTrack(file);
      wantOn = true;
      localStorage.setItem(LS_ON, 'true');
      start();
    });
    $('music-default').addEventListener('click', () => {
      const resume = playing || wantOn;
      stop();
      saveCustomTrack(null);
      setCustomTrack(null);
      wantOn = resume;
      localStorage.setItem(LS_ON, String(wantOn));
      if (resume) start();
      else syncUI();
    });
    $('music-vol').addEventListener('input', e => {
      vol = Math.max(0, Math.min(1, e.target.value / 100));
      localStorage.setItem(LS_VOL, String(vol));
      applyGain(); syncUI();
    });
    document.querySelectorAll('.music-mood').forEach(b => b.addEventListener('click', () => {
      setMood(b.dataset.mood);
      if (!playing) { wantOn = true; localStorage.setItem(LS_ON, 'true'); start(); }
    }));
    $('music-vol').value = Math.round(vol * 100);
    syncUI();
  }

  /* ---------- Hiệu ứng âm thanh (dùng chung 1 AudioContext) ---------- */
  function sfxEnv(g, t, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function tone(type, f0, f1, t, dur, peak, dest) {
    const o = ac.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain(); sfxEnv(g, t, peak, dur);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.03);
  }
  window.playSound = function (type) {
    try {
      if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
      const c = getAC(); if (!c) return;
      if (!ac) ac = c;
      if (c.state === 'suspended') c.resume();
      if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      const t = c.currentTime;
      const bus = c.createGain(); bus.gain.value = 0.9;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6000;
      bus.connect(lp); lp.connect(c.destination);

      if (type === 'correct') {
        tone('sine', 659.25, 659.25, t, 0.32, 0.16, bus);
        tone('sine', 987.77, 987.77, t + 0.09, 0.4, 0.13, bus);
        tone('triangle', 1318.5, 1318.5, t + 0.09, 0.3, 0.04, bus);
      } else if (type === 'laser') {
        tone('sawtooth', 1100, 220, t, 0.16, 0.07, bus);
        tone('sine', 1650, 330, t, 0.16, 0.08, bus);
      } else if (type === 'explode') {
        tone('sine', 160, 38, t, 0.4, 0.34, bus);
        const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
        const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.35);
        const g = c.createGain(); sfxEnv(g, t, 0.28, 0.38);
        s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + 0.42);
        tone('sine', 1200, 1900, t, 0.12, 0.05, bus);
      } else if (type === 'hit') {
        tone('square', 110, 40, t, 0.35, 0.16, bus);
        tone('sine', 70, 35, t, 0.45, 0.3, bus);
      } else if (type === 'flip') {
        const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
        const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 1.2;
        const g = c.createGain(); sfxEnv(g, t, 0.09, 0.09);
        s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + 0.11);
        tone('sine', 520, 700, t, 0.08, 0.05, bus);
      } else if (type === 'miss') {
        tone('triangle', 330, 220, t, 0.28, 0.12, bus);
      }
    } catch (e) { /* bỏ qua */ }
  };

  /* ---------- Khởi tạo ---------- */
  function boot() {
    vol = parseFloat(localStorage.getItem(LS_VOL));
    if (!(vol >= 0 && vol <= 1)) vol = 0.4;
    mood = localStorage.getItem(LS_MOOD);
    if (!MOODS[mood]) mood = 'chill';
    const saved = localStorage.getItem(LS_ON);
    wantOn = saved === null ? true : saved === 'true';
    initUI();

    // Trình duyệt chặn tự phát: bắt đầu ngay ở lần chạm/nhấn phím đầu tiên
    if (wantOn) {
      const kick1 = e => {
        // bấm vào chính bảng nhạc thì để nút Phát/Tạm dừng tự xử lý
        if (e && e.target && e.target.closest && e.target.closest('#music-widget')) return;
        if (!wantOn || playing || restoringTrack) return;
        window.removeEventListener('pointerdown', kick1, true);
        window.removeEventListener('keydown', kick1, true);
        start();
      };
      window.addEventListener('pointerdown', kick1, true);
      window.addEventListener('keydown', kick1, true);
    }

    // Nhường chỗ cho giọng đọc: nhạc nhỏ lại khi đang phát âm
    try {
      if ('speechSynthesis' in window) {
        const speak = window.speechSynthesis.speak.bind(window.speechSynthesis);
        window.speechSynthesis.speak = function (u) {
          try {
            let on = false;
            u.addEventListener('start', () => { if (!on) { on = true; duck(true); } });
            ['end', 'error'].forEach(ev => u.addEventListener(ev, () => { if (on) { on = false; duck(false); } }));
          } catch (_) {}
          return speak(u);
        };
      }
      const NativeAudio = window.Audio;
      window.Audio = function (src) {
        const a = src === undefined ? new NativeAudio() : new NativeAudio(src);
        let on = false;
        a.addEventListener('play', () => { if (!on) { on = true; duck(true); } });
        ['ended', 'pause', 'error'].forEach(ev => a.addEventListener(ev, () => { if (on) { on = false; duck(false); } }));
        return a;
      };
      window.Audio.prototype = NativeAudio.prototype;
    } catch (_) {}

    // Tab ẩn: dừng lập lịch để không bị vấp nhịp, quay lại thì chạy tiếp
    let resumeAfter = false;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { resumeAfter = playing; if (playing) stop(); }
      else if (resumeAfter && wantOn) { resumeAfter = false; start(); }
    });

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: 'Lo-fi chill', artist: 'PolyGlot SRS' });
        navigator.mediaSession.setActionHandler('play', () => { wantOn = true; start(); });
        navigator.mediaSession.setActionHandler('pause', () => { wantOn = false; stop(); });
      } catch (_) {}
    }

    // Âm thanh nhẹ khi lật thẻ / chưa nhớ
    if (typeof window.flipFlashcard === 'function') {
      const _flip = window.flipFlashcard;
      window.flipFlashcard = function () { window.playSound('flip'); return _flip.apply(this, arguments); };
    }
    if (typeof window.evaluateFlashcard === 'function') {
      const _eval = window.evaluateFlashcard;
      window.evaluateFlashcard = function (remembered) { if (remembered === false) window.playSound('miss'); return _eval.apply(this, arguments); };
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
