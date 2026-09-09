/**
 * Utility to adapt installation commands to the user's active package manager (npm, pnpm, yarn, bun).
 * Non-JavaScript commands (pip, cargo, go get, docker, etc.) remain intact.
 */
export function formatInstallCommand(rawCommand = '', packageManager = 'npm') {
  if (!rawCommand) return '';
  const trimmed = rawCommand.trim();

  // If not a JS package manager command, keep original (e.g. pip, cargo, go get, docker)
  const isJsCommand = /^(npm|pnpm|yarn|bun)\s+(i|install|add)/i.test(trimmed);
  if (!isJsCommand) return trimmed;

  const isDev = /(-D|--save-dev)\b/.test(trimmed);
  // Extract package names
  const pkgs = trimmed
    .replace(/^(npm|pnpm|yarn|bun)\s+(i|install|add)\s*/i, '')
    .replace(/(-D|--save-dev)\s*/g, '')
    .trim();

  switch (packageManager) {
    case 'pnpm':
      return `pnpm add ${isDev ? '-D ' : ''}${pkgs}`;
    case 'yarn':
      return `yarn add ${isDev ? '-D ' : ''}${pkgs}`;
    case 'bun':
      return `bun add ${isDev ? '-d ' : ''}${pkgs}`;
    case 'npm':
    default:
      return `npm i ${isDev ? '-D ' : ''}${pkgs}`;
  }
}
