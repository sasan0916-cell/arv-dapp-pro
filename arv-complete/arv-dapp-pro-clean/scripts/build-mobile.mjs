import { existsSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const apiDir = 'app/api';
const disabledDir = 'app/_api_disabled_for_mobile';
let moved = false;

try {
  if (existsSync(apiDir)) {
    renameSync(apiDir, disabledDir);
    moved = true;
  }

  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'build', '--webpack'], {
    stdio: 'inherit',
    env: { ...process.env, MOBILE_BUILD: '1' },
  });
} finally {
  if (moved && existsSync(disabledDir)) renameSync(disabledDir, apiDir);
}
