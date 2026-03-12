import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@next/next/no-html-link-for-pages": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"react-hooks/exhaustive-deps": "off",
			"prefer-const": "error",
			"no-var": "error",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
		},
	},
	{
		files: ["**/*.cjs"],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];

export default eslintConfig;
