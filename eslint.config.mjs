// @ts-check
import eslint from '@eslint/js';
import next_ from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import {Alphabet} from 'eslint-plugin-perfectionist/alphabet';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unicorn from 'eslint-plugin-unicorn';
import {globalIgnores} from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
const importModifiers = ['value', 'type', 'side-effect'];

// TODO: fix eslint-plugin-next types
// - types say star import but runtime needs default import
// - severity should be StringSeverity rather than string
/**
 * @template T
 * @typedef {T & {rules: {[K in keyof T[Extract<keyof T, 'rules'>]]: 'off' | 'warn' | 'error'}}} FixFlatConfigType
 */
/** @typedef {typeof import('@next/eslint-plugin-next')} Next */
const next =
	/** @type {Next & {flatConfig: {[K in keyof Next['flatConfig']]: FixFlatConfigType<Next['flatConfig'][K]>}}} */ (
		next_
	);

export default tseslint.config(
	globalIgnores(['.next/', 'lib/generated/']),
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	{
		plugins: {perfectionist, unicorn},
		settings: {
			perfectionist: {
				type: 'custom',
				alphabet: Alphabet.generateRecommendedAlphabet()
					.sortByCharCodeAt()
					.getCharacters(),
				ignoreCase: false,
			},
		},
		rules: {
			'arrow-body-style': 1,
			curly: [1, 'multi-or-nest'],
			eqeqeq: [2, 'smart'],
			'func-style': 1,
			'object-shorthand': 1,
			'no-duplicate-imports': [2, {allowSeparateTypeImports: true}],
			'no-useless-rename': 1,
			'prefer-arrow-callback': 1,
			'perfectionist/sort-named-imports': [
				1,
				{groups: ['value-import', 'type-import']},
			],
			'perfectionist/sort-imports': [
				1,
				{
					newlinesBetween: 0,
					customGroups: importModifiers.map(modifier => ({
						groupName: `${modifier}-assets`,
						elementNamePattern: '^~/assets',
						modifiers: [modifier],
					})),
					groups: importModifiers.flatMap(modifier =>
						[
							'builtin',
							'external',
							'internal',
							'parent',
							'sibling',
							'style',
							'assets',
						].map(selector => `${modifier}-${selector}`),
					),
				},
			],
			'unicorn/no-lonely-if': 1,
			'unicorn/prefer-at': 2,
			'unicorn/prefer-code-point': 2,
			'unicorn/prefer-logical-operator-over-ternary': 2,
			'unicorn/prefer-negative-index': 2,
			'unicorn/prefer-node-protocol': 2,
			'unicorn/prefer-ternary': 1,
			'unicorn/prefer-spread': 2,
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		extends: [
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked,
		],
		rules: {
			'@typescript-eslint/consistent-type-imports': 2,
			'@typescript-eslint/explicit-function-return-type': 2,
			'@typescript-eslint/no-confusing-void-expression': 0,
			'@typescript-eslint/no-non-null-assertion': 0,
			'@typescript-eslint/no-unused-vars': 1,
			// Use non-strict rules (allow e.g. numbers)
			'@typescript-eslint/restrict-template-expressions': [2, {}],
			'@typescript-eslint/strict-boolean-expressions': 2,
		},
	},
	{
		files: ['**/*.tsx'],
		extends: [
			react.configs.flat.recommended,
			react.configs.flat['jsx-runtime'],
			reactHooks.configs['recommended-latest'],
			jsxA11y.flatConfigs.recommended,
			next.flatConfig.recommended,
			next.flatConfig.coreWebVitals,
		],
		settings: {
			react: {version: '19.1.1'},
		},
		rules: {
			'@typescript-eslint/explicit-function-return-type': 0,
			// checked by TS
			'react/no-unknown-property': 0,
		},
	},
	{
		files: ['eslint.config.mjs', 'tailwind.config.js'],
		languageOptions: {
			globals: globals.node,
		},
	},
);
