module.exports = {
  '**/*.{js,jsx,ts,tsx}': (files) => [
    `pnpm lint:strict ${files.map((f) => `"${f}"`).join(' ')}`,
    `pnpm format:write ${files.map((f) => `"${f}"`).join(' ')}`,
  ],
  '**/*.{json,md,css}': (files) =>
    `pnpm format:write ${files.map((f) => `"${f}"`).join(' ')}`,
};
