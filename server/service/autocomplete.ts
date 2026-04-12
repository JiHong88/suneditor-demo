/**
 * @fileoverview Autocomplete 플러그인 더미 데이터 생성 및 검색
 *
 * A-Z 알파벳별로 고르게 분포된 사용자 데이터를 생성하고, 이름 기반 검색 제공
 */

interface AutocompleteItem {
	key: string;
	name: string;
	desc: string;
	url: string;
}

const positions = ["Software Engineer", "Project Manager", "Data Scientist", "UX Designer", "Product Manager", "DevOps Engineer", "Frontend Developer", "Backend Developer"];

/** A-Z 각 알파벳별 이름 목록 (firstName lastName 형식) */
const namesByLetter: Record<string, string[]> = {
	A: ["Alice Park", "Aaron Kim", "Amelia Chen", "Adam Scott", "Aria Johnson"],
	B: ["Brian Lee", "Bella Thompson", "Benjamin Clark", "Beth Garcia", "Blake Wilson"],
	C: ["Casey Martin", "Clara Davis", "Chris Anderson", "Chloe White", "Connor Hall"],
	D: ["Dylan Moore", "Diana Taylor", "Daniel Brown", "Daisy Robinson", "David Lewis"],
	E: ["Emily Harris", "Ethan Walker", "Elena Martinez", "Eric Thomas", "Eva Rodriguez"],
	F: ["Finley Jones", "Fiona Miller", "Felix Jackson", "Faith Williams", "Frank Smith"],
	G: ["Grace Lee", "Grayson Hall", "Gemma Clark", "George Davis", "Gina Wilson"],
	H: ["Harper Taylor", "Henry Johnson", "Hannah Brown", "Hugo Martinez", "Hazel Anderson"],
	I: ["Ivy Thompson", "Isaac Garcia", "Irene White", "Ian Robinson", "Isla Harris"],
	J: ["Jordan Kim", "Julia Park", "James Walker", "Jasmine Lewis", "Jack Thomas"],
	K: ["Kai Moore", "Katherine Hall", "Kevin Clark", "Kira Davis", "Kyle Wilson"],
	L: ["Logan Miller", "Lily Jackson", "Leo Williams", "Luna Smith", "Liam Jones"],
	M: ["Morgan Lee", "Maya Taylor", "Mason Johnson", "Mia Brown", "Max Martinez"],
	N: ["Nico Anderson", "Nora White", "Nathan Robinson", "Nina Harris", "Noah Walker"],
	O: ["Oakley Lewis", "Olivia Thomas", "Oscar Garcia", "Ophelia Hall", "Owen Clark"],
	P: ["Peyton Davis", "Penelope Wilson", "Patrick Miller", "Phoebe Jackson", "Paul Williams"],
	Q: ["Quinn Smith", "Quincy Jones", "Queenie Lee", "Quentin Taylor", "Qiana Johnson"],
	R: ["Riley Brown", "Rachel Martinez", "Ryan Anderson", "Ruby White", "Rex Robinson"],
	S: ["Sawyer Harris", "Sophia Walker", "Samuel Lewis", "Stella Thomas", "Sean Garcia"],
	T: ["Taylor Hall", "Tessa Clark", "Thomas Davis", "Tina Wilson", "Tyler Miller"],
	U: ["Uma Jackson", "Ulysses Williams", "Unity Smith", "Ursula Jones", "Uri Lee"],
	V: ["Vivian Taylor", "Victor Johnson", "Violet Brown", "Vince Martinez", "Vera Anderson"],
	W: ["Wyatt White", "Willow Robinson", "William Harris", "Wendy Walker", "Wesley Lewis"],
	X: ["Xen Thomas", "Xia Garcia", "Xavier Hall", "Ximena Clark", "Xander Davis"],
	Y: ["Yael Wilson", "Yuki Miller", "Yasmin Jackson", "Yosef Williams", "Yvette Smith"],
	Z: ["Zane Jones", "Zara Lee", "Zion Taylor", "Zelda Johnson", "Zack Brown"],
};

function generateKey(name: string): string {
	return name.toLowerCase().replace(/\s+/g, ".");
}

function generateData(): AutocompleteItem[] {
	const data: AutocompleteItem[] = [];
	for (const names of Object.values(namesByLetter)) {
		for (const name of names) {
			const key = generateKey(name);
			data.push({
				key,
				name,
				desc: positions[data.length % positions.length],
				url: `/usr/${key}`,
			});
		}
	}
	return data;
}

const dummy = generateData();

/** 이름 기반 자동완성 데이터 검색 */
export function getAutocompleteSuggestions(name: string, limit: number): AutocompleteItem[] {
	const q = name.toLowerCase();
	return dummy.filter((item) => item.name.toLowerCase().includes(q) || item.key.startsWith(q)).slice(0, limit);
}
