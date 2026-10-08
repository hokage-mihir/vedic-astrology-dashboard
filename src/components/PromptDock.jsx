import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { UpdateToast } from './UpdateToast';
import { CookieConsent } from './CookieConsent';
import InstallPrompt from './InstallPrompt';
import IOSInstallPrompt from './IOSInstallPrompt';

/**
 * Bottom-of-screen area for the app's pop-ups. Shows one at a time, in priority
 * order (update → cookie consent → install), so they never stack on top of each
 * other. Sits below bottom sheets (z-40) and toasts, and respects the iOS home
 * indicator safe area.
 */
export function PromptDock({ needsUpdate, onUpdate, onDismissUpdate, consentPending, onAcceptCookies, onRejectCookies }) {
  let content = null;
  if (needsUpdate) {
    content = <UpdateToast key="update" onUpdate={onUpdate} onDismiss={onDismissUpdate} />;
  } else if (consentPending) {
    content = <CookieConsent key="consent" onAccept={onAcceptCookies} onReject={onRejectCookies} />;
  } else {
    content = (
      <div key="install">
        <InstallPrompt />
        <IOSInstallPrompt />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-end">
      <div className="pointer-events-auto w-full max-w-sm">
        <AnimatePresence mode="wait">{content}</AnimatePresence>
      </div>
    </div>
  );
}

PromptDock.propTypes = {
  needsUpdate: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDismissUpdate: PropTypes.func.isRequired,
  consentPending: PropTypes.bool.isRequired,
  onAcceptCookies: PropTypes.func.isRequired,
  onRejectCookies: PropTypes.func.isRequired,
};

export default PromptDock;
