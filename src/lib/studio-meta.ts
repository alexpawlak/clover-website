import { execSync } from 'node:child_process';
import packageJson from '../../package.json';

export const STUDIO_NAME = 'Clover Studio';
export const STUDIO_SUBTITLE = 'Offers and photo moderation';

export type StudioMeta = {
  versionLabel: string;
  updatedLabel: string | null;
  updatedTooltip: string | null;
};

function formatVisibleUpdate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDetailedUpdate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStudioMeta(): StudioMeta {
  const versionLabel = `v${packageJson.version}`;

  try {
    const raw = execSync('git log -1 --format=%ci%n%s', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    const [commitDateRaw, ...messageLines] = raw.split('\n');
    const commitMessage = messageLines.join(' ').trim();
    const commitDate = new Date(commitDateRaw);

    if (Number.isNaN(commitDate.getTime())) {
      return { versionLabel, updatedLabel: null, updatedTooltip: null };
    }

    return {
      versionLabel,
      updatedLabel: formatVisibleUpdate(commitDate),
      updatedTooltip: `Updated ${formatDetailedUpdate(commitDate)}${commitMessage ? ` • ${commitMessage}` : ''}`,
    };
  } catch {
    return { versionLabel, updatedLabel: null, updatedTooltip: null };
  }
}
