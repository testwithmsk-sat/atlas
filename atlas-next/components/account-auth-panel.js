"use client";

import { useActionState } from "react";
import { signInAction, signInWithGoogleAction, signOutAction, signUpAction } from "@/app/account/actions";

const initialState = { message: "" };

export function AccountAuthPanel({ email, hasSupabase, profileName = "", avatarUrl = "", providerLabel = "" }) {
  const [signInState, signInFormAction] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction] = useActionState(signUpAction, initialState);
  const [signOutState, signOutFormAction] = useActionState(signOutAction, initialState);

  if (email) {
    return (
      <article className="info-card">
        <p className="eyebrow">Signed In</p>
        <div className="account-profile">
          {avatarUrl ? <img className="account-profile-avatar" src={avatarUrl} alt={profileName || email} /> : null}
          <div>
            <h3>{profileName || email}</h3>
            {profileName && profileName !== email ? <p>{email}</p> : null}
            <p>{providerLabel ? `Signed in with ${providerLabel}` : "Your account is ready for order history and downloads."}</p>
          </div>
        </div>
        <form action={signOutFormAction}>
          <button className="button button-primary" type="submit">
            Sign Out
          </button>
        </form>
        {signOutState.message ? <p className="status-note">{signOutState.message}</p> : null}
      </article>
    );
  }

  return (
    <>
      <article className="info-card">
        <p className="eyebrow">Sign In</p>
        <h3>Access your account</h3>
        <form className="auth-form" action={signInFormAction}>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" placeholder="Password" required />
          </label>
          <button className="button button-primary" type="submit">
            Sign In
          </button>
        </form>
        {hasSupabase ? (
          <>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <form action={signInWithGoogleAction}>
              <button className="button button-google" type="submit">
                Continue With Google
              </button>
            </form>
          </>
        ) : null}
        <p className="status-note">
          {hasSupabase
            ? signInState.message || "Sign in to access your account, orders, and future downloads."
            : "Sign in will be available soon."}
        </p>
      </article>

      <article className="info-card">
        <p className="eyebrow">Create Account</p>
        <h3>Create your customer account</h3>
        <form className="auth-form" action={signUpFormAction}>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" placeholder="Create a password" required />
          </label>
          <button className="button button-secondary" type="submit">
            Create Account
          </button>
        </form>
        <p className="status-note">
          {hasSupabase
            ? signUpState.message || "Create an account so customers can return to their purchases later."
            : "Account creation will be available soon."}
        </p>
      </article>
    </>
  );
}
