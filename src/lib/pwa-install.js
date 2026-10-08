import { useSyncExternalStore } from 'react';

/**
 * Single owner of the `beforeinstallprompt` event. The browser fires it once,
 * and a deferred prompt can only be used once, so the install pop-up and the
 * footer button must share it instead of each capturing their own copy.
 * Listeners are attached at import time so an early event isn't missed.
 */
let deferredPrompt = null;
let installed = typeof window !== 'undefined' && (
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true
);
const listeners = new Set();
let snapshot = { canInstall: false, isInstalled: installed };

const emit = () => {
  snapshot = { canInstall: !!deferredPrompt && !installed, isInstalled: installed };
  listeners.forEach((listener) => listener());
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Keep the browser's mini-infobar from showing; we offer our own prompt
    event.preventDefault();
    deferredPrompt = event;
    emit();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installed = true;
    emit();
  });
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Show the native install dialog.
 * @returns {Promise<'accepted'|'dismissed'|'unavailable'>}
 */
export const promptInstall = async () => {
  if (!deferredPrompt) return 'unavailable';
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  emit();
  promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  return outcome;
};

export const isIOSDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  // iPadOS 13+ reports itself as a Mac; touch support gives it away
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/.test(ua) || isIPadOS;
};

export function usePWAInstall() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
