/**
 * Persistence helpers for the install pop-ups ("remind me later" / "never").
 * Storage can be unavailable (private mode), so every access is guarded.
 */
const REMIND_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const VISIT_COUNT_KEY = 'appVisitCount';
const VISIT_SESSION_KEY = 'appVisitCounted';

const read = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const write = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    // ignore
  }
};

/** True if the prompt was dismissed forever or within the last 7 days. */
export const readDismissal = (prefix) => {
  if (read(localStorage, `${prefix}PermanentlyDismissed`) === 'true') return true;
  const dismissedAt = parseInt(read(localStorage, `${prefix}DismissedTime`) || '0', 10);
  return Date.now() - dismissedAt < REMIND_AFTER_MS;
};

export const dismissFor = (prefix) => write(localStorage, `${prefix}DismissedTime`, String(Date.now()));

export const dismissForever = (prefix) => write(localStorage, `${prefix}PermanentlyDismissed`, 'true');

/**
 * Count visits once per browser session (reloads and StrictMode remounts
 * don't inflate it) and return the total.
 */
export const getVisitCount = () => {
  let count = parseInt(read(localStorage, VISIT_COUNT_KEY) || '0', 10);
  if (read(sessionStorage, VISIT_SESSION_KEY) !== '1') {
    count += 1;
    write(localStorage, VISIT_COUNT_KEY, String(count));
    write(sessionStorage, VISIT_SESSION_KEY, '1');
  }
  return count;
};
