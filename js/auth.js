(function () {
  'use strict';

  const CONFIG_KEY = 'pg_auth_config';
  const SESSION_KEY = 'pg_auth_session';
  const USER_DATA_PREFIX = 'pg_user_';
  const APP_DATA_PREFIX = 'polyglot_';
  const storage = Storage.prototype;
  const nativeGet = storage.getItem;
  const nativeSet = storage.setItem;
  const nativeRemove = storage.removeItem;
  const nativeKey = storage.key;
  const nativeLength = Object.getOwnPropertyDescriptor(storage, 'length').get;

  function readJson(key, fallback) {
    const value = nativeGet.call(localStorage, key);
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Không thể đọc dữ liệu ${key}:`, error);
      return fallback;
    }
  }

  let config = readJson(CONFIG_KEY, null);
  let session = readJson(SESSION_KEY, null);
  let userId = session && session.user && session.user.id ? session.user.id : null;
  let authMode = 'signin';
  let syncTimer = null;
  let syncQueue = new Map();
  let syncRunning = false;
  let syncPromise = null;
  let sessionRefresh = null;
  let appScriptsLoaded = false;
  let appScriptsLoadPromise = null;

  function isAppKey(key) {
    return typeof key === 'string' && key.startsWith(APP_DATA_PREFIX);
  }

  function isSyncableAppKey(key) {
    return isAppKey(key) && key !== 'polyglot_gemini_key';
  }

  function userStorageKey(key, id = userId) {
    return `${USER_DATA_PREFIX}${id}_${key}`;
  }

  async function loadAppScripts() {
    if (appScriptsLoaded) return;
    if (appScriptsLoadPromise) return appScriptsLoadPromise;
    appScriptsLoadPromise = (async () => {
      for (const source of ['./js/app.js', './js/audio.js', './js/ui-bridge.js', './assets/app-ui.js']) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = source;
          script.async = false;
          script.onload = resolve;
          script.onerror = () => reject(new Error(`Không thể tải ${source}.`));
          document.body.appendChild(script);
        });
      }
      appScriptsLoaded = true;
    })();
    try {
      await appScriptsLoadPromise;
    } catch (error) {
      appScriptsLoadPromise = null;
      throw error;
    }
  }

  storage.getItem = function (key) {
    const name = String(key);
    return this === localStorage && userId && isAppKey(name)
      ? nativeGet.call(this, userStorageKey(name))
      : nativeGet.call(this, name);
  };

  storage.setItem = function (key, value) {
    const name = String(key);
    const text = String(value);
    if (this !== localStorage || !userId || !isAppKey(name)) {
      return nativeSet.call(this, name, text);
    }

    nativeSet.call(this, userStorageKey(name), text);
    if (!isSyncableAppKey(name)) return;
    const metadata = readMetadata(userId);
    const updatedAt = new Date().toISOString();
    metadata[name] = updatedAt;
    writeMetadata(userId, metadata);
    syncQueue.set(name, { value: text, updated_at: updatedAt });
    scheduleSync();
  };

  storage.removeItem = function (key) {
    const name = String(key);
    if (this === localStorage && userId && isAppKey(name)) {
      nativeRemove.call(this, userStorageKey(name));
      if (!isSyncableAppKey(name)) return;
      const metadata = readMetadata(userId);
      const updatedAt = new Date().toISOString();
      metadata[name] = updatedAt;
      writeMetadata(userId, metadata);
      syncQueue.set(name, { value: '', updated_at: updatedAt, deleted: true });
      scheduleSync();
      return;
    }
    nativeRemove.call(this, name);
  };

  function readMetadata(id) {
    return readJson(`pg_auth_meta_${id}`, {});
  }

  function writeMetadata(id, metadata) {
    nativeSet.call(localStorage, `pg_auth_meta_${id}`, JSON.stringify(metadata));
  }

  function listKeys(prefix) {
    const keys = [];
    for (let index = 0; index < nativeLength.call(localStorage); index++) {
      const key = nativeKey.call(localStorage, index);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
    return keys;
  }

  function showMessage(message, isError = false) {
    const element = document.getElementById('auth-message');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('hidden', !message);
    element.classList.remove('text-rose-700', 'dark:text-rose-300');
    if (isError) element.classList.add('text-rose-700', 'dark:text-rose-300');
  }

  function setSyncStatus(message, isError = false) {
    const element = document.getElementById('auth-sync-status');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('text-rose-600', isError);
    element.classList.toggle('dark:text-rose-300', isError);
  }

  function getErrorMessage(data, fallback) {
    return data && (data.msg || data.message || data.error_description || data.error)
      ? String(data.msg || data.message || data.error_description || data.error)
      : fallback;
  }

  function apiUrl(path) {
    if (!config || !config.url || !config.anonKey) {
      throw new Error('Hãy lưu Project URL và publishable/anon key trong phần Cấu hình Supabase.');
    }
    return `${config.url.replace(/\/+$/, '')}${path}`;
  }

  async function request(path, options = {}) {
    const headers = { apikey: config.anonKey };
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (options.authenticated) headers.Authorization = `Bearer ${await getAccessToken()}`;
    if (options.prefer) headers.Prefer = options.prefer;

    const response = await fetch(apiUrl(path), {
      method: options.method || 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
    if (!response.ok) {
      throw new Error(getErrorMessage(data, `Supabase trả về lỗi HTTP ${response.status}.`));
    }
    return data;
  }

  function saveSession(nextSession) {
    session = {
      ...nextSession,
      expires_at: nextSession.expires_at || Math.floor(Date.now() / 1000) + (nextSession.expires_in || 3600),
    };
    userId = session.user && session.user.id ? session.user.id : null;
    nativeSet.call(localStorage, SESSION_KEY, JSON.stringify(session));
    updateAccountUI();
  }

  function clearSession() {
    session = null;
    userId = null;
    nativeRemove.call(localStorage, SESSION_KEY);
    syncQueue.clear();
    updateAccountUI();
  }

  async function refreshSession() {
    if (!session || !session.refresh_token) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    const nextSession = await request('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: { refresh_token: session.refresh_token },
    });
    if (!nextSession || !nextSession.access_token || !nextSession.user) {
      throw new Error('Supabase không trả về phiên đăng nhập hợp lệ.');
    }
    saveSession(nextSession);
    return session.access_token;
  }

  async function getAccessToken() {
    if (!session || !session.access_token) throw new Error('Vui lòng đăng nhập để đồng bộ dữ liệu.');
    if (sessionRefresh) return sessionRefresh;
    if (session.expires_at && session.expires_at > Math.floor(Date.now() / 1000) + 60) return session.access_token;

    sessionRefresh = refreshSession()
      .catch(error => {
        clearSession();
        window.setTimeout(() => window.location.reload(), 0);
        throw error;
      })
      .finally(() => { sessionRefresh = null; });
    return sessionRefresh;
  }

  function updateAccountUI() {
    const button = document.getElementById('auth-account-button');
    const label = document.getElementById('auth-account-label');
    const signedIn = document.getElementById('auth-signed-in');
    const form = document.getElementById('auth-form');
    const email = document.getElementById('auth-user-email');
    const isSignedIn = Boolean(session && userId);
    if (button && label) {
      label.textContent = isSignedIn ? (session.user.email || 'Tài khoản') : 'Đăng nhập';
      button.setAttribute('aria-label', isSignedIn ? `Tài khoản ${session.user.email || ''}` : 'Đăng nhập');
      button.title = isSignedIn ? `Đang đăng nhập: ${session.user.email || ''}` : 'Đăng nhập và đồng bộ dữ liệu';
    }
    if (signedIn) signedIn.classList.toggle('hidden', !isSignedIn);
    if (form) form.classList.toggle('hidden', isSignedIn);
    if (email && isSignedIn) email.textContent = session.user.email || 'Tài khoản Supabase';
    if (!isSignedIn) {
      const message = config
        ? 'Đăng nhập để đồng bộ từ vựng và tiến độ giữa các thiết bị. Bạn vẫn có thể học ngoại tuyến.'
        : 'Chưa cấu hình Supabase. Ứng dụng vẫn lưu dữ liệu trên thiết bị này.';
      setSyncStatus(message);
    }
  }

  function updateAuthMode() {
    const isSignup = authMode === 'signup';
    document.getElementById('auth-title').textContent = isSignup ? 'Tạo tài khoản' : 'Đăng nhập';
    document.getElementById('auth-submit-button').textContent = isSignup ? 'Đăng ký' : 'Đăng nhập';
    document.getElementById('auth-mode-toggle').textContent = isSignup
      ? 'Đã có tài khoản? Đăng nhập'
      : 'Chưa có tài khoản? Đăng ký';
    document.getElementById('auth-password').autocomplete = isSignup ? 'new-password' : 'current-password';
  }

  function openAuthDialog() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    updateAccountUI();
    if (!config) document.getElementById('auth-config-details').open = true;
    window.setTimeout(() => {
      const focusTarget = session ? document.getElementById('auth-sync-button') : document.getElementById('auth-email');
      if (focusTarget) focusTarget.focus();
    }, 0);
  }

  function closeAuthDialog() {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function setFormBusy(busy) {
    document.getElementById('auth-submit-button').disabled = busy;
    document.getElementById('auth-submit-button').classList.toggle('opacity-60', busy);
  }

  function appDataPath(id) {
    const query = new URLSearchParams({
      select: 'key,value,updated_at,deleted',
      user_id: `eq.${id}`,
    });
    return `/rest/v1/user_app_data?${query}`;
  }

  async function fetchCloudRows(id) {
    const rows = await request(appDataPath(id), { authenticated: true });
    if (!Array.isArray(rows)) throw new Error('Dữ liệu đồng bộ từ Supabase không đúng định dạng.');
    return rows.filter(row => row && isSyncableAppKey(row.key) && typeof row.value === 'string');
  }

  async function upsertRows(id, rows) {
    if (!rows.length) return;
    const payload = rows.map(row => ({
      user_id: id,
      key: row.key,
      value: row.value,
      updated_at: row.updated_at,
      deleted: Boolean(row.deleted),
    }));
    const query = new URLSearchParams({ on_conflict: 'user_id,key' });
    await request(`/rest/v1/user_app_data?${query}`, {
      method: 'POST',
      authenticated: true,
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: payload,
    });
  }

  function cacheEntries(id) {
    const prefix = `${USER_DATA_PREFIX}${id}_${APP_DATA_PREFIX}`;
    return listKeys(prefix).map(storageKey => ({
      key: storageKey.slice(`${USER_DATA_PREFIX}${id}_`.length),
      storageKey,
      value: nativeGet.call(localStorage, storageKey),
    })).filter(entry => isSyncableAppKey(entry.key));
  }

  async function syncUserData(id) {
    const rows = await fetchCloudRows(id);
    const remote = new Map(rows.map(row => [row.key, row]));
    const metadata = readMetadata(id);
    const pending = [];
    let changed = false;

    if (remote.size === 0) {
      const cached = cacheEntries(id);
      const localEntries = cached.length
        ? cached
        : listKeys(APP_DATA_PREFIX).filter(isSyncableAppKey).map(key => ({
          key,
          storageKey: key,
          value: nativeGet.call(localStorage, key),
        }));
      const now = new Date().toISOString();
      for (const entry of localEntries) {
        if (entry.value === null) continue;
        const updatedAt = metadata[entry.key] || now;
        nativeSet.call(localStorage, userStorageKey(entry.key, id), entry.value);
        metadata[entry.key] = updatedAt;
        pending.push({ key: entry.key, value: entry.value, updated_at: updatedAt });
        changed = true;
      }
      if (pending.length) await upsertRows(id, pending);
      writeMetadata(id, metadata);
      return changed;
    }

    const localEntries = cacheEntries(id);
    const local = new Map(localEntries.map(entry => [entry.key, entry]));
    for (const entry of localEntries) {
      const cloud = remote.get(entry.key);
      if (!cloud) {
        pending.push({
          key: entry.key,
          value: entry.value,
          updated_at: metadata[entry.key] || new Date().toISOString(),
        });
        continue;
      }
      const localTime = Date.parse(metadata[entry.key] || '');
      const cloudTime = Date.parse(cloud.updated_at || '');
      if (entry.value !== null && Number.isFinite(localTime) && localTime > cloudTime) {
        pending.push({ key: entry.key, value: entry.value, updated_at: metadata[entry.key] });
      } else if (cloud.deleted) {
        nativeRemove.call(localStorage, entry.storageKey);
        metadata[entry.key] = cloud.updated_at || new Date().toISOString();
        changed = true;
      } else {
        if (entry.value !== cloud.value) changed = true;
        nativeSet.call(localStorage, entry.storageKey, cloud.value);
        metadata[entry.key] = cloud.updated_at || new Date().toISOString();
      }
    }

    for (const cloud of rows) {
      if (!local.has(cloud.key)) {
        metadata[cloud.key] = cloud.updated_at || new Date().toISOString();
        if (!cloud.deleted) {
          nativeSet.call(localStorage, userStorageKey(cloud.key, id), cloud.value);
          changed = true;
        }
      }
    }

    await upsertRows(id, pending);
    writeMetadata(id, metadata);
    return changed;
  }

  function scheduleSync() {
    if (!userId || !config) return;
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => { flushSyncQueue(); }, 700);
  }

  async function flushSyncQueue() {
    if (syncRunning) return syncPromise || false;
    if (!userId || !config || !syncQueue.size) return true;
    syncRunning = true;
    const id = userId;
    const batch = new Map(syncQueue);
    syncPromise = (async () => {
      try {
        await upsertRows(id, [...batch].map(([key, entry]) => ({
          key,
          value: entry.value,
          updated_at: entry.updated_at,
          deleted: Boolean(entry.deleted),
        })));
        for (const [key, entry] of batch) {
          if (syncQueue.get(key) === entry) syncQueue.delete(key);
        }
        setSyncStatus(`Đã đồng bộ ${new Date().toLocaleTimeString('vi-VN')}.`);
        return true;
      } catch (error) {
        setSyncStatus(`Chưa đồng bộ được: ${error.message}`, true);
        return false;
      } finally {
        syncRunning = false;
        syncPromise = null;
        if (syncQueue.size && userId === id) scheduleSync();
      }
    })();
    return syncPromise;
  }

  async function signInOrSignUp(event) {
    event.preventDefault();
    if (!config) {
      showMessage('Hãy cấu hình Supabase trước khi đăng nhập.', true);
      document.getElementById('auth-config-details').open = true;
      return;
    }
    setFormBusy(true);
    showMessage('Đang kết nối Supabase...');
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    try {
      const endpoint = authMode === 'signup' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
      const result = await request(endpoint, { method: 'POST', body: { email, password } });
      if (!result || !result.access_token || !result.user) {
        if (authMode === 'signup' && result && result.user) {
          showMessage('Đăng ký thành công. Hãy xác nhận email, sau đó quay lại đăng nhập.');
          return;
        }
        throw new Error('Supabase không trả về phiên đăng nhập. Kiểm tra cấu hình xác nhận email.');
      }

      saveSession(result);
      showMessage('Đăng nhập thành công. Đang tải và đồng bộ dữ liệu học...');
      await syncUserData(userId);
      window.location.reload();
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      setFormBusy(false);
    }
  }

  async function signOut() {
    const id = userId;
    try {
      if (!await flushSyncQueue()) throw new Error('Dữ liệu đang chờ đồng bộ. Hãy thử lại khi có kết nối.');
      if (session && session.access_token) {
        await request('/auth/v1/logout', { method: 'POST', authenticated: true });
      }
      clearSession();
      closeAuthDialog();
      if (id) window.location.reload();
    } catch (error) {
      showMessage(`Không thể đăng xuất an toàn: ${error.message}`, true);
    }
  }

  async function syncNow() {
    if (!userId) return;
    const button = document.getElementById('auth-sync-button');
    button.disabled = true;
    setSyncStatus('Đang đồng bộ dữ liệu...');
    try {
      if (!await flushSyncQueue()) throw new Error('Dữ liệu đang chờ đồng bộ. Hãy thử lại khi có kết nối.');
      const changed = await syncUserData(userId);
      setSyncStatus('Đồng bộ hoàn tất.');
      if (!appScriptsLoaded) {
        closeAuthDialog();
        await loadAppScripts();
      } else if (changed) {
        window.location.reload();
      }
    } catch (error) {
      setSyncStatus(`Không thể đồng bộ: ${error.message}`, true);
    } finally {
      button.disabled = false;
    }
  }

  function saveConfig(event) {
    event.preventDefault();
    const urlInput = document.getElementById('auth-project-url');
    const keyInput = document.getElementById('auth-anon-key');
    let parsed;
    try {
      parsed = new URL(urlInput.value.trim());
    } catch {
      showMessage('Project URL không hợp lệ.', true);
      return;
    }
    if (!['https:', 'http:'].includes(parsed.protocol) || (parsed.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(parsed.hostname))) {
      showMessage('Supabase URL phải dùng HTTPS (ngoại trừ localhost khi phát triển).', true);
      return;
    }
    const nextConfig = { url: parsed.origin, anonKey: keyInput.value.trim() };
    if (!nextConfig.anonKey) {
      showMessage('Hãy nhập publishable/anon key.', true);
      return;
    }
    const accountChanged = config && (config.url !== nextConfig.url || config.anonKey !== nextConfig.anonKey) && session;
    config = nextConfig;
    nativeSet.call(localStorage, CONFIG_KEY, JSON.stringify(config));
    showMessage('Đã lưu cấu hình Supabase trên thiết bị này.');
    updateAccountUI();
    if (accountChanged) {
      clearSession();
      showMessage('Đã đổi project Supabase. Hãy đăng nhập lại.');
      window.location.reload();
    }
  }

  async function initializeAuth() {
    const configForm = document.getElementById('auth-config-form');
    const emailInput = document.getElementById('auth-email');
    if (!configForm || !emailInput) return;
    if (config) {
      document.getElementById('auth-project-url').value = config.url || '';
      document.getElementById('auth-anon-key').value = config.anonKey || '';
    }
    document.getElementById('auth-form').addEventListener('submit', signInOrSignUp);
    configForm.addEventListener('submit', saveConfig);
    document.getElementById('auth-mode-toggle').addEventListener('click', () => {
      authMode = authMode === 'signin' ? 'signup' : 'signin';
      updateAuthMode();
      document.getElementById('auth-password').value = '';
      showMessage('');
    });
    document.getElementById('auth-signout-button').addEventListener('click', signOut);
    document.getElementById('auth-sync-button').addEventListener('click', syncNow);
    document.getElementById('auth-modal').addEventListener('keydown', event => {
      if (event.key === 'Escape') closeAuthDialog();
    });
    updateAuthMode();
    updateAccountUI();

    if (session && config && userId) {
      try {
        await syncUserData(userId);
        setSyncStatus('Đã kết nối và đồng bộ dữ liệu.');
        await loadAppScripts();
      } catch (error) {
        setSyncStatus(`Đang dùng dữ liệu trên thiết bị; đồng bộ lỗi: ${error.message}`, true);
        openAuthDialog();
        if (!userId || cacheEntries(userId).length) await loadAppScripts();
      }
    } else {
      await loadAppScripts();
    }
  }

  function startApp() {
    initializeAuth().catch(error => {
      setSyncStatus(`Không thể khởi động ứng dụng: ${error.message}`, true);
      openAuthDialog();
    });
  }

  window.openAuthDialog = openAuthDialog;
  window.closeAuthDialog = closeAuthDialog;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, { once: true });
  } else {
    startApp();
  }

  window.addEventListener('online', () => {
    if (userId) {
      (async () => {
        if (!await flushSyncQueue()) throw new Error('Dữ liệu đang chờ đồng bộ.');
        const changed = await syncUserData(userId);
        if (!appScriptsLoaded) await loadAppScripts();
        else if (changed) window.location.reload();
      })()
        .catch(error => setSyncStatus(`Đang dùng dữ liệu trên thiết bị; đồng bộ lỗi: ${error.message}`, true));
    }
  });
})();
