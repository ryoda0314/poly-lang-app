/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // ← 新しいパッケージ名に修正
    autoprefixer: {},
  },
};

export default config;