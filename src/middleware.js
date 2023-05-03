import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("tumbleToken");
  const finalToken = jwt?.value;

  if (request.nextUrl.pathname.includes("/portalUser")) {
    if (jwt === undefined) {
      window.open("/", "_self");
    }

    try {
      const { payload } = await jwtVerify(
        finalToken,
        new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      );

      return NextResponse.next();
    } catch (error) {
      window.open("/", "_self");
    }
  }

  return NextResponse.next();
}
