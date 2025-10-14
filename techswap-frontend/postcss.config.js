/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        '@tailwindcss/postcss': {}, // Use the new plugin package
        autoprefixer: {},
    },
};

export default config;