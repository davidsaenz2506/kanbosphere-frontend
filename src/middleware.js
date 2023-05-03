import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("tumbleToken");
  const finalToken = jwt?.value;

  if (request.nextUrl.pathname.includes("/portalUser")) {
    if (jwt === undefined) {
      return NextResponse.redirect(new URL("lighthearted-manatee-b0f198.netlify.app/", request.url));
    }

    try {
      const { payload } = await jwtVerify(
        finalToken,
        new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'super-secret')
      );

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("lighthearted-manatee-b0f198.netlify.app/", request.url));
    }
  }

  return NextResponse.next();
}
