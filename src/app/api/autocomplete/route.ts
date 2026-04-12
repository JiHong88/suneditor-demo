/**
 * GET /api/autocomplete?name=:name&limit=:limit
 *
 * SunEditor autocomplete 플러그인의 apiUrl이 이 엔드포인트를 가리킴
 */

import { NextRequest, NextResponse } from "next/server";
import { getAutocompleteSuggestions } from "@/../server/service/autocomplete";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const name = searchParams.get("name") || "";
	const limit = parseInt(searchParams.get("limit") || "10", 10);

	const results = getAutocompleteSuggestions(name, limit);
	return NextResponse.json(results);
}
