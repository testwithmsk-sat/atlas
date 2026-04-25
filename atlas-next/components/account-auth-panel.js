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
        <p>Your account is ready for order history, future downloads, and returning purchases.</p>
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
