import { NextResponse } from "next/server";
import { useRouter } from "next/dist/client/router";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("tumbleToken");
  const router = useRouter();
  const finalToken = jwt?.value;

  if (request.nextUrl.pathname.includes("/portalUser")) {
    if (jwt === undefined) {
      /* NETLIFY DOESN´T SUPPORT NEXT REDIRECT ROUTES */
      // return NextResponse.redirect(new URL("https://lighthearted-manatee-b0f198.netlify.app/", request.url));+
      //router.replace('/')
      window.open("/", "_self")
    }

    try {
      const { payload } = await jwtVerify(
        finalToken,
        new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'super-secret')
      );

      return NextResponse.next();
    } catch (error) {
      /* NETLIFY DOESN´T SUPPORT NEXT REDIRECT ROUTES */
      // return NextResponse.redirect(new URL("https://lighthearted-manatee-b0f198.netlify.app/", request.url));
      //router.replace('/')

      window.open("/", "_self")
    }
  }

  return NextResponse.next();
}
