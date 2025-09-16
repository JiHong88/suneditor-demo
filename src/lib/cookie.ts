type SameSiteOption = "Strict" | "Lax" | "None";

interface CookieOptions {
	days?: number;
	path?: string;
	secure?: boolean;
	sameSite?: SameSiteOption;
}

export function readCookie(name: string): string | null {
	const nameEQ = `${encodeURIComponent(name)}=`;
	const cookies = document.cookie.split(";");

	for (let cookie of cookies) {
		cookie = cookie.trim();
		if (cookie.startsWith(nameEQ)) {
			return decodeURIComponent(cookie.substring(nameEQ.length));
		}
	}
	return null;
}

export function writeCookie(name: string, value: string, { days, path = "/", secure, sameSite }: CookieOptions = {}): void {
	let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;

	if (days !== undefined) {
		const date = new Date();
		date.setTime(date.getTime() + days * 864e5);
		cookieStr += `; expires=${date.toUTCString()}`;
	}

	if (secure) {
		cookieStr += `; Secure`;
	}

	if (sameSite) {
		cookieStr += `; SameSite=${sameSite}`;
	}

	document.cookie = cookieStr;
}

export function deleteCookie(name: string, path: string = "/"): void {
	document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
