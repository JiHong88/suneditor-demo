/**
 * @fileoverview Mention 플러그인 더미 데이터 생성 및 검색
 *
 * 기존 server/service/mention.js를 TypeScript로 변환
 * 150명의 랜덤 사용자 데이터를 생성하고, 이름 기반 검색 제공
 */

interface MentionItem {
	key: string;
	name: string;
	desc: string;
}

function generateRandomString(length: number): string {
	const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

function generateName(): string {
	const firstNames = [
		"Alex", "Bailey", "Casey", "Dylan", "Elliott", "Finley", "Grayson", "Harper",
		"Ivy", "Jordan", "Kai", "Logan", "Morgan", "Nico", "Oakley", "Peyton",
		"Quinn", "Riley", "Sawyer", "Taylor", "Umi", "Vivian", "Wyatt", "Xen", "Yael", "Zane",
	];
	const lastNames = [
		"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
		"Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
		"Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
	];

	const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
	return `${firstName} ${lastName}`;
}

function generateRealisticKey(name: string): string {
	const [firstName, lastName] = name.split(" ");
	const firstInitial = firstName[0].toLowerCase();
	const lastInitial = lastName ? lastName[0].toLowerCase() : "";
	const namePart = lastName ? lastName.slice(1, 3).toLowerCase() : "";
	const randomPart = generateRandomString(3);
	return `${firstInitial}${lastInitial}${namePart}${randomPart}`;
}

function generateData(): MentionItem[] {
	const positions = ["Software Engineer", "Project Manager", "Data Scientist", "UX Designer", "Product Manager"];
	const data: MentionItem[] = [];

	for (let i = 0; i < 150; i++) {
		const name = generateName();
		const key = generateRealisticKey(name);
		const position = positions[Math.floor(Math.random() * positions.length)];
		data.push({ key, name, desc: position });
	}

	return data;
}

const dummy = generateData();

/** 이름 기반 멘션 데이터 검색 */
export function getMentions(name: string, limit: number): MentionItem[] {
	return dummy.filter((item) => item.key.toLowerCase().startsWith(name.toLowerCase())).slice(0, limit);
}
