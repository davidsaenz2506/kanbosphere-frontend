import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("tumbleToken");
  const finalToken = jwt?.value;

  if (request.nextUrl.pathname.includes("/dashboard")) {
    if (jwt === undefined) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const { payload } = await jwtVerify( finalToken, new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "super-secret"));

      if (payload) return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
