import "flag-icons/css/flag-icons.min.css";

/** Locale code → ISO 3166-1 alpha-2 country code (lowercase) */
const LOCALE_TO_COUNTRY: Record<string, string> = {
	ar: "sa",
	ckb: "iq",
	cs: "cz",
	da: "dk",
	de: "de",
	en: "us",
	es: "es",
	fa: "ir",
	fr: "fr",
	he: "il",
	hu: "hu",
	it: "it",
	ja: "jp",
	km: "kh",
	ko: "kr",
	lv: "lv",
	nl: "nl",
	pl: "pl",
	"pt-BR": "br",
	ro: "ro",
	ru: "ru",
	sv: "se",
	tr: "tr",
	uk: "ua",
	ur: "pk",
	"zh-CN": "cn",
};

type Props = {
	locale: string;
	className?: string;
};

export default function FlagIcon({ locale, className }: Props) {
	const country = LOCALE_TO_COUNTRY[locale] ?? locale.slice(-2).toLowerCase();
	return <span className={`fi fi-${country} ${className ?? ""}`} aria-hidden />;
}
