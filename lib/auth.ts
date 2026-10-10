// Stand-in sign-in: one fixed mobile number and one fixed OTP, checked in the browser. No SMS is sent.
// It keeps a casual visitor out but is not real security: both values can be read from the page's code.
// Replace with Supabase sign-in before this admin goes online.
const ownerMobile = "7827351031";
const ownerOtp = "7827";

const key = "invidzz-admin-signed-in";
const listeners = new Set<() => void>();
// Used when the browser blocks storage, so signing in still works until the tab is closed.
let remembered = false;

// Accepts the number however it is typed: with spaces, dashes, a leading 0 or +91.
export function isOwnerMobile(mobile: string) {
  return mobile.replace(/\D/g, "").slice(-10) === ownerMobile;
}

export function isOwnerOtp(otp: string) {
  return otp.trim() === ownerOtp;
}

function setSignedIn(signedIn: boolean) {
  remembered = signedIn;
  try {
    if (signedIn) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    // Storage is blocked; `remembered` carries the answer instead.
  }
  for (const listener of listeners) listener();
}

export const signIn = () => setSignedIn(true);
export const signOut = () => setSignedIn(false);

// For useSyncExternalStore. null on the server, where it cannot be known yet.
export const session = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Signing out in one tab signs out the others.
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  },
  getSnapshot(): boolean | null {
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return remembered;
    }
  },
  getServerSnapshot(): boolean | null {
    return null;
  },
};
