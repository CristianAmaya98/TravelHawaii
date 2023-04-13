module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: 2020,
		parser: 'babel-eslint',
		sourceType: 'module',
	},
	rules: {
		// tus reglas de Eslint aquí
	},
};
