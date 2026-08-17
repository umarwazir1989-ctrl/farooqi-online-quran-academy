import { NextResponse } from "next/server";
import { getSessionTokens, signOut } from "@/lib/supabaseAuth";

export async function POST(request: Request) {
  const { accessToken } = await getSessionTokens();
  await signOut(accessToken);

  const url = new URL("/portal/login", request.url);
  const response = NextResponse.redirect(url);

  response.cookies.set("fq_access_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("fq_refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
