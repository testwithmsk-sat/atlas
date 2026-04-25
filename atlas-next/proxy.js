import { NextResponse } from "next/server";

export function proxy(request) {
  const { nextUrl } = request;
  const isHomePage = nextUrl.pathname === "/";
  const hasOAuthParams = nextUrl.searchParams.has("code") || nextUrl.searchParams.has("error");

  if (!isHomePage || !hasOAuthParams) {
    return NextResponse.next();
  }

  const callbackUrl = new URL("/auth/callback", request.url);
  nextUrl.searchParams.forEach((value, key) => {
    callbackUrl.searchParams.set(key, value);
  });

  if (!callbackUrl.searchParams.has("next")) {
    callbackUrl.searchParams.set("next", "/account");
  }

  return NextResponse.redirect(callbackUrl);
}

export const config = {
  matcher: ["/"]
};
