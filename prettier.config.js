// prettier.config.js 或 .prettierrc.js
module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'lf', // ✅ 关键：强制使用 LF（解决 Delete ␍ 报错）
  plugins: ['prettier-plugin-tailwindcss'],
}
