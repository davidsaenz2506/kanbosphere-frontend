import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("tumbleToken");
  const finalToken = jwt?.value;


  return NextResponse.next();
}
