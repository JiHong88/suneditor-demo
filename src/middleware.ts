import { NextResponse, type NextRequest } from "next/server";
import { detectLocaleFromRequest } from "@/lib/locale";

export function middleware(req: NextRequest) {
	// 이미 lang 쿠키가 있으면 통과
	if (req.cookies.get("lang")) return NextResponse.next();

	const locale = detectLocaleFromRequest(req);
	const res = NextResponse.next();

	res.cookies.set("lang", locale, {
		path: "/",
		httpOnly: false, // 클라에서 읽을 수 있도록
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 365, // 1년
	});

	return res;
}

export const config = {
	matcher: ["/((?!_next|api|.*\\..*).*)"],
};
