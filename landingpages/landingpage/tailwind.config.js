/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw-',
	important: false,
	content: [
		"landing-page/**/*.{html, jsx, js}",
		"landing-page/**/*.js",
		"landing-page/**/*.html",
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#fff',
				secondary: "#000",
			}
		},
	},
	plugins: [],
}

