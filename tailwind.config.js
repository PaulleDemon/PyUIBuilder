/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw-',
	important: false,
    corePlugins: {
        preflight: false, // disable default styling
    },
	content: [
        "./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primaryBg: "#f6f7f8"
			}
		},
	},
	plugins: [],
}
