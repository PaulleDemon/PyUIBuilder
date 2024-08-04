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
			}
		},
	},
	plugins: [],
}
