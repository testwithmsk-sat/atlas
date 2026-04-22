"use client";

import { useActionState } from "react";
import { signInAction, signOutAction, signUpAction } from "@/app/account/actions";

const initialState = { message: "" };

export function AccountAuthPanel({ email, hasSupabase }) {
  const [signInState, signInFormAction] = useActionState(signInAction, initialState);
  const [signUpState, signUpFormAction] = useActionState(signUpAction, initialState);
  const [signOutState, signOutFormAction] = useActionState(signOutAction, initialState);

  if (email) {
    return (
      <article className="info-card">
        <p className="eyebrow">Signed In</p>
        <h3>{email}</h3>
        <p>Your future downloads, orders, and account settings will live here.</p>
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
        <h3>Customer login starter</h3>
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
        <p className="status-note">
          {hasSupabase
            ? signInState.message || "Connect Supabase auth tables and this flow can go live."
            : "Add Supabase env keys to enable real sign in."}
        </p>
      </article>

      <article className="info-card">
        <p className="eyebrow">Create Account</p>
        <h3>New buyer setup</h3>
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
            ? signUpState.message || "New customers will use this route for purchases and downloads."
            : "Account creation is waiting for Supabase setup."}
        </p>
      </article>
    </>
  );
}
