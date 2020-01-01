module.exports = {
	"parserOptions": {
		"sourceType": "module"
	},
	"env": {
		"node": true,
		"es2020": true
	},
	"extends": "eslint:recommended",
  "plugins": [],
  "rules": {
		"no-console": 'warn',
		"semi": "warn",
		"default-case": "error",
		"eqeqeq": "error",
		"curly": ["warn", "multi-line"],
		"no-unused-vars": "warn"
  }
}
