(function () {
  'use strict';

  const sessionKey = 'pg_auth_session';
  const configKey = 'pg_auth_config';
  let userId = null;

  try {
    const session = JSON.parse(localStorage.getItem(sessionKey) || 'null');
    if (session && session.user && typeof session.user.id === 'string') {
      userId = session.user.id;
    }
  } catch (error) {
    console.error('Không thể đọc phiên đăng nhập cũ:', error);
  }

  if (userId) {
    const legacyPrefix = `pg_user_${userId}_polyglot_`;
    const legacyKeys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith(legacyPrefix)) legacyKeys.push(key);
    }

    for (const key of legacyKeys) {
      const localKey = key.slice(`pg_user_${userId}_`.length);
      if (localStorage.getItem(localKey) === null) {
        localStorage.setItem(localKey, localStorage.getItem(key));
      }
    }
  }

  localStorage.removeItem(sessionKey);
  localStorage.removeItem(configKey);
})();
