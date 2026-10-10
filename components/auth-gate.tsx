"use client";

import { useState, useSyncExternalStore } from "react";
import { isOwnerMobile, isOwnerOtp, session, signIn } from "@/lib/auth";

// Shows the sign-in page instead of the admin until the owner has signed in on this browser.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const signedIn = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getServerSnapshot);

  // Not known until the browser has been asked; showing nothing avoids a flash of the wrong screen.
  if (signedIn === null) return null;
  return signedIn ? children : <SignIn />;
}

function SignIn() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function submitMobile(event: React.FormEvent) {
    event.preventDefault();
    if (!isOwnerMobile(mobile)) return setError("This mobile number is not registered for the admin.");
    setError("");
    setStep("otp");
  }

  function submitOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!isOwnerOtp(otp)) return setError("That OTP is not correct. Try again.");
    signIn();
  }

  function changeNumber() {
    setOtp("");
    setError("");
    setStep("mobile");
  }

  return (
    <main className="signin">
      <div className="signin-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="signin-logo" src="/invidzz-logo.png" alt="Invidzz" />
        <h1>Sign in</h1>

        {step === "mobile" ? (
          <form className="signin-form" onSubmit={submitMobile}>
            <p className="page-sub">Enter your mobile number to open the admin.</p>
            <label className="field">
              <span className="field-label">Mobile number</span>
              <input value={mobile} onChange={(event) => setMobile(event.target.value)} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16} required autoFocus />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-dark">Continue</button>
          </form>
        ) : (
          <form className="signin-form" onSubmit={submitOtp}>
            <p className="page-sub">Enter the 4-digit OTP for {mobile.trim()}.</p>
            <label className="field">
              <span className="field-label">OTP</span>
              <input className="signin-otp" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" maxLength={4} required autoFocus />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-dark">Sign in</button>
            <button type="button" className="link-button" onClick={changeNumber}>Use a different number</button>
          </form>
        )}
      </div>
    </main>
  );
}
